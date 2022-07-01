import { useTheme as useNextTheme } from 'next-themes'

import { 
    Button, useModal, Modal, Grid, Switch, useTheme, Dropdown, Text, Input
} from "@nextui-org/react";

import { Settings } from "react-feather";
import { useWc } from '../context/connect.context';
import { useSwap } from '../context/swap.context';

import Functions from '../helpers/Functions';

export default function SettingsModal() {

    const { setVisible, bindings } = useModal();
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    const { disconnect, account } = useWc();
    const { speed, setTxnSpeed } = useSwap();

    const toggleTheme = () => {
        if (isDark) {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    }

    const getSpeed = () => {
        if (speed == 5) 
            return <Text color="success">Normal (5)</Text>;
        if (speed == 6) 
            return <Text color="warning">Fast (6)</Text>;
        if (speed == 7) 
            return <Text color="error">Instant (7)</Text>;
        return <Text color="error">Normal</Text>;
    }

    return(
        <>
            <Button onClick={() => setVisible(true)} auto light css={{ p: 5 }}>
                <Settings style={{ marginTop: 15 }} size={18}/>
            </Button>

            <Modal {...bindings} aria-labelledby="modal-title">
                <Modal.Header>
                    <div>
                        <Text>Settings</Text>
                        {account && 
                            <Text>
                                Wallet: {Functions.shortenAddress(account)}
                            </Text>
                        }
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {<Grid.Container alignItems="center" justify="space-between">
                        <Grid>
                           <div>
                                Transaction Speed
                           </div>
                        </Grid>
                        <Grid>
                            <Dropdown>
                                <Dropdown.Button light css={{ px: 0 }}>
                                   {getSpeed()}
                                </Dropdown.Button>
                                <Dropdown.Menu aria-label="Static Actions" onAction={(key) => setTxnSpeed(key)}>
                                    <Dropdown.Item key="normal" color="success">
                                        Normal (5)
                                    </Dropdown.Item>
                                    <Dropdown.Item key="fast" color="warning">
                                        Fast (6)
                                    </Dropdown.Item>
                                    <Dropdown.Item key="instant" color="error">
                                        Instant (7)
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Grid>
                    </Grid.Container>}

                    <Text size={12} css={{ mb: 20 }}>
                        The faster you set the transaction speed, the more GWEI it
                        will consume, and you will pay more in fees.
                    </Text>

                    <Grid.Container alignItems="center" justify="space-between">
                        <Grid>Dark Mode</Grid>
                        <Grid>
                            <Switch 
                                aria-label="change theme"
                                initialChecked={type == "dark"} 
                                checked={type == "dark"} 
                                color="success"
                                onChange={(e) => toggleTheme(e)} />
                        </Grid>
                    </Grid.Container>
                    <Grid.Container alignItems="center" justify="space-between">
                        <Grid>Deadline (Minutes)</Grid>
                        <Grid>
                            <Input 
                                aria-label="deadline"
                                type="number"
                                initialValue='20'
                                color="success" />
                        </Grid>
                    </Grid.Container>
                </Modal.Body>
                <Modal.Footer>
                    {account && 
                    <Button auto onClick={() => disconnect()} color="error">
                        Disconnect
                    </Button>
                    }
                    <Button auto light onClick={() => setVisible(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}