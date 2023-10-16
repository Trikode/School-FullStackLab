import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import SignInLayout from "./SignInLayout";

export default function Layout({ children }) {
  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <NavBar />

      <SignInLayout
        text='Please Sign-in to see your account.'
      >
        {children}
      </SignInLayout>

      {/* <Footer /> */}
    </main>
  );
}