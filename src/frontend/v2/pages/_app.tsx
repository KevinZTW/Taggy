import App, { AppProps } from 'next/app';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/globals.css';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={darkTheme}>
        {/* <CssBaseline /> */}
        <Component {...pageProps} />
        </ThemeProvider>
    )
  }