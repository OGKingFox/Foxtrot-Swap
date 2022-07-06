// src/context/state.js
import { createContext, useContext, useState, useEffect } from 'react';
import Functions from '../helpers/Functions';
import Token from '../helpers/Token';
import Wallet from '../helpers/Wallet';
import { useWc } from './connect.context';
import web3 from 'web3';

const SwapContext = createContext();

const miniabi   = require("../abi/mini_abi");
const pcsrouter = require("../abi/pancakeswap");
const tokens    = require("../tokens");
const etherjs   = require('ethers');

export function SwapProvider({ children }) {

    const bnb_addr  = process.env.NEXT_PUBLIC_bnb_address;
    const pcs_addr  = process.env.NEXT_PUBLIC_pcs_address;

    const { 
        account, 
        ethers, 
        provider 
    } = useWc();
    
    const [sending, setSending]       = useState(false);
    const [working, setWorking]       = useState(false);
    const [approving, setApproving]   = useState(false);

    const [txn, setTxn]               = useState(null); // txn array
    const [error, setError]           = useState(null); // err string
    const [fromToken, setFromToken]   = useState(tokens[0]);
    const [toToken, setToToken]       = useState(tokens[1]);
    const [total, setTotal]           = useState(0);
    const [fromAmount, setFromAmount] = useState(0);
    const [toAmount, setToAmount]     = useState(0);
    const [slippage, setSlippage]     = useState(10);
    const [speed, setSpeed]           = useState(5);
    const [deadline, setDeadline]     = useState(20);

    /**
     * asks for approval if {@link fromToken} is not bnb
     * then sends transaction to connected wallet to swap once approved.
     */
    const swapTokens = async() => {
        if (!account) {
            return;
        }

        if (fromToken.symbol != "BNB") {
            let allowance = await getAllowance();

            if (allowance[0] == 0) {
                let approval = await getApproval();
                if (!approval) {
                    setError("Swap not approved");
                }
            }
        }

        if (fromAmount == 0) {
            setError("Input must be greater than 0!")
            return;
        }

        await doSwap();
    }

    /**
     * Swaps the tokens
     */
    const doSwap = async() => {
        let abi       = require("../abi/pancakeswap");
        let bnb_addr  = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        let router    = new etherjs.Contract(pcs_addr.toLowerCase(), abi, ethers.getSigner());

        let receipt;

        try {
            if (fromToken.contract.toLowerCase() == bnb_addr.toLowerCase()) {
                receipt = await initBuy(router);
            } else if (toToken.contract.toLowerCase() == bnb_addr.toLowerCase()) {
                receipt = await initSell(router);
            } else {
                // probably need to do swapTokensForTokens in this instance
            }

            console.log(receipt);

            setWorking(false);
            setTxn(receipt);
        } catch (err) {
            console.log(err);

            setWorking(false);
            setError(err.message ? err.message : err)
        }
    }
    
    /**
     * Initializes a buy of a token using WBNB 
     * @param {etherjs.Contract} router 
     * @returns {Promise|Array} transaction receipt
     */
    const initSell = async(router) => {
        // the trade route. from token -> to token
        let route = [ 
            fromToken.contract.toLowerCase(),
            //"0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56".toLowerCase(),
            toToken.contract.toLowerCase()
        ];

        let fixedIn   = Functions.fixed(fromAmount, fromToken.decimals);
        let inWei     = etherjs.utils.parseUnits(fixedIn, 'gwei');

        console.log(inWei.toString());

        let amountOut = toAmount - (toAmount * (slippage / 100));
            amountOut = Functions.toFixed(amountOut); // convers exponents to full numbers
        let fixedOut  = Functions.fixed(amountOut, toToken.decimals);
        let fixedWei  = etherjs.utils.parseUnits(fixedOut, toToken.decimals);

        console.log(fixedWei.toString());
        
        const txn = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            inWei, // exact tokens to sell
            fixedWei, // min amount of bnb to get
            route,
            account, // account address
            (Math.floor(Date.now()/1000) + (60 * deadline)), {
                from: account,
                gasLimit: "1300000"
            }
        );

        return txn.wait(); // wait for a receipt
    }

    /**
     * Initializes a buy of a token using WBNB 
     * @param {etherjs.Contract} router 
     * @returns {Promise|Array} transaction receipt
     */
    const initBuy = async(router) => {
        // the trade route. from token -> to token
        let route   = [ 
            fromToken.contract.toLowerCase(),
            toToken.contract.toLowerCase()
        ];

        // calculate the minimum amount of tokens to receive after slippage
        let minimum = fromAmount - (fromAmount * (slippage / 100));
        let fromWei = web3.utils.toWei(Functions.fixed(minimum, fromToken.decimals));
        let amtsOut = await router.getAmountsOut(fromWei, route);
        
        setWorking(true);

        const txn = await router.swapExactETHForTokens(
            amtsOut[1], // minimum tokens to receive
            route,
            account, // account address
            Date.now() + (1000 * 60 * 20), {
                value: amtsOut[0], // amount of bnb
                from: account
            }
        );

        return txn.wait(); // wait for a receipt
    }

    /**
     * Returns the amount of tokens the swap is allowed to trade in both wei and integer format
     * @returns {Promise|Array} an array containing spending limit
     */
    const getAllowance = async() => {
        if (!account) {
            return;
        }

        const contract = new etherjs.Contract(fromToken.contract, miniabi, ethers.getSigner());
        const result   = await contract.allowance(account, pcs_addr.toLowerCase(), { from: account });
        const decimals = await contract.decimals();
        const limit    = etherjs.utils.formatEther(result);

        return [ limit, limit / 10 ** decimals, decimals ];
    }

    /**
     * Sends a spending approval request to connected wallet at maximum value
     * so user doesn't have to re-approve on every trade.
     * @returns {Promise|Boolean} true if approved successfully
     */
    const getApproval = async() => {
        if (!account) {
            return;
        }

        setApproving(true);

        // get the maximum amount possible to approve
        let max_amt  = etherjs.utils.parseUnits((2 ** 64 - 1).toString(), 18);
        let contract = new etherjs.Contract(fromToken.contract, miniabi, ethers.getSigner());
        
        // a promise that's called after 5 minutes
        let timeout = new Promise((resolve, reject) => {
            let id = setTimeout(() => {
                clearTimeout(id);
                reject('No transaction within 300 seconds.');
            }, (1000 * 60 * 5));
        })

        // a promise that calls the contracts approve function
        // and waits for it to execute
        let approve = new Promise((resolve, reject) => {
            contract.approve(pcs_addr.toLowerCase(), max_amt).then((txn) => {
                resolve(txn);
            });
        });

        try {
            // we race the two promises above to see which finishes first.
            // if the 5 minute timer expires first, display an error
            let txn = await Promise.race([ approve, timeout ]);
            let receipt = await txn.wait();
            
            // if we have a receipt, and it was successful
            if (receipt && receipt.status == 1) {
                setApproving(false);
                return true;
            } else {
                setApproving(false);
                return false;
            }
        } catch(err) {
            setApproving(false);
            setError(err.message ? err.message : err);
            return false;
        }
    }

    /**
     * Set the amount of {@link fromToken} and calculate how much of {@link toToken} 
     * they will receive for said amount
     * @param {Integer} value 
     */
    const setAmt1 = async(value) => {
        if (!account) {
            return;
        }

        setFromAmount(value);

        let t1 = new Token(fromToken, account);
        let t2 = new Token(toToken, account);

        let p1 = await t1.getValue();
        let p2 = await t2.getValue();

        let total  = value * p1;
        let tokens = (total / p2);

        setTotal(total);
        setToAmount(Functions.toFixed(tokens));
    }

    /**
     * Set the amount of {@link toToken} and calculate how much {@link fromToken} 
     * is needed in order to receive the amount
     * @param {Integer} value 
     */
    const setAmt2 = async(value) => {
        if (!account) {
            return;
        }

        setToAmount(value);

        let t1 = new Token(fromToken, account);
        let t2 = new Token(toToken, account);

        let p1 = await t1.getValue();
        let p2 = await t2.getValue();

        let total   = value * p2;
        let tokens  = (total / p1);

        setTotal(total);
        setFromAmount(Functions.toFixed(tokens));
    }

    /**
     * Gets the users balance for {@link fromToken} and updates {@link fromAmount}
     * to the value returned.
     */
    const maxAmt1 = async() => {
        if (!account) {
            return;
        }

        let wallet = new Wallet(account);
        let bal    = 0;

        if (fromToken.symbol == "BNB") {
            bal = await wallet.getBnbBalance();
        } else {
            bal = await wallet.getBalance(fromToken);
        }

        setAmt1(bal)
    }

    /**
     * Gets the users balance for {@link toToken} and updates {@link toAmount}
     * to the value returned.
     */
    const maxAmt2 = async() => {
        if (!account) {
            return;
        }

        let wallet = new Wallet(account);
        let bal    = 0;

        if (toToken.symbol == "BNB") {
            bal = await wallet.getBnbBalance();
        } else {
            bal = await wallet.getBalance(toToken);
        }

        setAmt2(bal)
    }

    /**
     * Updates {@link fromToken} and swaps out {@link toToken} if they match.
     * @param {Array} token 
     * @returns 
     */
    const updateToken1 = (token) => {
        if (toToken.contract == token.contract) {
            setFromToken(token);
            setToToken(fromToken);
            return;
        }
        
        setFromToken(token);
    }

    /**
     * Updates {@link toToken} and swaps out {@link fromToken} if they match.
     * @param {Array} token 
     * @returns 
     */
    const updateToken2 = (token) => {
        if (fromToken.contract == token.contract) {
            setToToken(token);
            setFromToken(toToken);
            return;
        }

        setToToken(token);
    }

    /**
     * Updates transaction speed based on key provided (normal, fast, or instant)
     * value is in gwei
     * @param {String} key 
     */
    const setTxnSpeed = (key) => {
        switch (key) {
            case "normal":
                setSpeed(5);
                break;
            case "fast":
                setSpeed(6);
                break;
            case "instant":
                setSpeed(7);
                break;
        }
    }

    return (
        <SwapContext.Provider value={{ 
            fromToken,
            toToken,
            setFromToken,
            setToToken,
            fromAmount,
            toAmount,
            setFromAmount,
            setToAmount,
            setAmt1,
            setAmt2,
            maxAmt1,
            maxAmt2,
            updateToken1,
            updateToken2,
            slippage,
            setSlippage,
            swapTokens,
            approving,
            setApproving,
            working,
            setWorking,
            txn,
            setTxn,
            error,
            setError,
            total,
            setTotal,
            speed,
            setTxnSpeed,
            sending
        }}>
            {children}
        </SwapContext.Provider>
    );

}

export const useSwap = () => useContext(SwapContext)