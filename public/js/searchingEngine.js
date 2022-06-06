import axios from 'axios';
import { renderFile } from 'pug';

export const searching = async (element) => {
  try {
    if (!element) return;
    const res = await axios({
      method: 'GET',
      url: `/api/v1/products/findProduct/${element}`,
    });

    return res.data.data;
  } catch (err) {
    return;
  }
};

const container = document.querySelector('.input_search-container');
export const resultList = (results) => {
  removeListItem();
  fillFields(undefined);
  if (!results) return;
  results.forEach((el) => {
    const li = makeListItem(el);
    container.insertAdjacentElement('afterbegin', li);
  });
};

function makeListItem(el) {
  const li = document.createElement('div');
  li.classList.add('item-list');
  li.addEventListener('click', (e) => {
    display(el);
    removeListItem();
  });
  li.innerHTML = el.name;
  return li;
}

function display(product) {
  container.previousElementSibling.value = product.name;
  fillFields(product);
}

function removeListItem() {
  const items = document.querySelectorAll('.item-list');
  items.forEach((el) => el.remove());
}

function fillFields(product) {
  const fields = document.querySelectorAll('.add_product-input');
  if (!product) return fields.forEach((el) => (el.value = ''));

  fields.forEach((el) => {
    const fieldName = el.getAttribute('id');
    product.calories = product.energy;
    document.querySelector(`#${fieldName}`).value = product[fieldName] ?? '';
  });
}

export const searchByDate = async (date) => {
  location.assign(`/me?createdAt[lte]=${date.lte}&createdAt[gte]=${date.gte}`);
};
