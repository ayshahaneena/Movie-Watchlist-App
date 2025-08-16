import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || ''
});

const AuthContext = createContext();

const initialState = {
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: false,
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token header
  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        setAuthToken(state.token);
        try {
          const res = await api.get('/api/auth/user');
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { token: state.token, user: res.data.user }
          });
        } catch (error) {
          dispatch({ type: 'AUTH_FAIL' });
        }
      } else {
        dispatch({ type: 'AUTH_FAIL' });
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      const res = await api.post('/api/auth/register', formData);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: res.data
      });
      setAuthToken(res.data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await api.post('/api/auth/login', formData);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: res.data
      });
      setAuthToken(res.data.token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    setAuthToken(null);
  };

  // Set loading
  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const value = {
    token: state.token,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    register,
    login,
    logout,
    setLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

