
import axios from 'axios';

// Визначення функцій для роботи з Local Storage безпосередньо у файлі
function loadFromLS(key) {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Load state error: ', err);
    return undefined;
  }
}

function saveToLS(key, state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error('Save state error: ', err);
  }
}

// Замість refs використовуйте безпосередні звернення до елементів
const contactForm = document.querySelector('.footer-form');
const emailInput = document.getElementById('user-email');
const commentsInput = document.getElementById('user-comment');
const backdrop = document.querySelector('.backdrop');
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.close-btn');
const modalTitleEl = document.querySelector('.modal-title');
const modalMessageEl = document.querySelector('.modal-message');

contactForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const email = emailInput.value;
  const comments = commentsInput.value;
  if (!email || !comments) {
    showModal('Error!', 'Please fill in both fields');
    return;
  }
  const dataLoad = {
    email: email,
    comment: comments,
  };

  saveToLS('email', email);
  saveToLS('comment', comments);

  try {
    const response = await axios.post(
      'https://portfolio-js.b.goit.study/api/requests',
      dataLoad,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = response.data;
    if (data.error) {
      showModal('Error!', `${data.error}`);
    } else {
      localStorage.removeItem(storageKey);
      contactForm.reset();
      showModal(
        'Thank you for your interest in cooperation!',
        'The manager will contact you shortly to discuss further details and opportunities for cooperation. Please stay in touch.'
      );
    }
  } catch (error) {
    showModal(
      'Error!',
      `Request failed with status code ${error.response.status}`
    );
  }
});

function showModal(title, message) {
  modalTitleEl.textContent = title;
  modalMessageEl.textContent = message;
  openModalWindow();
}

function openModalWindow() {
  backdrop.classList.add('is-open');
  if (!document.body.classList.contains('scroll-off')) {
    document.body.classList.add('scroll-off');
  }
}

function closeModalWindow() {
  backdrop.classList.remove('is-open');
  if (document.body.classList.contains('scroll-off')) {
    document.body.classList.remove('scroll-off');
  }
}

closeModalBtn.addEventListener('click', closeModalWindow);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && backdrop.classList.contains('is-open')) {
    closeModalWindow();
  }
});

document.addEventListener('click', event => {
  const click = event.composedPath().includes(modal);
  if (!click) {
    closeModalWindow();
  }
});

const storageKey = 'feedback-form-state';
const savedFormData = loadFromLS(storageKey);
const formData = {
  email: '',
  comments: '',
};

if (savedFormData) {
  formData.email = savedFormData.email;
  formData.comments = savedFormData.comments;
}

emailInput.value = formData.email;
commentsInput.value = formData.comments;

contactForm.addEventListener('input', event => {
  formData[event.target.name] = event.target.value.trim();
  saveToLS(storageKey, formData);
});
