import { Card, Button, Input, Text, Grid, Image } from "@nextui-org/react";
import Layout from "../components/Layout";
import SettingsModal from "../components/Settings";
import StatusModal from "../components/StatusModal";
import TokenModal from "../components/TokenModal";
import { useWc } from "../context/connect";
import { useSwap } from "../context/swap";
import Functions from "../helpers/Functions";

export default function Index() {

    const { connect, account } = useWc();

    const {
        fromToken,
        toToken,
        updateToken1,
        updateToken2,
        fromAmount,
        setAmt1,
        toAmount,
        setAmt2,
        maxAmt1,
        maxAmt2,
        slippage,
        setSlippage,
        swapTokens,
        total,
        working, 
        setWorking,
        approved
    } = useSwap();

    const startSwap = () => {
        swapTokens();
    }

    return(
        <Layout>
            <div className="row vh-100 align-items-center justify-content-center">
                <div className="content-container">
                    <div>
                        <Image src="/img/logo.svg" width={75} css={{ mb: 50 }}/>
                    </div>
                    <Card>
                        <Card.Header css={{ px: 21, pt: 30 }}>
                            <Grid.Container alignItems="center" justify="space-between">
                                <Grid>
                                    <Text size={20} css={{ lh: 1 }}>
                                        Foxtrot Swap
                                    </Text>
                                    <Text size={14} color="$gray800">
                                        Trade tokens
                                    </Text>
                                </Grid>
                                <Grid>
                                    <SettingsModal/>
                                </Grid>
                            </Grid.Container>
                        </Card.Header>
                        <Card.Body css={{ p: 20 }}>
                            <Input 
                                type="number"
                                label={
                                    <Text size={12} color="$gray800" css={{ lh: 1 }}>
                                        From
                                    </Text>
                                }
                                size="xl"
                                aria-label="first token"
                                css={{ mb: 10 }}
                                value={fromAmount}
                                onChange={(e) => setAmt1(e.target.value)}
                                initialValue={0}
                                contentLeftStyling={false}
                                contentLeft={
                                    <TokenModal
                                        changeHandler={updateToken1}
                                        active={fromToken}
                                    />
                                }
                                contentRightStyling={false}
                                contentRight={
                                    <Button auto css={{ px:10, bg: "transparent" }}
                                        onPress={(e) => maxAmt1(e)}>
                                        <Text size={12}>Max</Text>
                                    </Button>
                                }
                            />

                            <Input
                                size="xl"
                                type="number"
                                label={
                                    <Text size={12} color="$gray800" css={{ lh: 1 }}>
                                        To (Estimated)
                                    </Text>
                                }
                                css={{ mb: 10 }}
                                aria-label="second token"
                                initialValue={0}
                                value={toAmount}
                                onChange={(e) => setAmt2(e.target.value)}
                                contentLeftStyling={false}
                                contentLeft={
                                    <TokenModal
                                        changeHandler={updateToken2}
                                        active={toToken} /> 
                                }
                                contentRightStyling={false}
                                contentRight={
                                    <Button auto css={{ px:10, bg: "transparent" }}
                                        onPress={(e) => maxAmt2(e)}>
                                        <Text size={12}>Max</Text>
                                    </Button>
                                }/>
                            
                            <Grid.Container justify="space-between" alignItems="center" css={{ mb: 15 }}>
                                <Grid>
                                    <Input 
                                        label={
                                            <Text size={12} color="$gray800" css={{ lh: 1 }}>
                                                Slippage
                                            </Text>
                                        }
                                        min={0.5}
                                        max={100}
                                        step={0.5}
                                        type="number"
                                        aria-label="slippage"
                                        size="sm" 
                                        css={{ width: 100 }}
                                        contentLeftStyling={false}
                                        contentRightStyling={false}
                                        initialValue={slippage}
                                        onChange={(e) => setSlippage(e.target.value)}
                                        contentRight={
                                            <Text size={12} css={{ pr: 10 }}>%</Text>
                                        }/>
                                </Grid>
                                <Grid>
                                    <Text size={14} color="$gray800" css={{ lh: 1 }}>
                                        ~${Functions.formatNumber(total, 2)} USD
                                    </Text>
                                </Grid>
                            </Grid.Container>
                            
                            { account &&
                                <Button css={{ mt: 20 }} onClick={() => startSwap()} color="success">
                                    <Text css={{ ta: "center" }}>
                                        Swap
                                    </Text>
                                </Button>
                            }

                            { !account &&
                                <Button css={{ mt: 20 }} onClick={() => connect()} color="error">
                                    <Text css={{ ta: "center" }}>
                                        Connect Wallet
                                    </Text>
                                </Button>
                            }

                        </Card.Body>
                    </Card>

                    <StatusModal/>

                    <Text size={12} css={{ ta: "center", mt: 20 }} color="$gray800">
                        Copyright &copy; {new Date().getFullYear()} Your Token.  
                        Created by <a href="https://foxtrot-studios.co" target="_blank">Foxtrot Studios</a>
                    </Text>
                </div>
            </div>
        </Layout>
    )
}