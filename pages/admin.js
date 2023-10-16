import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AdminLayout, LoadingWaiting } from "../layout/SignInLayout";

import { useProfile } from "../context/user";
import { paymentMethods } from "../utils/lists";

import { AnimatePresence, motion } from "framer-motion";

import { ButtonGreyWithIcon } from "../components/elements/Button";

export const tabs = ['Orders', 'Products', 'Stats'];

export default function Admin() {
  const router = useRouter();

  const {
    selectedTab,
    setSelectedTab,

  } = useProfile();

  const styleUnderline = {
    position: 'absolute',
    bottom: '-1px',
    left: '0',
    right: '0',
    height: '1px',
    backgroundColor: 'var(--borderBlack)',
  };

  return (
    <AdminLayout
      text="You're not allowed to be here."
    >
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
          background: 'white',
          gap: '2rem',
        }}
      >
        <Link href='/' className="Link">
          <p className="SemiBig Bold">MySchool</p>
        </Link>
        <ButtonGreyWithIcon
          text="Upload Product"
          icon="/OpenFullPage.svg"
          onClick={() => router.push('/upload')}
        />
      </div>

      <div
        className="Full Column Flex Center"
        style={{
          padding: '2rem 2rem 2rem',
        }}>
        <div
          className="Full"
          style={{
            border: '1px solid var(--borderBlack)',
            borderRadius: '0.5rem',
          }}>
          <nav
            className="Full Flex Center"
            style={{
              height: '3.8rem',
              background: 'var(--bgGrey)',
              borderRadius: '0.5rem 0.5rem 0 0',
              padding: '0 2rem',
            }}>
            <ul className="Full Flex StartLeft" style={{ gap: '2.5rem' }}>
              {tabs.map((tab, index) => {
                return (
                  <li
                    key={index}
                    className={tab === selectedTab ? '' : 'SecondaryText'}
                    onClick={() => setSelectedTab(tab)}
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                    }}>
                    <p className="Mid">{tab}</p>
                    {tab === selectedTab ? (
                      <motion.div className="underline" style={styleUnderline} layoutId="underline" />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>
          <AnimatePresence mode="wait">
            <motion.div
              className="Full Flex"
              key={selectedTab ? selectedTab : 'empty'}
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                position: 'relative',
                minHeight: '30rem',
                padding: '2rem',
              }} />
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}

function Stats({ label, value = null, values = null, methods = null }) {
  return (
    <div
      className="Flex Column StartLeft"
      style={{
        gap: '0.5rem',
        padding: '1rem 1.5rem',
        border: '1px solid var(--borderBlack)',
        borderRadius: '0.5rem',
        height: 'fit-content',
      }}>
      <p className="Mid Bold">{label}</p>
      {value && <p className="Mid">{value}</p>}
      {values && (
        <div className="Flex Column StartLeft">
          {values.map((value, index) => (
            <p className="Mid" key={index}>{value.name}: {value.frequency}</p>
          )
          )}
        </div>
      )}
      {methods && (
        <div className="Flex Column StartLeft" style={{ gap: '0.25rem' }}>
          {methods.map((method, index) => (
            <div className="Flex Center" key={index} style={{ gap: '0.5rem' }}>
              <Image
                src={paymentMethods[method.name].src}
                alt="Payment method"
                placeholder="empty"
                width={185}
                height={127}
                as="image"
                style={{
                  width: '3.5rem',
                  height: 'fit-content',
                  objectFit: 'contain',
                }}
              />
              <p className="Mid">{method.frequency}</p>
            </div>
          )
          )}
        </div>
      )}
    </div>
  );
}