import App, { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from '@/components/SideBar/index';
import Head from 'next/head';

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


export default function MyApp({ Component, pageProps }: AppProps) {
    return (<>
        <ThemeProvider theme={darkTheme}>
        <Head>
            <title>Taggy v2</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

          <SideBar/>
        {/* <CssBaseline /> */}
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        </ThemeProvider>
        </>
    )
  }