import axios from 'axios';
import { showAlert } from './alerts';

export const addNewDay = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/days/createNewDay',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Day added successfully');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', 'You can not create two days with the same date ');
  }
};

export const deleteCurrentDay = async (currentDayId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/days/deleteDay/${currentDayId}`,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Day deleted successfully');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', 'Something went wrong!');
  }
};

export const editCurrentDay = async (currentDayId, data, mealType) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `/api/v1/days/updateDay/${currentDayId}`,
      data: { data, mealType },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Day updated successfully');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1000);
    }
  } catch (err) {
    if (err.response.data.error.code === 11000) return showAlert('error', 'Please change date!');

    showAlert('error', 'Something went wrong!');
  }
};
