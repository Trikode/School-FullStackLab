import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../layout/Layout';
import SignInLayout from '../layout/SignInLayout';
import { TransitionElement } from '../layout/TransitionElement';

import { useProfile } from '../context/user';

export default function SignIn() {

  const router = useRouter();

  return (
    <>
      <div
        className="Full Flex Column Center"
        style={{
          padding: '4rem 0rem',
          gap: '4rem'
        }} />
    </>
  );
}

SignIn.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};