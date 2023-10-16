import { useRouter } from "next/router";

import Button from "../components/elements/Button";

export default function Custom404() {
  const router = useRouter();
  return (
    <>
      <div
        className="Full Flex"
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          position: 'sticky',
          top: 0,
          height: '5rem',
          padding: '0 2rem',
          color: 'black',
          borderBottom: '1px solid var(--borderBlack)',
          zIndex: 200,
        }}
      >
        <p className="SemiBig Bold">MySchool</p>
      </div>
      <div
        className="Full Flex Column Center"
        style={{
          padding: '6rem 0rem 4.35rem',
          gap: '4rem'
        }}>

        <div className='Flex Column Center'>
          <p className='Subtitle'> Sorry! </p>
          <p className='Title Bold'> Error 404. </p>
        </div>

        <Button
          text='Home'
          onClick={() => router.push('/')}
        />
      </div>
    </>
  );
}