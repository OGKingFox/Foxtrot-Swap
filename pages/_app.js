import '../public/css/themes/light.css';
import '../public/css/themes/dark.css';
import '../public/css/grid.css';
import '../public/css/globals.css';
import '../public/css/main.css';

import NextNProgress from "nextjs-progressbar";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { WcProvider } from '../context/connect.context';
import { SwapProvider } from '../context/swap.context';

const lightTheme = createTheme({ type: 'light' });
const darkTheme  = createTheme({ type: 'dark'  });

function MyApp({ Component, pageProps }) {

    return (
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
    );
}

export default MyApp;