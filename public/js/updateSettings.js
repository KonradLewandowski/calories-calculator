import axios from 'axios';
import { showAlert } from './alerts';

export const updateUserData = async (data, url = 'updateMyPassword') => {
  if (data?.email) {
    if (data.email !== data.confirmEmail) return showAlert('error', 'Emails are not the same');

    url = 'updateMe';
  }
  try {
    const res = await axios({
      method: 'PUT',
      url: `/api/v1/users/${url}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully');
      window.setTimeout(() => {
        location.assign('/settings');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteUserAccount = async (data) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `/api/v1/users/deleteMe`,
      data,
    });

    if (res.status === 204) {
      showAlert('success', 'Account deleted successfully');
      window.setTimeout(() => {
        location.assign('/signup');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Could not delete your account! Try again later!');
  }
};
