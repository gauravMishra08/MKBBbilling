import React, { createContext, useState, useEffect, useContext } from 'react';
import { Loader2 } from 'lucide-react';

const AuthContext = createContext(null);

const HARDCODED_USERS = [
  { id: 'n1', name: 'MKBB1' },
  { id: 'n2', name: 'MKBB2' },
  { id: 'n3', name: 'MKBB3' },
];
const HARDCODED_PASSWORD = '#yelagiri';
const SECURITY_QUESTIONS = [
  { id: 'q1', question: "In which year was your business established?", answer: "2002" },
  { id: 'q2', question: "What was the name of your first supplier?", answer: "Nirmal" },
  { id: 'q3', question: "What is the location of your first shop or office?", answer: "Hardi Dali" },
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSecurityQuestion, setCurrentSecurityQuestion] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    // Select a random security question on load
    const randomIndex = Math.floor(Math.random() * SECURITY_QUESTIONS.length);
    setCurrentSecurityQuestion(SECURITY_QUESTIONS[randomIndex]);
    setLoading(false);
  }, []);

  const signIn = (name, password, securityAnswer) => {
    // Find user with matching name
    const user = HARDCODED_USERS.find(u => u.name === name);
    if (
      user &&
      password === HARDCODED_PASSWORD &&
      currentSecurityQuestion &&
      securityAnswer.toLowerCase() === currentSecurityQuestion.answer.toLowerCase()
    ) {
      localStorage.setItem('authUser', JSON.stringify(user));
      setCurrentUser(user);

      // Rotate security question for next login
      const randomIndex = Math.floor(Math.random() * SECURITY_QUESTIONS.length);
      setCurrentSecurityQuestion(SECURITY_QUESTIONS[randomIndex]);
      return true;
    }
    // Rotate question even on failure
    const randomIndex = Math.floor(Math.random() * SECURITY_QUESTIONS.length);
    setCurrentSecurityQuestion(SECURITY_QUESTIONS[randomIndex]);
    return false;
  };

  const signOut = () => {
    localStorage.removeItem('authUser');
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, signIn, signOut, currentSecurityQuestion, isLoadingAuth: loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const getSecurityQuestions = () => SECURITY_QUESTIONS;
