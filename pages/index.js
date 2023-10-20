import { useState } from 'react';
import Layout from '../layout/Layout';

import { useProfile } from '../context/user';

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
          className="Full Flex LeftCenter"
          style={{
            height: '3.8rem',
            background: 'var(--bgGrey)',
            borderRadius: '0.5rem 0.5rem 0 0',
            padding: '0 2rem',
          }}>
          <p className="Mid">Dashboard</p>
        </nav>
        <MarksTab />
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
    <div
      className='Full Flex StartLeft'
      style={{
        minHeight: '30rem',
        padding: '2rem',
      }}>
      <div
        className='Full Flex Column StartLeft'
        style={{ gap: '2rem' }}>
        <div className='Full Flex StartLeft'>
          <StyledLabel>Subject</StyledLabel>
          <StyledLabel>Mark</StyledLabel>
          <StyledLabel>Feedback</StyledLabel>
          <StyledLabel>Comment</StyledLabel>
        </div>
        {loadingCombined ? (
          <></>
        ) : (
          combined.map((item, index) => (
            <div
              key={index}
              className='Full Flex StartLeft'
              style={{
                paddingTop: '2rem',
                borderTop: '1px solid rgba(0, 0, 0, 0.01)',
              }}>
              <p className='Mid' style={styleItem}>{item.subjectName}</p>
              <p className={item.mark ? 'Mid' : 'Mid SecondaryText'} style={styleItem}>{item.mark ? `${item.mark} / 20` : 'No mark'}</p>
              <FeedbackPoints points={item.feedback ? item.feedback.points : null} />
            </div>
          )))}
      </div>
    </div>
  );
}

const StyledLabel = ({ children }) => (
  <p className='Mid Bold' style={styleItem}>{children}</p>
);

const styleItem = {
  width: '16rem',
  textAlign: 'left',
};

function FeedbackPoints({ points }) {
  return (
    <div
      className='Full Flex LeftCenter'
      style={{
        ...styleItem,
        gap: '0.5rem',
      }}>
      {[...Array(5)].map((_, index) => (
        <div
          className='Pointer'
          key={index}
          style={{
            width: '1rem',
            height: '1rem',
            borderRadius: '50%',
            backgroundColor: points > index ? 'var(--borderBlack)' : 'var(--bgGrey)',
            marginRight: '0.5rem',
          }}
        />
      ))}
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};