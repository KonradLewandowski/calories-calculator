import axios from 'axios';
import { showAlert } from './alerts';

export const addNewProduct = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/products/',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'The product has been created');
      return res.data.data;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const addNewMeal = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/meals/createMeal',
      data: { product: data.data._id, weight: data.weight, energy: data.energy },
    });

    if (res.data.status === 'success') {
      return res.data.data;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteMeal = async (id) => {
  if (!id) return;

  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/meals/deleteMeal/${id}`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'The product has been deleted');
      window.setTimeout(() => {
        location.assign('/me');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateMeal = async (id, data) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `/api/v1/meals/updateMeal/${id}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'The meal has been updated');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const getMeal = async (id) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/meals/getMeal/${id}`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Edit your meal');
      return res.data.data;
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const renderMeal = (data, mealType, id) => {
  if (!mealType || !data || !id) return;
  const html = `<div class="edit-field creating" value=${mealType}><div class="name_of_product"><div class="header_name"><span>${
    data.name[0].toUpperCase() + data.name.slice(1)
  }</span><span class="delete client-side_delete" value=${id}>❌</span></div><p>🔥${
    data.energy * (data.weight / 100)
  }kcal</p><span>⚖️${data.weight}g</span><span>🍖${
    data.whey * (data.weight / 100)
  }g</span><span>⚫${data.carbohydrates * (data.weight / 100)}g</span><span>🥓${
    data.fat * (data.weight / 100)
  }g</span><p class="line" ></p></div></div>`;
  document.querySelector(`.${mealType}`).insertAdjacentHTML('afterend', html);
};

export const deleteFunction = () => {
  const deleteCurrentProduct = document.querySelectorAll('.client-side_delete');
  deleteCurrentProduct.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const id = e.target.getAttribute('value');

      if (!deleteMeal(id)) return;
      e.target.closest('.edit-field').remove();
    });
  });
};

export const clearInputs = () => {
  document.querySelectorAll('.add_product-input').forEach((el) => (el.value = ''));
  document.querySelectorAll('.tot').forEach((el) => (el.textContent = ''));
};

export const totalsOutput = (totals, weight, product) => {
  totals.forEach(async (el, i) => {
    if (!weight.value) weight.value = '';
    const field = el.getAttribute('id').split('-')[1];
    const input = document.querySelector(`#${field}`);

    if (!product) return (el.textContent = parseInt((input.value * weight.value) / 100));

    product.calories = product.energy;
    input.value = product[field];

    el.textContent = parseInt((input.value * weight.value) / 100);
  });
};
