import App, { AppProps } from 'next/app';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/globals.css';

import SideBar from '@/components/SideBar/index';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={darkTheme}>
          <SideBar/>
        {/* <CssBaseline /> */}
        <Component {...pageProps} />
        </ThemeProvider>
    )
  }