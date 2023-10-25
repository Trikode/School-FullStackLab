import { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import { LoadingWaiting } from '../layout/SignInLayout';
import { TransitionElement } from '../layout/TransitionElement';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useProfile } from '../context/user';

import { motion } from 'framer-motion';

import { ButtonGrey } from '../components/elements/Button';
import InputLabel from '../components/elements/InputLabel';
import { ModalLayout, modalStyle, styleUnderline } from '../style/styles';
// Chakra UI Modal
import {
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';

export default function Home() {

  const {
    isAdmin,
    loadingIsAdmin,
  } = useProfile();

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
          {loadingIsAdmin === false && isAdmin === false && <p className="Mid">Dashboard</p>}
          {loadingIsAdmin === false && isAdmin && <AdminTabs />}
        </nav>
        {loadingIsAdmin && <LoadingWaiting />}
        {loadingIsAdmin === false && isAdmin === false && <MarksTab />}
        {loadingIsAdmin === false && isAdmin && <AdminTab />}
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
        {loadingCombined === false && (
          combined.map((item, index) => (
            <div
              key={index}
              className='Full Flex StartLeft'
              style={{
                paddingTop: '2rem',
                borderTop: '1px solid var(--lighterBorderBlack)',
              }}>
              <p className='Mid' style={styleItem}>{item.subjectName}</p>
              <p className={item.mark ? 'Mid' : 'Mid SecondaryText'} style={styleItem}>{item.mark ? `${item.mark} / 20` : 'No mark'}</p>
              {item.mark && (
                <>
                  <FeedbackPoints
                    idFeedback={item.feedback ? item.feedback.id : null}
                    idSubject={item.id}
                    points={item.feedback ? item.feedback.points : null}
                  />
                  <FeedbackNote
                    idFeedback={item.feedback ? item.feedback.id : null}
                    idSubject={item.id}
                    note={item.feedback ? item.feedback.note : null}
                  />
                </>
              )}
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

function FeedbackPoints({ idFeedback, idSubject, points }) {

  const supabase = useSupabaseClient();
  const {
    profile,
    getFeedbacks,
  } = useProfile();

  const [disableButton, setDisableButton] = useState(false);

  async function insertFeedbackPoints(feedbackPoints) {
    const { error } = await supabase
      .from('school-feedbacks')
      .insert({
        idSubject: idSubject,
        feedbackPoints: feedbackPoints,
        profile: profile.id,
      });
    if (error) {
      console.log("🚀 ~ file: index.js:109 ~ insertFeedback ~ error:", error);
    } else {
      getFeedbacks();
    }
  }

  async function updateFeedbackPoints(feedbackPoints) {
    const { error } = await supabase
      .from('school-feedbacks')
      .update({
        feedbackPoints: feedbackPoints,
      })
      .eq('id', idFeedback);
    if (error) {
      console.log("🚀 ~ file: index.js:125 ~ updateFeedback ~ error:", error);
    } else {
      getFeedbacks();
    }
  }

  const handleClick = async (feedbackPoints) => {
    setDisableButton(true);
    if (idFeedback) {
      await updateFeedbackPoints(feedbackPoints);
    } else {
      await insertFeedbackPoints(feedbackPoints);
    }
    setDisableButton(false);
  };

  return (
    <div
      className='Full Flex LeftCenter'
      style={{
        ...styleItem,
        gap: '0.5rem',
        height: '1.5rem',
      }}>
      {[...Array(5)].map((_, index) => (
        <button
          className='Pointer'
          key={index}
          disabled={disableButton}
          onClick={() => handleClick(index + 1)}
          style={{
            width: '1rem',
            height: '1rem',
            borderRadius: '50%',
            backgroundColor: points > index ? 'var(--bgGreyDarker)' : 'var(--borderBlack)',
            marginRight: '0.5rem',
          }}
        />
      ))}
    </div>
  );
}

function FeedbackNote({ idFeedback, idSubject, note }) {

  const supabase = useSupabaseClient();
  const {
    profile,
    getFeedbacks,
  } = useProfile();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [feedbackNote, setFeedbackNote] = useState(note || '');

  const handleOnClose = () => {
    onClose();
    setFeedbackNote(note || '');
  };

  async function insertFeedbackNote() {
    const { error } = await supabase
      .from('school-feedbacks')
      .insert({
        idSubject: idSubject,
        feedbackNote: feedbackNote,
        profile: profile.id,
      });
    if (error) {
      console.log("🚀 ~ file: index.js:217 ~ insertFeedbackNote ~ error:", error);
    } else {
      getFeedbacks();
    }
  }

  async function updateFeedbackNote() {
    const { error } = await supabase
      .from('school-feedbacks')
      .update({
        feedbackNote: feedbackNote,
      })
      .eq('id', idFeedback);
    if (error) {
      console.log("🚀 ~ file: index.js:231 ~ updateFeedbackNote ~ error:", error);
    } else {
      getFeedbacks();
    }
  }

  const handleClick = async () => {
    if (idFeedback) {
      await updateFeedbackNote();
    } else {
      await insertFeedbackNote();
    }
    onClose();
  };

  return (
    <>
      <div
        className='Flex StartLeft'
        style={{
          gap: '5rem',
        }}>
        {note ?
          <>
            <p
              className='Mid'
              style={{ width: '28rem' }}>
              {note}
            </p>
            <p
              className='Mid SecondaryText onHover Pointer'
              onClick={onOpen}>
              Edit
            </p>
          </>
          :
          <p
            className="Mid SecondaryText onHover Pointer"
            onClick={onOpen}>
            Add comment
          </p>
        }
      </div>
      <Modal isOpen={isOpen} onClose={handleOnClose}>
        <ModalOverlay />
        <ModalContent style={modalStyle}>
          <ModalLayout
            title={note ? 'Edit comment' : 'Add comment'}
            onClose={handleOnClose}
            gap='1.5rem'
            paddingHeader='0rem'
          >
            <InputLabel
              widthValue='100%'
              value={feedbackNote}
              isDescription={true}
              placeholder='Insert your feedback here...'
              onChange={(e) => {
                setFeedbackNote(e.target.value);
              }}
            />
            <div className={feedbackNote ? 'Full Flex SpaceBetCen' : 'Full Flex EndRight'}>
              {feedbackNote && (
                <TransitionElement>
                  <p
                    className="Mid SecondaryText onHover Pointer"
                    onClick={() => setFeedbackNote('')}>
                    Clear text
                  </p>
                </TransitionElement>
              )}
              <ButtonGrey
                text='Save'
                onClick={handleClick}
              />
            </div>
          </ModalLayout>
        </ModalContent>
      </Modal>
    </>
  );
}

function AdminTab() {

  const {
    combined,
    loadingCombined,
    selectedAdminTab,
  } = useProfile();

  const [combinedFiltered, setcombinedFiltered] = useState([]);
  const [feedbacksResults, setFeedbacksResults] = useState({
    totalFeedbacks: 0,
    averageFeedbackPoints: 0,
  });

  // Filter combined by selectedAdminTab
  useEffect(() => {
    if (loadingCombined) return;
    const filtered = combined.filter((item) => item.subjectName === selectedAdminTab);
    setcombinedFiltered(filtered);

  }, [combined, loadingCombined, selectedAdminTab]);

  useEffect(() => {

    if (combinedFiltered.length === 0) return;

    const filtered = combinedFiltered.filter((item) => item.feedbacks && item.feedbacks.length > 0);

    // Calculate feedbacksResults
    const totalFeedbacks = filtered.reduce((acc, item) => {
      return acc + item.feedbacks.length;
    }, 0);

    const totalFeedbackPoints = filtered.reduce((acc, item) => {
      return acc + item.feedbacks.reduce((acc, item) => {
        return acc + item.points;
      }, 0);
    }, 0);

    const averageFeedbackPoints = totalFeedbackPoints / totalFeedbacks;

    setFeedbacksResults({
      totalFeedbacks: totalFeedbacks,
      averageFeedbackPoints: averageFeedbackPoints || 0,
    });

  }, [combinedFiltered]);

  return (
    <div
      className='Full Flex Column StartLeft'
      style={{
        minHeight: '30rem',
        padding: '2rem',
        gap: '2rem',
      }}>
      <div
        className='Flex StartLeft'
        style={{
          marginLeft: '-0.35rem',
          marginBottom: '0.25rem',
          gap: '2rem'
        }}>
        <AdminStats
          label='Total feedbacks'
          value={feedbacksResults.totalFeedbacks}
        />
        <AdminStats
          label='Average feedback points'
          value={feedbacksResults.averageFeedbackPoints.toFixed(2)}
        />
      </div>
      <div
        className='Full Flex Column StartLeft'
        style={{ gap: '2rem' }}>
        <div className='Full Flex StartLeft'>
          <StyledLabel>Student</StyledLabel>
          <StyledLabel>Feedback</StyledLabel>
          <StyledLabel>Comment</StyledLabel>
        </div>
        {loadingCombined === false &&
          combinedFiltered && combinedFiltered.length > 0 && (
            combinedFiltered.map((item, index) => (
              <div
                key={index}
                className='Full Flex StartLeft'
                style={{
                  paddingTop: '2rem',
                  borderTop: '1px solid var(--lighterBorderBlack)',
                }}>
                <div
                  className='Flex Column StartLeft'
                  style={{ gap: '2rem' }}>
                  {item.feedbacks && item.feedbacks.map((feedback, index) => (
                    <div
                      className='Flex StartLeft'
                      key={index}
                      style={index === 0 ? { paddingTop: '0' } : {
                        paddingTop: '2rem',
                        borderTop: '1px solid var(--lighterBorderBlack)',
                      }}>
                      <ProfileData profile={feedback.profile} />
                      <div
                        className='Full Flex LeftCenter'
                        style={{
                          ...styleItem,
                          gap: '0.5rem',
                          height: '1.5rem',
                        }}>
                        {[...Array(5)].map((_, index) => (
                          <button
                            key={index}
                            style={{
                              width: '1rem',
                              height: '1rem',
                              borderRadius: '50%',
                              backgroundColor: feedback.points > index ? 'var(--bgGreyDarker)' : 'var(--borderBlack)',
                              marginRight: '0.5rem',
                            }}
                          />
                        ))}
                      </div>
                      <p className={feedback.note ? 'Mid' : 'Mid SecondaryText'} style={{ width: '28rem' }}>{feedback.note ? feedback.note : 'No comment'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )))}
      </div>
    </div>
  );
}

function AdminStats({ label, value }) {
  return (
    <div
      className="Flex Column Center"
      style={{
        gap: '0.5rem',
        padding: '1rem 1.5rem',
        border: '1px solid var(--lighterBorderBlack)',
        borderRadius: '0.5rem',
        height: 'fit-content',
      }}>
      <p className="Mid">{label}</p>
      {value && <p className="Mid Bold">{value}</p>}
    </div>
  );
}

function AdminTabs() {

  const {
    subjects,
    loadingSubjects,
    selectedAdminTab,
    setSelectedAdminTab,
  } = useProfile();

  return (
    <ul
      className="Full Flex StartLeft"
      style={{
        gap: '4rem'
      }}>
      {/* <p className='Mid Bold'>Subject</p> */}
      {loadingSubjects === false && subjects.map((tab, index) => {
        return (
          <li
            key={index}
            className={tab.subjectName === selectedAdminTab ? '' : 'SecondaryText'}
            onClick={() => setSelectedAdminTab(tab.subjectName)}
            style={{
              position: 'relative',
              cursor: 'pointer',
            }}>
            <p className="Mid">{tab.subjectName}</p>
            {tab.subjectName === selectedAdminTab ? (
              <motion.div className="underline" style={styleUnderline} layoutId="underline" />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

const ProfileData = ({ profile }) => (
  <p className="Mid" style={styleItem}>{profile.firstname}&nbsp;{profile.lastname}</p>
);

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};