import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const registerUser = async (user) => {
  try {
    await axios.post('http://localhost:1000/api/v1/recipes/auth/oAuthLogin', {
      userName: user.name,
      email: user.email,
    });
    console.log('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
  }
};

const AuthWrapper = ({ children }) => {
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      registerUser(user);
    }
  }, [isAuthenticated, user]);

  return <>{children}</>;
};

export default AuthWrapper;