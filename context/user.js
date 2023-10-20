import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

import { get } from 'http';

const ProviderContext = createContext();
export const useProfile = () => useContext(ProviderContext);

export const UserProvider = ({ children }) => {

  const supabase = useSupabaseClient();
  const user = useUser();

  const router = useRouter();

  // Profile
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hasFinished, setHasFinished] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(null);

  // Panel
  const [open, setOpen] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState(1);

  // Subjects
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  // Marks
  const [marks, setMarks] = useState([]);
  const [loadingMarks, setLoadingMarks] = useState(true);

  // Feedbacks
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  // Combined subjects, marks and feedbacks
  const [combined, setCombined] = useState([]);
  const [loadingCombined, setLoadingCombined] = useState(true);

  useEffect(() => {
    if (user) {
      getProfileFromSupabase();
      getIsAdmin();
    }

    const getUItoSignIn = setTimeout(() => {
      // After 1s if user is null, stop loading
      // This is to prevent the loading screen to be stuck
      // And give the user an UI to proceed with the sign-in
      if (!user) setLoadingProfile(false);
    }, 1000);

    return () => {
      clearTimeout(getUItoSignIn);

      // Profile
      setProfile(null);
      setIsAdmin(null);
      setLoadingProfile(true);
      setHasFinished(null);
      setIsSignedIn(null);
      // Panel
      setOpen(false);
      setSelectedPanel(1);

      // Subjects
      setSubjects([]);
      setLoadingSubjects(true);
      // Marks
      setMarks([]);
      setLoadingMarks(true);
      // Feedbacks
      setFeedbacks([]);
      setLoadingFeedbacks(true);

      // Combined subjects and marks
      setCombined([]);

    };
  }, [user]);

  async function getProfileFromSupabase() {
    console.log('user.js Query, getProfile from Supabase');

    const { data, error } = await supabase
      .from('profiles')
      .select('id, firstname, lastname, studentNumber')
      .eq('id', user.id);
    if (data && data.length > 0) {
      setProfile(data[0]);
    } else if (error) {
      console.log("🚀 ~ file: user.js:52 ~ getProfileFromSupabase ~ error:", error);
    } else {
      setProfile(null);
    }
    setLoadingProfile(false);
  }

  async function getIsAdmin() {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('id', user.id);
    if (data && data.length > 0) {
      setIsAdmin(true);
    } else if (error) {
      console.log("🚀 ~ file: user.js:97 ~ getIsAdmin ~ error:", error);
    } else {
      setIsAdmin(false);
    }
  }

  async function getSubjects() {
    const { data, error } = await supabase
      .from('school-subjects')
      .select('id, subjectName');
    if (data) {
      setSubjects(data);
    } else if (error) {
      console.log("🚀 ~ file: user.js:110 ~ getSubjects ~ error:", error);
    }
    setLoadingSubjects(false);
  }

  async function getMarks() {
    const { data, error } = await supabase
      .from('school-marks')
      .select('id, idSubject, mark')
      .eq('studentNumber', profile.studentNumber);
    if (data) {
      setMarks(data);
    } else if (error) {
      console.log("🚀 ~ file: user.js:123 ~ getMarks ~ error:", error);
    }
    setLoadingMarks(false);
  }

  async function getFeedbacks() {
    const { data, error } = await supabase
      .from('school-feedbacks')
      .select('id, idSubject, feedbackPoints, feedbackNote')
      .eq('profile', profile.id);
    if (data) {
      setFeedbacks(data);
    } else if (error) {
      console.log("🚀 ~ file: user.js:148 ~ getFeedbacks ~ error:", error);
    }
    setLoadingFeedbacks(false);
  }

  useEffect(() => {
    // Combine subjects, marks and feedbacks
    // Structures are:
    // subjects = [{id, subjectName}, ...]
    // marks = [{id, idSubject, mark}, ...]
    // feedbacks = [{id, idSubject, feedbackPoints, feedbackNote}, ...]

    if (loadingSubjects || loadingMarks || loadingFeedbacks) return;

    const combined = subjects.map((subject) => {
      const mark = marks.find((mark) => mark.idSubject === subject.id);
      const feedback = feedbacks.find((feedback) => feedback.idSubject === subject.id);
      return {
        ...subject,
        mark: mark ? mark.mark : null,
        feedback: feedback ? {
          points: feedback.feedbackPoints || null,
          note: feedback.feedbackNote || null,
        } : null,
      };
    });

    setCombined(combined);

  }, [subjects, marks, feedbacks, loadingSubjects, loadingMarks, loadingFeedbacks]);

  useEffect(() => {
    if (combined && combined.length > 0) {
      console.log(combined);
      setLoadingCombined(false);
    }
  }, [combined]);


  // Admin
  async function getAllFeedbacks() {

  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  useEffect(() => {
    if (profile) {
      if (profile.firstname && profile.lastname && profile.studentNumber) {
        setHasFinished(true);
      } else {
        setHasFinished(false);
      }
    }

    if (profile && !isAdmin) {
      getSubjects();
      getMarks();
      getFeedbacks();
    } else if (profile && isAdmin) {
      getAllFeedbacks();
    }
  }, [profile, isAdmin]);

  useEffect(() => {
    if (!loadingProfile) {
      if (profile) {
        if (hasFinished === true) {
          setIsSignedIn(true);
        } else if (hasFinished === false) {
          setIsSignedIn(false);
        }
      } else if (!profile) {
        setIsSignedIn(false);
      }
    }
  }, [profile, loadingProfile, hasFinished]);

  function openSignInPanel() {
    setSelectedPanel(1);
    setOpen(true);
  }

  const exposed = {
    // Auth
    signInWithGoogle,
    signOut,

    // Profile
    profile,
    isAdmin,
    loadingProfile,
    hasFinished,
    isSignedIn,
    getProfileFromSupabase,

    // Panel
    open,
    setOpen,
    selectedPanel,
    setSelectedPanel,
    openSignInPanel,

    // Combined subjects and marks
    combined,
    loadingCombined,


  };

  return <ProviderContext.Provider value={exposed}>{children}</ProviderContext.Provider>;
};
