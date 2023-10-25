import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const ProviderContext = createContext();
export const useProfile = () => useContext(ProviderContext);

export const UserProvider = ({ children }) => {

  const supabase = useSupabaseClient();
  const user = useUser();

  const router = useRouter();

  // Profile
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [isAdmin, setIsAdmin] = useState(null);
  const [loadingIsAdmin, setLoadingIsAdmin] = useState(true);

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

  const [adminFeedbacks, setAdminFeedbacks] = useState([]);
  const [loadingAdminFeedbacks, setLoadingAdminFeedbacks] = useState(true);

  // Combined subjects, marks and feedbacks
  const [combined, setCombined] = useState([]);
  const [loadingCombined, setLoadingCombined] = useState(true);

  const [selectedAdminTab, setSelectedAdminTab] = useState('');

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
      setLoadingProfile(true);

      setIsAdmin(null);
      setLoadingIsAdmin(true);

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

      setAdminFeedbacks([]);
      setLoadingAdminFeedbacks(true);

      setCombined([]);
      setLoadingCombined(true);

      setSelectedAdminTab('');
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
    setLoadingIsAdmin(false);
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

  // Admin
  async function getAdminFeedbacks() {
    const { data, error } = await supabase
      .from('school-feedbacks')
      .select('id, idSubject, profile: profiles(firstname, lastname, studentNumber), feedbackPoints, feedbackNote');
    if (data) {
      setAdminFeedbacks(data);
    } else if (error) {
      console.log("🚀 ~ file: user.js:174 ~ getAdminFeedbacks ~ error:", error);
    }
    setLoadingAdminFeedbacks(false);
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
          id: feedback.id,
          points: feedback.feedbackPoints || null,
          note: feedback.feedbackNote || null,
        } : null,
      };
    });

    setCombined(combined);

  }, [subjects, marks, feedbacks, loadingSubjects, loadingMarks, loadingFeedbacks]);

  // Admin
  useEffect(() => {
    // Combine subjects and feedbacks
    // Structures are:
    // subjects = [{id, subjectName}, ...]
    // feedbacks = [{id, idSubject, profile: {firstname, lastname, studentNumber}, feedbackPoints, feedbackNote}, ...]

    if (loadingSubjects || loadingAdminFeedbacks) return;

    setSelectedAdminTab(subjects[0].subjectName);

    const combined = subjects.map((subject) => {
      // Put array of feedbacks in each subject
      const feedbacks = adminFeedbacks.filter((feedback) => feedback.idSubject === subject.id);
      return {
        ...subject,
        feedbacks: feedbacks && feedbacks.length > 0 ? feedbacks.map((feedback) => ({
          id: feedback.id,
          profile: {
            firstname: feedback.profile.firstname,
            lastname: feedback.profile.lastname,
            studentNumber: feedback.profile.studentNumber,
          },
          points: feedback.feedbackPoints || null,
          note: feedback.feedbackNote || null,
        })) : null,
      };
    });

    setCombined(combined);

  }, [subjects, adminFeedbacks, loadingSubjects, loadingAdminFeedbacks]);

  useEffect(() => {
    if (combined && combined.length > 0) {
      setLoadingCombined(false);
    }
  }, [combined]);

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
    if (profile && isAdmin === false) {
      if (profile.firstname && profile.lastname && profile.studentNumber) {
        setHasFinished(true);
      } else {
        setHasFinished(false);
      }
    } else if (profile && isAdmin) {
      if (profile.firstname && profile.lastname) {
        setHasFinished(true);
      } else {
        setHasFinished(false);
      }
    }

    if (profile && isAdmin === false) {
      getSubjects();
      getMarks();
      getFeedbacks();
    } else if (profile && isAdmin) {
      getSubjects();
      getAdminFeedbacks();
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
    loadingProfile,

    isAdmin,
    loadingIsAdmin,

    hasFinished,
    isSignedIn,
    getProfileFromSupabase,

    // Panel
    open,
    setOpen,
    selectedPanel,
    setSelectedPanel,
    openSignInPanel,

    // Subjects
    subjects,
    loadingSubjects,

    // Combined subjects and marks
    combined,
    loadingCombined,

    // Need to call getFeedbacks() after inserting or updating a feedback
    getFeedbacks,

    // Admin
    selectedAdminTab,
    setSelectedAdminTab,
  };

  return <ProviderContext.Provider value={exposed}>{children}</ProviderContext.Provider>;
};
