import '../public/css/themes/light.css';
import '../public/css/themes/dark.css';
import '../public/css/grid.css';
import '../public/css/globals.css';
import '../public/css/main.css';

import NextNProgress from "nextjs-progressbar";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { WcProvider } from '../context/connect';
import { SwapProvider } from '../context/swap';
import { MoralisProvider } from 'react-moralis';

const lightTheme = createTheme({ type: 'light' });
const darkTheme  = createTheme({ type: 'dark'  });

const serverUrl = "https://hav42kwuc8bt.usemoralis.com:2053/server";
const appId     = "PWIM500b9gI61PSF55eO4xwtez1UINhNIa68vG0C";

function MyApp({ Component, pageProps }) {

    return (
        <MoralisProvider serverUrl={serverUrl} appId={appId}> 
            <WcProvider>
                <SwapProvider>
                    <NextNProgress />
                    <NextThemesProvider
                        defaultTheme="dark"
                        attribute="class"
                        value={{
                            light: lightTheme.className,
                            dark: darkTheme.className
                        }}>
                        <NextUIProvider>
                            <Component {...pageProps} />
                        </NextUIProvider>
                    </NextThemesProvider>
                </SwapProvider>
            </WcProvider>
        </MoralisProvider>
    );
}

export default MyApp;