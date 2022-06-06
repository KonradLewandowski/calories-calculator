/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: { email, password },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      location.reload(true);
      location.assign('/login');
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again');
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: { name, email, password, passwordConfirm },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Sigged up! Welcome!');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Reset token send. Check your e-mail!');
      window.setTimeout(() => {
        location.assign('/signup');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const newPassword = async (token, data) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `/api/v1/users/resetPassword/${token}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'New password set!');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
