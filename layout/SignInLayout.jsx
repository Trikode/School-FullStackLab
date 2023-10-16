import { useRouter } from "next/router";

import { useProfile } from "../context/user";

import Button from "../components/elements/Button";
import { TransitionElement } from "./TransitionElement";


export default function SignInLayout({ children, text }) {

  const {
    isSignedIn,
    openSignInPanel
  } = useProfile();

  if (isSignedIn === null) return (
    <LoadingWaiting />
  );

  if (isSignedIn === false) return (
    <div
      className="Full Flex Column Center"
      style={{
        padding: '6rem 0',
        gap: '2rem'
      }}>
      <div className="Flex Column Center" style={{ gap: '0.5rem' }}>
        <p className="Subtitle Bold">Welcome</p>
        <TransitionElement>
          <p className="Big">{text}</p>
        </TransitionElement>
      </div>
      <Button
        text="Sign-in"
        onClick={openSignInPanel}
      />
    </div>
  );

  if (isSignedIn === true) return (
    <> {children} </>
  );
}

export function LoadingWaiting() {
  return (
    <div
      className="Full Flex Column Center"
      style={{
        padding: '6rem 0',
      }}>
      <p className="Big SecondaryText">Loading...</p>
    </div>
  );
}

export function AdminLayout({ children, text }) {

  const router = useRouter();
  const {
    isSignedIn,
    isAdmin,
  } = useProfile();

  if (isSignedIn === null || isAdmin === null) return (
    <LoadingWaiting />
  );

  if (isSignedIn === false && isAdmin === false) return (
    <div
      className="Full Flex Column Center"
      style={{
        padding: '6rem 0 5rem',
        gap: '2rem'
      }}>
      <div className="Flex Column Center" style={{ gap: '0.5rem' }}>
        <p className="Subtitle Bold">Oops!</p>
        <p className="Big">{text}</p>
      </div>
      <Button
        text="Back to Home"
        onClick={() => router.push('/')}
      />
    </div>
  );

  if (isSignedIn === true && isAdmin === true) return (
    <> {children} </>
  );
}