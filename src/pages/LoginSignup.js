import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, firestore } from '../firebase-config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './Auth.css';

// Google icon SVG as a component (for better reliability)
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const LoginSignup = ({ isSignup }) => {
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  
  // Personal information states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Organizer specific states
  const [organizationName, setOrganizationName] = useState('');
  const [position, setPosition] = useState('');
  
  // UI states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [cardRotation, setCardRotation] = useState(0);
  
  const navigate = useNavigate();

  // 3D effect on card hover
  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     const card = document.querySelector('.auth-card');
  //     if (!card) return;
      
  //     const cardRect = card.getBoundingClientRect();
  //     const cardCenterX = cardRect.left + cardRect.width / 2;
  //     const cardCenterY = cardRect.top + cardRect.height / 2;
      
  //     const rotateY = (e.clientX - cardCenterX) / 20;
  //     const rotateX = (cardCenterY - e.clientY) / 20;
      
  //     card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  //   };
    
  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // }, []);

  // Form validation
  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    
    if (isSignup) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      
      if (!firstName || !lastName) {
        setError('Please provide your full name');
        return false;
      }
      
      if (role === 'student' && !collegeName) {
        setError('Please provide your college name');
        return false;
      }
      
      if (role === 'organizer' && !organizationName) {
        setError('Please provide your organization name');
        return false;
      }
    }
    
    return true;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      let userCredential;

      if (isSignup) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        const userId = userCredential.user.uid;

        
        // Prepare user data based on role
        const userData = {
          userId,
          email,
          role,
          firstName,
          lastName,
          phoneNumber,
          createdAt: new Date().toISOString(),
        };
        
        if (role === 'student') {
          userData.collegeName = collegeName;
          userData.department = department;
          userData.year = year;
        } else if (role === 'organizer') {
          userData.organizationName = organizationName;
          userData.position = position;
        }
        
        await setDoc(doc(firestore, 'users', userCredential.user.uid), userData);
        
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      // Fetch user role
      const userDocRef = doc(firestore, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'student') navigate('/student-dashboard');
        else if (userData.role === 'organizer') navigate('/organizer-dashboard');
        else navigate('/');
      } else {
        if (!isSignup) {
          setError('User data not found. Please contact support.');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      let errorMessage = 'Authentication failed. Please check your credentials.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check and try again.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up.';
      }
      
      setError(errorMessage);
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Google Authentication
  const handleGoogleAuth = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // Existing user - redirect based on role
        const userData = userDoc.data();
        if (userData.role === 'student') navigate('/student-dashboard');
        else if (userData.role === 'organizer') navigate('/organizer-dashboard');
        else navigate('/');
      } else {
        // New user - show role selection
        if (isSignup) {
          // If already on signup page with role selection visible
          // Create user with default role (can be changed later in profile)
          const googleUserData = {
            email: user.email,
            role: role || 'student',
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            phoneNumber: user.phoneNumber || '',
            createdAt: new Date().toISOString(),
            authProvider: 'google',
          };
          
          await setDoc(doc(firestore, 'users', user.uid), googleUserData);
          
          // Redirect based on role
          if (googleUserData.role === 'student') navigate('/student-dashboard');
          else if (googleUserData.role === 'organizer') navigate('/organizer-dashboard');
          else navigate('/');
        } else {
          // If on login page, redirect to a special registration completion page
          // where they can select role and complete profile
          navigate('/complete-profile', { 
            state: { 
              uid: user.uid, 
              email: user.email,
              displayName: user.displayName
            } 
          });
        }
      }
    } catch (error) {
      let errorMessage = 'Google sign-in failed. Please try again.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      }
      
      setError(errorMessage);
      console.error('Google authentication error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo could go here */}
        {/* <img src="/logo.png" alt="Logo" className="auth-logo" /> */}
        
        <h2>{isSignup ? 'Create Account' : 'Welcome Back to EVENTO'}</h2>
        {isSignup && <h3>EVENTO - Join us to discover amazing events</h3>}
        
        {error && <p className="auth-error">{error}</p>}
        
        {/* Google Sign In Button */}
        <button 
          className="google-auth-button" 
          onClick={handleGoogleAuth}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <span className="auth-loading" style={{ borderTopColor: '#4285F4' }}></span>
          ) : (
            <GoogleIcon />
          )}
          {googleLoading 
            ? 'Connecting...' 
            : `${isSignup ? 'Sign up' : 'Sign in'} with Google`
          }
        </button>
        
        <div className="auth-divider">OR</div>
        
        <form onSubmit={handleAuth}>
          {isSignup && (
            <>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                className="auth-select"
              >
                <option value="student">Student</option>
                <option value="organizer">Event Organizer</option>
              </select>
              
              <div className="form-row">
                <div className="form-col">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
                <div className="form-col">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
              </div>
              
              {role === 'student' && (
                <>
                  <input
                    type="text"
                    placeholder="College Name"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="auth-input"
                    required
                  />
                  
                  <div className="form-row">
                    <div className="form-col">
                      <input
                        type="text"
                        placeholder="Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="auth-input"
                      />
                    </div>
                    <div className="form-col">
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="auth-select"
                      >
                        <option value="">Select Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="5+">5+ Year</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              
              {role === 'organizer' && (
                <>
                  <input
                    type="text"
                    placeholder="Organization Name"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="auth-input"
                    required
                  />
                  
                  <input
                    type="text"
                    placeholder="Your Position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="auth-input"
                  />
                </>
              )}
              
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="auth-input"
              />
            </>
          )}
          
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />
          
          {isSignup && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input"
              required
            />
          )}
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <span className="auth-loading"></span>
                {isSignup ? 'Creating Account...' : 'Logging In...'}
              </>
            ) : (
              isSignup ? 'Sign Up' : 'Login'
            )}
          </button>
        </form>
        
        <div className="auth-switch">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <Link 
            to={isSignup ? '/login' : '/signup'} 
            className="auth-switch-btn"
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;