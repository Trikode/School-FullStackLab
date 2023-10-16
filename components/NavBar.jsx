import Link from "next/link";

import SideMenu from "./SideMenu";

export default function NavBar() {
  const blurValue = 'blur(4px)';
  return (
    <div
      className="Full Flex SpaceBetCen"
      style={{
        position: 'sticky',
        top: 0,
        height: '5rem',
        color: 'black',
        padding: '0 2rem',
        borderBottom: '1px solid var(--borderBlack)',
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: blurValue,
        WebkitBackdropFilter: blurValue,
        zIndex: 200,
      }}
    >
      <Link href='/' className="Link">
        <p className="SemiBig Bold">MySchool</p>
      </Link>
      <SideMenu />
    </div>
  );
}