import Head from 'next/head';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

// Supabase
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { UserProvider } from '../context/user';

import '../style/global.css';
import '../style/main.css';
import '../style/reset.css';
import '../style/components/styleFooter.css';
// Chakra UI
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const toastStyle = {
  background: 'white',
  borderRadius: '0.8rem',
  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)',
};

const theme = extendTheme({
  styles: {
    global: {
      body: {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        fontFamily: 'var(--font)',
        lineHeight: '1',
        color: 'unset',
        background: 'unset',
        backgroundColor: 'unset',
      },
      img: {
        height: 'inherit',
      },
    },
  },
});

export default function MyApp({ Component, pageProps }) {

  const getLayout = Component.getLayout || ((page) => page);
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <>
      <Head>
        <title> School </title>
        <link rel="icon" href="/Ball.svg" />
        <meta name="description" content="School e-Commerce." />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>

      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}>
        <UserProvider>
          <Toaster toastOptions={{ style: toastStyle }} />
          <ChakraProvider theme={theme}>
            {getLayout(<Component {...pageProps} />)}
          </ChakraProvider>
        </UserProvider>
      </SessionContextProvider>
    </>
  );
}
