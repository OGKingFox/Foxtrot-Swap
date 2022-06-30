const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org:443"));

class Wallet {

    address;

    constructor(address) {
        this.address = address;
    }

    getAddress() {
        return this.address;
    }

    async getBalance(token) {
        let call = await new web3.eth.call({
            to: token.contract, // contract address
            data: "0x70a08231000000000000000000000000"+this.address.replace("0x", "")
        });

        let decimals = await this.getDecimals(token.contract);
        return parseFloat((parseInt(call) / 10 ** decimals).toFixed(decimals));
    }

    static async getBalance2(tokenContract, address) {
        let call = await new web3.eth.call({
            to: tokenContract, // contract address
            data: "0x70a08231000000000000000000000000"+address.replace("0x", "")
        });
    
        let mini_abi = require("../abi/mini_abi");
        let contract = new web3.eth.Contract(mini_abi, tokenContract);
        let decimals = await contract.methods.decimals().call();

        return parseInt(call) / 10 ** decimals;
        
    }

    async getBnbBalance() {
        let call = await new web3.eth.getBalance(this.address);
        return parseFloat((parseInt(call) / 10 ** 18).toFixed(18));
    }

    async getDecimals(address) {
        let mini_abi = require("../abi/mini_abi");
        let contract = new web3.eth.Contract(mini_abi, address);
        let decimals = await contract.methods.decimals().call();
        return parseInt(decimals);
    }
}

module.exports = Wallet;