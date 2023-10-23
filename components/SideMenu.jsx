import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Drawer from 'react-modern-drawer';

import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useProfile } from "../context/user";

import 'react-modern-drawer/dist/index.css';
import Button, { ButtonGreyWithIcon, ButtonSocialLogin, IconButton } from "./elements/Button";
import InputLabel from "./elements/InputLabel";

export default function SideMenu() {

  const router = useRouter();
  const {
    hasFinished,

    // Panel
    open,
    setOpen,
    selectedPanel,
    setSelectedPanel,
  } = useProfile();

  useEffect(() => {
    if (hasFinished === false && !open) {
      setSelectedPanel(1);
      setOpen(true);
    }
  }, [hasFinished]);

  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.pathname]);

  return (
    <>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        direction='right'
        size={'unset'}
        customIdSuffix='SideMenu'
        duration={285}
        overlayOpacity={0.1}
        lockBackgroundScroll={true}
        style={{
          minWidth: '28rem',
          boxShadow: 'none',
        }}
      >
        <div
          className="Full Flex Column StartLeft SideMenuBody"
          style={{
            height: '100vh',
            overflowY: 'scroll',
            padding: '0 2rem 2.5rem',
            color: 'black',
          }}>
          <div
            className="Full Flex"
            style={{
              minHeight: '5rem',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <IconButton
              icon="/Close.svg"
              onClick={() => setOpen(false)}
            />
          </div>
          {selectedPanel === 1 && <AccountPreview />}
        </div>
      </Drawer>

      <IconButton
        icon="/User.svg"
        onClick={() => {
          setSelectedPanel(1);
          setOpen(true);
        }}
      />
    </>
  );
}

const AccountPreview = () => {

  const supabase = useSupabaseClient();
  const [isNew, setIsNew] = useState(false);
  const {
    profile,
    isAdmin,
    loadingProfile,
    hasFinished,
    getProfileFromSupabase,
    signInWithGoogle,
    signOut,
  } = useProfile();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (profile) {
      if (firstName.trim() && lastName.trim() && studentNumber.trim()) {
        if (firstName !== profile.firstname || lastName !== profile.lastname || studentNumber !== profile.studentNumber) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } else {
        setIsValid(false);
      }
    } else {
      if (firstName.trim() && lastName.trim() && studentNumber.trim()) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  }, [firstName, lastName, studentNumber]);

  async function updateProfile() {
    const { error } = await supabase
      .from('profiles')
      .update({
        firstname: firstName,
        lastname: lastName,
        studentNumber: studentNumber,
      })
      .eq('id', profile.id);
    if (error) {
      console.log("🚀 ~ file: SideMenu.jsx:367 ~ updateProfile ~ error:", error);
    } else {
      await getProfileFromSupabase();
      setFirstName('');
      setLastName('');
      setStudentNumber('');
      if (isEditing === true) {
        setIsEditing(false);
      }
    }
  }

  return (
    !loadingProfile && (
      <div
        className="Full Flex Column StartLeft"
        style={{
          gap: '2rem'
        }}>
        {profile ? (
          hasFinished ? (
            <>
              <div className="Flex Column StartLeft">
                <p className="Big">Welcome,</p>
                <p className="Big Bold">{profile.firstname}</p>
              </div>
              <div className="Full Flex StartLeft">
                {isAdmin && (
                  <Link href="/admin" target="_blank" className="Link">
                    <ButtonGreyWithIcon
                      text="Admin Dashboard"
                      icon="/OpenFullPage.svg"
                    />
                  </Link>
                )}
                <div
                  className="Full"
                  style={{
                    border: '1px solid var(--borderBlack)',
                    borderRadius: '0.5rem',
                  }}>
                  <nav
                    className="Full Flex SpaceBetCen"
                    style={{
                      height: '3.8rem',
                      background: 'var(--bgGrey)',
                      borderRadius: '0.5rem 0.5rem 0 0',
                      padding: '0 2rem',
                    }}>
                    <ul className="Mid">Settings</ul>
                    <ul
                      className="Mid SecondaryText onHover Pointer"
                      onClick={() => setIsEditing(!isEditing)}>
                      {isEditing ? 'Cancel' : 'Edit'}
                    </ul>
                  </nav>
                  <div
                    className="Full Flex StartLeft"
                    style={{
                      padding: '1.5rem 2rem',
                    }}>
                    {!isEditing && (
                      <div
                        className="Flex Column StartLeft"
                        style={{ gap: '1.25rem' }}>
                        <div
                          className="Flex Column StartLeft"
                          style={{ gap: '0.25rem' }}>
                          <p className="Mid SecondaryText">Name</p>
                          <p className="Mid">{profile.firstname}&nbsp;{profile.lastname}</p>
                        </div>
                        <div
                          className="Flex Column StartLeft"
                          style={{ gap: '0.25rem' }}>
                          <p className="Mid SecondaryText">Student Number</p>
                          <p className="Mid">{profile.studentNumber}</p>
                        </div>
                      </div>
                    )}
                    {isEditing && (
                      <div
                        className="Flex Column StartLeft"
                        style={{ gap: '2rem' }}>
                        <div
                          className="Flex Column StartLeft"
                          style={{ gap: '1.25rem' }}>
                          <InputLabel
                            label="First Name"
                            widthValue="15rem"
                            value={firstName}
                            placeholder={profile && profile.firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                            clearFunction={() => setFirstName('')}
                          />
                          <InputLabel
                            label="Last Name"
                            widthValue="15rem"
                            value={lastName}
                            placeholder={profile && profile.lastname}
                            onChange={(e) => setLastName(e.target.value)}
                            clearFunction={() => setLastName('')}
                          />
                          <InputLabel
                            label="Student Number"
                            widthValue="15rem"
                            value={studentNumber}
                            type="number"
                            placeholder={profile && profile.studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            clearFunction={() => setStudentNumber('')}
                          />
                        </div>
                        <Button
                          text="Done"
                          onClick={updateProfile}
                          disabled={!isValid}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {!isEditing && (
                <div
                  className="Full Flex SpaceBetCen"
                  style={{
                    paddingTop: '2.25rem',
                    borderTop: '1px solid var(--borderBlack)',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                  }}
                >
                  <div className="Flex Column StartLeft">
                    <p className="Mid">Going away?</p>
                    <p className="Mid SecondaryText">See you soon.</p>
                  </div>
                  <Button
                    text="Sign-out"
                    onClick={signOut}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <p className="Big">Please fill</p>
              <div
                className="Flex Column StartLeft"
                style={{ gap: '1.25rem' }}>
                <InputLabel
                  label="First Name"
                  value={firstName}
                  placeholder=""
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <InputLabel
                  label="Last Name"
                  value={lastName}
                  placeholder=""
                  onChange={(e) => setLastName(e.target.value)}
                />
                <InputLabel
                  label="Student Number"
                  value={studentNumber}
                  placeholder=""
                  onChange={(e) => setStudentNumber(e.target.value)}
                />
              </div>
              <Button
                text="Finish"
                onClick={updateProfile}
                disabled={!isValid}
              />
            </>
          )
        ) : (
          <>
            <div
              className="Full Flex Column StartLeft"
              style={{ gap: '2rem' }}>
              <p className="Big">{isNew ? 'Sign-up' : 'Sign-in'}</p>

              <ButtonSocialLogin onClick={signInWithGoogle}>
                <img src="/Google.svg" style={{ width: '2.2rem', height: '1.9rem' }} />
                <p className="SemiBig" style={{ textAlign: 'left' }}>
                  Google
                </p>
              </ButtonSocialLogin>

              <div className="Flex Column StartLeft">
                <p className="Mid SecondaryText">
                  {isNew ? 'Already of us?' : 'New here?'}
                </p>
                <p
                  className="Mid Bold Pointer"
                  onClick={() => setIsNew(!isNew)}>
                  {isNew ? 'Sign-in' : 'Sign-up'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    )
  );
};