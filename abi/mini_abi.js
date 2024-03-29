module.exports = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs":[
           {
              "internalType":"address",
              "name":"spender",
              "type":"address"
           },
           {
              "internalType":"uint256",
              "name":"amount",
              "type":"uint256"
           }
        ],
        "name":"approve",
        "outputs":[
           {
              "internalType":"bool",
              "name":"",
              "type":"bool"
           }
        ],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[
           {
              "internalType":"address",
              "name":"owner_",
              "type":"address"
           },
           {
              "internalType":"address",
              "name":"spender",
              "type":"address"
           }
        ],
        "name":"allowance",
        "outputs":[
           {
              "internalType":"uint256",
              "name":"",
              "type":"uint256"
           }
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    ,
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"amountOut",
             "type":"uint256"
          },
          {
             "internalType":"address[]",
             "name":"path",
             "type":"address[]"
          },
          {
             "internalType":"address",
             "name":"to",
             "type":"address"
          },
          {
             "internalType":"uint256",
             "name":"deadline",
             "type":"uint256"
          }
       ],
       "name":"swapETHForExactTokens",
       "outputs":[
          {
             "internalType":"uint256[]",
             "name":"amounts",
             "type":"uint256[]"
          }
       ],
       "stateMutability":"payable",
       "type":"function"
    },
    {
       "inputs":[
          {
             "internalType":"uint256",
             "name":"amountOutMin",
             "type":"uint256"
          },
          {
             "internalType":"address[]",
             "name":"path",
             "type":"address[]"
          },
          {
             "internalType":"address",
             "name":"to",
             "type":"address"
          },
          {
             "internalType":"uint256",
             "name":"deadline",
             "type":"uint256"
          }
       ],
       "name":"swapExactETHForTokens",
       "outputs":[
          {
             "internalType":"uint256[]",
             "name":"amounts",
             "type":"uint256[]"
          }
       ],
       "stateMutability":"payable",
       "type":"function"
    },
    {
        "inputs":[
           {
              "internalType":"uint256",
              "name":"amountIn",
              "type":"uint256"
           },
           {
              "internalType":"address[]",
              "name":"path",
              "type":"address[]"
           }
        ],
        "name":"getAmountsOut",
        "outputs":[
           {
              "internalType":"uint256[]",
              "name":"amounts",
              "type":"uint256[]"
           }
        ],
        "stateMutability":"view",
        "type":"function"
     },
]
