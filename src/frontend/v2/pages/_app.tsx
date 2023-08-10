import App, { AppProps } from 'next/app';
import { useEffect } from 'react';
import cookie from 'cookie';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styled from '@emotion/styled';
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

const BodyWrapper = styled.div`   
  display: flex;
`


const noAuthPaths = ["/account/signin", "/account/signup"]

export default function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    

    let showSideBar = true;
    let noAuthPage = false;
    if (noAuthPaths.includes(router.asPath)){
      showSideBar = false;
      noAuthPage = true;
    }
    if (typeof document !== 'undefined' && !noAuthPage){
      let cookies = cookie.parse(document.cookie);
      let token_exists = cookies.token_exists;
  
      if (!token_exists){
        router.push("/account/signin");
      }
    }
    

    return (<>
        <ThemeProvider theme={darkTheme}>
        <Head>
            <title>Taggy v2</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <BodyWrapper>
        { showSideBar &&<SideBar/>}
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
        </BodyWrapper>
        </ThemeProvider>
        </>
    )
  }