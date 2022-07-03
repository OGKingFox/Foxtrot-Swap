import { Button, Modal, Table, Image, Grid, Text, useModal, useAsyncList, Input } from "@nextui-org/react";
import { useState } from "react";
import Wallet from "../helpers/Wallet";
import TokenBalance from "./TokenBalance";

const tokens = require("../tokens");

export default function TokenModal({ active, changeHandler }) {
    
    const { setVisible, bindings } = useModal();

    const update = (e, token) => {
        setVisible(false);
        changeHandler(token);
    }

    const getRows = () => {
        let list = [];
       
        tokens.forEach(async(token, index) => {
            list.push(
            <Button light css={{ w: "100%", br: 0, py: 30 }} 
                    onPress={(e) => update(e, token)}
                    className="token-list-item" 
                    key={index}>
                <Grid.Container alignItems="center">
                    <Grid css={{ width: 50 }}>
                        <Image src={`/img/icons/tokens/${token.symbol.toLowerCase()}.png`} height={28}/>
                    </Grid>
                    <Grid xs>
                        <div>
                            <Text css={{ lh: 1.2 }}>
                                {token.title} 
                            </Text>
                            <TokenBalance token={token}/>
                        </div>
                    </Grid>
                    <Grid>
                        <Text size={12} color={"$gray800"}>{token.symbol}</Text>
                    </Grid>
                </Grid.Container>
            </Button>);
        });

        return list;
    }

    return(
        <>
            <Button onClick={() => setVisible(true)}
                auto 
                css={{ ml: 5, pl: 10 }}
                className="token-button">
                
                <Grid.Container alignItems="center">
                    <Grid css={{ pr: 5 }}>
                        <Image src={`/img/icons/tokens/${active.symbol.toLowerCase()}.png`} 
                            height={18} />
                    </Grid>
                    <Grid>
                        <Text size={12}>
                            {active.symbol}
                        </Text>
                    </Grid>
                </Grid.Container>
            </Button>

            <Modal closeButton {...bindings}  aria-labelledby="modal-title">
                <Modal.Header>
                    Select a Token
                </Modal.Header>
                
                <Modal.Body css={{ px: 12 }}>
                    <Input placeholder="Search for a token..."/>
                </Modal.Body>
                
                <Modal.Body css={{ p: 0 }}>
                    <div className="scrollable">
                        {getRows()}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}