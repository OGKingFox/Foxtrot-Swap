// src/context/state.js
import { createContext, useContext, useEffect, useState } from 'react';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { ethers, providers } from "ethers";

const WcContext = createContext();

export function WcProvider({ children }) {

    const [ethers, setEthers]     = useState(null);
    const [provider, setProvider] = useState(null);
    const [account, setAccount]   = useState(null);

    useEffect(() => {
        async function connectWallet() {
            const provider = new WalletConnectProvider({
                rpc: {
                    56: "https://bsc-dataseed1.binance.org:443"
                },
                qrcode: false
            });
            
            await provider.enable();

            if (provider.connected) {
                const ethers   = new providers.Web3Provider(provider);
                const accounts = await ethers.listAccounts();
    
                setEthers(ethers);
                setAccount(accounts[0]);
            }

            setProvider(provider);
        }

        connectWallet();
    }, []);

    const connect = async() => {
        const provider = new WalletConnectProvider({
            rpc: {
                56: "https://bsc-dataseed1.binance.org:443"
            }
        });

        try {
            await provider.enable();
        } catch (err) {

        }

        setProvider(provider);
        
        if (provider.connected) {
            const ethers   = new providers.Web3Provider(provider);
            const accounts = await ethers.listAccounts();

            setEthers(ethers);
            setAccount(accounts[0]);
        }

        provider.on("accountsChanged", (accounts) => {
            console.log(accounts);
        });
          
        // Subscribe to chainId change
        provider.on("chainChanged", (chainId) => {
            console.log(chainId);
        });
          
          // Subscribe to session disconnection
        provider.on("disconnect", (code, reason) => {
            setAccount(null);
        });
    }

    const disconnect = async () => {
        provider.disconnect();
        setAccount(null);
    }
    
    return (
        <WcContext.Provider value={{ connect, disconnect, account, ethers, provider }}>
            {children}
        </WcContext.Provider>
    );

}

export const useWc = () => useContext(WcContext)