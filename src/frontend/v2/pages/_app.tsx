import App, { AppProps } from 'next/app';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/globals.css';

import SideBar from '@/components/SideBar/index';
import Head from 'next/head';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={darkTheme}>
        <Head>
            <title>Taggy v2</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

          <SideBar/>
        {/* <CssBaseline /> */}
        <Component {...pageProps} />
        </ThemeProvider>
    )
  }