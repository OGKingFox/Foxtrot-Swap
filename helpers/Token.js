const tokens  = require("../tokens");
const Binance = require("./Binance");
const Wallet  = require("./Wallet");

class Token {

    title;
    symbol;
    contract;
    pair;
    decimals;
    amount;

    constructor(arr) {
        this.title      = arr.title;
        this.symbol     = arr.symbol;
        this.contract   = arr.contract;
        this.pair       = arr.pair;
        this.decimals   = arr.decimals;
        this.amount     = 0;
    }

    setAmount(amt) {
        this.amount = amt;
    }

    async getValue() {
        let address   = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        let bnb_price = await Binance.getBnbPrice();

        if (this.contract.toLowerCase() == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
            return bnb_price;
        }

        let wbnb   = await Wallet.getBalance2(address, this.pair);
        let tokens = await Wallet.getBalance2(this.contract, this.pair);

        return wbnb / tokens * bnb_price;
    }
}

module.exports = Token;