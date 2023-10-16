import { useRouter } from "next/router";

import { ButtonRouterBack } from "../components/elements/Button";

export default function LayoutAdmin({ children }) {
  const router = useRouter();
  const blurValue = 'blur(4px)';
  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <div
        className="Full Flex SpaceBetCen"
        style={{
          position: 'sticky',
          top: 0,
          height: '5rem',
          color: 'black',
          borderBottom: '1px solid var(--borderBlack)',
          background: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: blurValue,
          WebkitBackdropFilter: blurValue,
          zIndex: 200,
        }}
      >
        <ButtonRouterBack
          onClick={() => router.push('/admin')}
        />
      </div>
      {children}
    </main>
  );
}