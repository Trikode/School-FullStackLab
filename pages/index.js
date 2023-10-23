import { useState } from 'react';
import Layout from '../layout/Layout';
import { TransitionElement } from '../layout/TransitionElement';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useProfile } from '../context/user';

import InputLabel from '../components/elements/InputLabel';
import { ModalLayout, modalStyle } from '../style/styles';
// Chakra UI Modal
import {
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';

export default function Home() {
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
                // borderTop: '1px solid rgba(0, 0, 0, 0.01)',
                borderTop: '1px solid rgba(0, 0, 0, 0.03)',
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
            {feedbackNote && (
              <TransitionElement>
                <p
                  className="Small SecondaryText onHover Pointer"
                  onClick={() => setFeedbackNote('')}>
                  Clear text
                </p>
              </TransitionElement>
            )}
          </ModalLayout>
        </ModalContent>
      </Modal>
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};