import '@babel/polyfill';
import { login, logout, signup, resetPassword, newPassword } from './login.js';
import { updateUserData, deleteUserAccount } from './updateSettings.js';
import { addNewDay, deleteCurrentDay, editCurrentDay } from './daySettings.js';
import {
  addNewProduct,
  addNewMeal,
  renderMeal,
  deleteMeal,
  deleteFunction,
  clearInputs,
  updateMeal,
  getMeal,
  totalsOutput,
} from './productSettings';
import { searching, resultList, searchByDate } from './searchingEngine';

//Meal type ['breakfast', 'lunch', 'dinner'] value holder
let mealType = '';
//add or create
let flag = false;
let dayID = '';
//Data for day which is creating
//arrays for products
let breakfast = [];
let lunch = [];
let dinner = [];

//DOM ELEMENTS

const header = document.querySelector('.header');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const signupBtn = document.querySelector('.form-signup');
const userDataUpdateForm = document.querySelector('.form-user-data');
const userPasswordUpdateForm = document.querySelector('.form-user-password');
const deleteUser = document.getElementById('button-delete_user');
const showDates = document.querySelector('.show-dates');

//send reset password token
const forgotPasswordBtn = document.querySelector('.btn-send');
//new password after send token
const resetPasswordBtn = document.querySelector('.btn-reset');

//Days elements
const addDay = document.querySelector('.add-day');
const deleteDay = document.querySelectorAll('.delete-day');
const editDate = document.querySelectorAll('.edit-date');
const editField = document.querySelectorAll('.name_of_product');
const resetForm = document.querySelector('.reset-day');

//Meal elements

//Product  elements
const addFormContainer = document.querySelector('.add_form-contariner');
const addProduct = document.querySelectorAll('.btn_create');
const closeForm = document.querySelector('#close');
const confirmProduct = document.querySelector('.add_product-confirm');
const totals = document.querySelectorAll('.tot');

const edit = document.querySelector('.edit_exists');
//searching product DOM input
const search = document.querySelector('.search-product');

//delete product(update day) on the server side
const deleteSrv = document.querySelectorAll('.srv-side_delete');

//sticky header
(() => {
  const sticky = header.offsetTop;

  function navbarSticky() {
    if (window.pageYOffset >= sticky) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  }
  window.onscroll = function () {
    navbarSticky();
  };
})();

//
//VALUES
if (signupBtn) {
  signupBtn.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name-signup').value;
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    const passwordConfirm = document.getElementById('password__confirm-signup').value;

    signup(name, email, password, passwordConfirm);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataUpdateForm)
  userDataUpdateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const confirmEmail = document.getElementById('confirm-email').value;
    const name = document.getElementById('name-user').value;

    updateUserData({ name, email, confirmEmail });
  });

if (userPasswordUpdateForm)
  userPasswordUpdateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    updateUserData({ currentPassword, password, passwordConfirm });
  });

if (forgotPasswordBtn)
  forgotPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email-forgot').value;
    resetPassword({ email });
  });

if (resetPasswordBtn)
  resetPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const password = document.getElementById('password-reset').value;
    const passwordConfirm = document.getElementById('password__confirm-reset').value;
    const token = e.target.getAttribute('value');

    newPassword(token, { password, passwordConfirm });
  });

if (deleteUser)
  deleteUser.addEventListener('click', (e) => {
    e.preventDefault();
    const password = document.getElementById('password-delete_user').value;

    deleteUserAccount({ password });
  });
//sort by date
if (showDates)
  showDates.addEventListener('click', async (e) => {
    const gte = document.getElementById('date-form-gte').value;
    const lte = document.getElementById('date-form-lte').value;
    if (lte < gte) return;
    const results = await searchByDate({ gte, lte });
  });

//main page
if (addProduct)
  addProduct.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      edit.classList.remove('edit_exists_in');
      //decide if day exists
      flag = e.target.getAttribute('class').includes('btn_add');
      if (flag) dayID = e.target.closest('.day').children[0].getAttribute('value');

      addFormContainer.classList.add('add_form-contariner-in');
      mealType = e.target.getAttribute('value');
    });
  });

