import { useState } from 'react';
import Layout from '../layout/Layout';

import { useProfile } from '../context/user';

import { AnimatePresence, motion } from 'framer-motion';

import { styleUnderline } from '../style/styles';

export default function Home() {

  const tabs = ['Marks', 'Feedbacks'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
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
            className="Full Flex StartLeft"
            key={selectedTab ? selectedTab : 'empty'}
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'relative',
              minHeight: '30rem',
              padding: '2rem',
            }}>
            {selectedTab === tabs[0] && <MarksTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function MarksTab() {

  const {
    combined,
    loadingCombined,
  } = useProfile();

  return (
    <div className='Full Flex StartLeft'>
      <div
        className='Full Flex Column StartLeft'
        style={{ gap: '1rem' }}>
        <p className='Mid Bold'>Subject</p>
        {loadingCombined ? (
          <></>
        ) : (
          combined.map((item, index) => (
            <div
              key={index}
              className='Full Flex StartLeft'
              style={{
                gap: '1rem',
              }}>
              <p className='Mid'>{item.subjectName}</p>
              <p className='Mid SecondaryText'>{item.mark || 'No mark'}</p>
            </div>
          )))}
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};