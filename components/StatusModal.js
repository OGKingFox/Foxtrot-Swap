import { useSwap } from "../context/swap.context";
import { Modal, Loading, Text, Button } from "@nextui-org/react";
import { ArrowRight, XCircle, CheckCircle } from "react-feather";
import Functions from "../helpers/Functions";
import { useWc } from "../context/connect.context";

export default function StatusModal() {

    const { account } = useWc();

    const {
        fromToken, toToken,
        updateToken1, updateToken2,
        fromAmount, setAmt1,
        toAmount, setAmt2,
        maxAmt1, maxAmt2,
        slippage, setSlippage,
        swapTokens, 
        total,
        working, setWorking, txn, setTxn, error, setError, 
        approving, setApproving
    } = useSwap();


    const closeHandler = () => {
        setWorking(false);
        setApproving(false);
        setTxn(null);
        setError(null);
    }

    return(
        <Modal preventClose={true} aria-labelledby="modal-title" open={working || (txn || error) || approving} onClose={closeHandler}>
            { approving && 
                <Modal.Body css={{ ta: "center", py: 30 }}>
                    <Loading size="xl"/>
                    <Text size={20} b>
                       Approve {fromToken.title}
                    </Text>

                    <Text css={{ mb: 20 }} size={12}>
                        Open your connected wallet to approve {fromToken.title}
                    </Text>
                    
                    <Text size={12} css={{ lh: 1.2 }}>
                        This will close in either 5 minutes or when the 
                        transaction is found. Always <a href={`https://bscscan.com/address/${account}`} target="_blank">Verify on BscScan</a> if 
                        txn is pending before trying this multiple times!
                    </Text>
                </Modal.Body>
            }
            
            { working && 
                <Modal.Body css={{ ta: "center", py: 30 }}>
                    <Loading size="xl"/>
                    <Text size={20}>
                        {fromToken.symbol} <ArrowRight size={12}/> {toToken.symbol}
                    </Text>
                    <Text size={12}>Swapping... This might take a minute</Text>
                </Modal.Body>
            }

            { error && 
                <Modal.Body css={{ ta: "center", py: 30 }}>
                    <Text color="error">
                        <XCircle size={64}/>
                    </Text>
                    <Text size={20}>An Error Occured</Text>
                    <Text size={12}>{error}</Text>
                    <Button auto css={{ w: 100, mx: "auto", mt: 20 }} color="error" onPress={() => closeHandler()}>
                        <Text css={{ ta: "center"}}>
                            Done
                        </Text>
                    </Button>
                </Modal.Body>
            }

            { txn && 
                <Modal.Body css={{ ta: "center", py: 30 }}>
                    <Text color="success">
                        <CheckCircle size={64}/>
                    </Text>
                    <Text size={20}>Transaction Complete</Text>
                    <Text size={12}>
                        <a href={`https://bscscan.com/tx/${txn.transactionHash}`} target="_blank">
                            View Receipt
                        </a>
                    </Text>
                    <Button auto css={{ w: 100, mx: "auto", mt: 20 }} color="success"  onPress={() => closeHandler()}>
                        <Text css={{ ta: "center"}}>
                            Done
                        </Text>
                    </Button>
                </Modal.Body>
            }
        </Modal>
    )

}