if (closeForm)
  closeForm.addEventListener('click', (e) => {
    addFormContainer.classList.remove('add_form-contariner-in');
  });

//product configuration
if (confirmProduct)
  confirmProduct.addEventListener('click', async (e) => {
    const name = document.querySelector('#name').value;
    const weight = document.querySelector('#weight').value;
    const energy = parseInt(document.querySelector('#calories').value);
    const whey = document.querySelector('#whey').value;
    const carbohydrates = document.querySelector('#carbohydrates').value;
    const fat = document.querySelector('#fat').value;

    const obj = { name, weight, energy, whey, carbohydrates, fat };

    const data = await addNewProduct(obj);

    //Checking if object data is coming from the search input
    if (!data) return;

    const meal = await addNewMeal({ data, weight: weight, mealType: mealType });

    if (mealType === 'breakfast') breakfast.push(meal._id);
    if (mealType === 'lunch') lunch.push(meal._id);
    if (mealType === 'dinner') dinner.push(meal._id);

    if (!meal) return;
    //add new meals to the editing day
    if (flag) return editCurrentDay(dayID, { breakfast, lunch, dinner }, mealType);

    //day preparing before save
    renderMeal(obj, mealType, meal._id);
    addFormContainer.classList.remove('add_form-contariner-in');
    clearInputs();
    deleteFunction();
  });

if (resetForm)
  resetForm.addEventListener('click', (e) => {
    location.reload();
  });

if (deleteSrv)
  deleteSrv.forEach((el) =>
    el.addEventListener('click', (e) => {
      const id = e.target.getAttribute('value');

      deleteMeal(id);
    })
  );

if (addFormContainer)
  // addFormDetails
  addFormContainer.addEventListener('change', (e) => {
    const weight = document.querySelector('#weight');

    totalsOutput(totals, weight);
  });

if (search)
  search.addEventListener('input', async (e) => {
    const results = await searching(e.target.value);
    resultList(results);
  });

//day configuration
if (addDay)
  addDay.addEventListener('click', (e) => {
    e.preventDefault();
    addNewDay({ breakfast, lunch, dinner });
  });

if (deleteDay)
  deleteDay.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      deleteCurrentDay(e.target.getAttribute('value'));
    });
  });

//edit day
if (editDate)
  editDate.forEach((el) => {
    el.children[0].addEventListener('click', async (e) => {
      e.preventDefault();
      const id = e.target.closest('.day').children[0].getAttribute('value');
      const newDate = document.querySelector('.new-date');
      newDate.style.display = 'block';
      newDate.addEventListener('keydown', (e) => {
        const createdAt = e.target.value;
        if (e.key === 'Enter') {
          confirm('Are you sure?') ? editCurrentDay(id, { createdAt }) : '';
        }
      });

      if (newDate.style.display === 'none') return;
      document.addEventListener('click', (e) => {
        e.preventDefault();

        if (!e.target.closest('.modal')) {
          newDate.style.display = 'none';
        }
      });
    });
  });

//edit existsing meal
if (editField)
  editField.forEach((el) => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();

      let weight = document.querySelector('#weight_change');
      const exit = document.querySelector('#close_change');
      const confirm = document.querySelector('#confirm_change');
      const id = e.target.closest('.edit-field').children[0].getAttribute('value');
      const mealToChange = await getMeal(id);

      if (!mealToChange) return;

      weight.addEventListener('input', (e) => {
        totalsOutput(totals, weight, mealToChange.product);
      });

      edit.classList.add('edit_exists_in');
      exit.addEventListener('click', (e) => {
        edit.classList.remove('edit_exists_in');
        clearInputs();
        weight.value = '';
      });
      confirm.addEventListener('click', (e) => {
        edit.classList.remove('edit_exists_in');
        updateMeal(id, { weight: parseInt(weight.value) });
      });
    });
  });
