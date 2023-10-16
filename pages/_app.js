import Head from 'next/head';
import { useState } from 'react';

// Supabase
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { UserProvider } from '../context/user';

import '../style/global.css';
import '../style/main.css';
import '../style/reset.css';
import '../style/components/styleFooter.css';

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
          {getLayout(<Component {...pageProps} />)}
        </UserProvider>
      </SessionContextProvider>
    </>
  );
}
