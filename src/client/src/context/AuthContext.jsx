import {
  createRef, useCallback, useContext, useEffect, useImperativeHandle, useState,
  useMemo, createContext,
} from 'react';
import { useLoading } from '../hook/useLoading';

// Create the AuthContext
const AuthContext = createContext({});

// Create a ref to store the context value
const contextRef = createRef();

// AuthProvider Component
export function AuthProvider({ authService, authErrorEventBus, children }) {
  // State to store the current user
  const [user, setUser] = useState(false);

  //useLoading({initialValue, iso, styles})
  const { isLoading: isAuthLoading, stopLoading: stopAuthLoading, loadingComponent: authLoadingComponent } = useLoading({ initialValue: true });

  // Expose the user token using useImperativeHandle
  useImperativeHandle(contextRef, () => (user ? user.token : undefined));

  useEffect(() => {
    authErrorEventBus.listen((err) => {
      console.log(err);
      // setUser(undefined);
    });
  }, [authErrorEventBus]);


  // Fetch user information when the component mounts
  useEffect(() => {
    authService.me()
      .then(setUser)
      .catch(console.error)
      .finally(() => {
        stopAuthLoading()
      });
  }, [authService]);

  // Logout function
  const logout = useCallback(async () => {
    authService.logout().then(() => setUser(undefined));
  }, [authService]);



  // Signin function
  const signin = useCallback(async (username, password, email) => {
    try {
      const user = await authService.login(username, password, email);
      setUser(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [authService]);

  // Signup function
  const signup = useCallback(async (username, firstName, lastName, password, email, userRoleId, code) => {
    try {
      const user = await authService.signup(username, firstName, lastName, password, email, userRoleId, code);
      setUser(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [authService]);

  const updateProfileInfo = useCallback(async (accountInfo) => {
    try {
      const data = await authService.updateAccount(accountInfo);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, [authService])

  const sendVerification = useCallback(async (email) => {
    try {
      const data = await authService.sendVerification(email);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, [authService]);


  const deleteAccount = useCallback(async () => {
    authService.deleteAccount().then(() => setUser(undefined));
  }, [authService]);

  const updatePassword = useCallback(async (password, emailVerificationCode, email) => {
    try {
      const data = await authService.updatePassword(password, emailVerificationCode, email);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, [authService]);




  // Create the context object
  const context = useMemo(() => ({
    user,
    signin,
    signup,
    logout,
    updateProfileInfo,
    sendVerification,
    deleteAccount,
    updatePassword
  }), [user, logout, signup, signin, updateProfileInfo, sendVerification, deleteAccount, updatePassword]);

  // Provide the context to the children
  return (
    <AuthContext.Provider value={context}>
      {isAuthLoading ? authLoadingComponent : children}
    </AuthContext.Provider>
  );
}

// AuthErrorEventBus class
export class AuthErrorEventBus {
  // Listen method
  listen(callback) {
    this.callback = callback;
  }

  // Notify method
  notify(error) {
    this.callback(error);
  }
}

// Fetch the user token
export const fetchToken = () => contextRef.current;

// Custom hook to access the authentication context
export const useAuth = () => useContext(AuthContext);
