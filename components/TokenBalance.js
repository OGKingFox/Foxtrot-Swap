import { useEffect, useState } from "react"
import { Text, Loading } from "@nextui-org/react";
import Wallet from "../helpers/Wallet";
import Functions from "../helpers/Functions";
import { useWc } from "../context/connect.context";

export default function TokenBalance(token) {

    const { account } = useWc();
    const [ balance, setBalance ] = useState(null);

    useEffect(() => {
        async function getBalance() {
            if (!account) {
                setBalance(0);
                return;
            }

            let wallet = new Wallet(account);
            let bal    = 0;

            if (token.token.symbol == "BNB") {
                bal = await wallet.getBnbBalance();
            } else {
                bal = await wallet.getBalance(token.token)
            }
            
            setBalance(bal);
        }

        getBalance();
    }, []);

    return (
        <>
        {balance != null 
            ? <Text size={14} color={balance == 0 ? "error" : "success"} css={{ lh: 1.2 }}>
                  {Functions.formatNumber(balance, balance == 0 ? 0 : 6)}
              </Text>
            : <Loading size="xs"/>
        }
        </>
    )

}