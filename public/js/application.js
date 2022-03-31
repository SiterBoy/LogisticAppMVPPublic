/* eslint-disable no-restricted-syntax */
const registrationForm = document.forms.registration;
const loginForm = document.forms.login;
const resultArea = document.querySelector('.result-area');
const citiesArea = document.querySelector('.cities_ul');
const addCityForm = document.forms.addCity;
const addCompanyForm = document.forms.addCompany;
const companysArea = document.querySelector('.companys_ul');
const addRouteForm = document.forms.addRoute;
const routesArea = document.querySelector('.routes-of-company');
const mainControlArea = document.querySelector('.main-control-panel');
const { mainForm } = document.forms;
// const fromCitiesUl = document.querySelector('.from-block-cities__ul');
// const toCitiesUl = document.querySelector('.to-block-cities__ul');

function showResult(resultText, isSuccess) {
  const resultClass = isSuccess ? 'green' : 'red';
  const insertElem = document.createElement('div');
  insertElem.className = resultClass;
  insertElem.innerHTML = resultText;
  resultArea.insertAdjacentElement('afterbegin', insertElem);
  setTimeout(() => {
    insertElem.remove();
  }, 2500);
}

registrationForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const registerData = Object.fromEntries(new FormData(evt.target));
  const { action, method } = evt.target;
  if (registerData.password === registerData.password2) {
    try {
      const response = fetch(action, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });
      const result = await response;
      if (result.ok) {
        document.location.href = '/';
      }
    } catch (err) {
      resultArea.innerHTML = 'Что-то пошло не так, попробуйте позже';
      console.log(err);
    }
  } else {
    showResult('Пароли не совпадают', false);
  }
});

loginForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const { method, action } = evt.target;
  const userData = Object.fromEntries(new FormData(evt.target));
  const response = await fetch(action, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  const jsonResponse = await response.json();
  console.log(jsonResponse);
  if (jsonResponse.success) {
    showResult('Успешно', true);
    window.location = jsonResponse.redirect;
  } else {
    showResult(jsonResponse.error, false);
    loginForm.reset();
  }
});

citiesArea?.addEventListener('click', async (evt) => {
  evt.preventDefault();
  if (evt.target.className.includes('delete-city-js')) {
    const reqUrl = evt.target.href;
    try {
      const response = await fetch(reqUrl, {
        method: 'DELETE'
      });
      if (response.ok) {
        const closestLi = evt.target.closest('li');
        closestLi.remove();
      }
    } catch (err) {
      showResult('Не получилось удалить город. Попробуйте еще раз', false);
    }
  }
});

addCityForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const { action, method } = evt.target;
  const formData = Object.fromEntries(new FormData(evt.target));
  try {
    const response = await fetch(action, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const oneCityHtml = await response.text();
    console.log(oneCityHtml);
    if (response.ok) {
      citiesArea.insertAdjacentHTML('beforeend', oneCityHtml);
      evt.target.reset();
    }
  } catch (err) {
    showResult('Добавить город не получилось! Попробуйте еще раз', false);
  }
});

addCompanyForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const { action, method } = evt.target;
  const formData = Object.fromEntries(new FormData(evt.target));
  try {
    const response = await fetch(action, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const oneCompanyHtml = await response.text();
    if (response.ok) {
      companysArea.insertAdjacentHTML('beforeend', oneCompanyHtml);
      evt.target.reset();
    }
  } catch (err) {
    showResult('Добавить компанию не получилось! Попробуйте еще раз', false);
  }
});

companysArea?.addEventListener('click', async (evt) => {
  evt.preventDefault();
  if (evt.target.className.includes('delete-company-js')) {
    const reqUrl = evt.target.href;
    try {
      const response = await fetch(reqUrl, {
        method: 'DELETE'
      });
      if (response.ok) {
        const closestLi = evt.target.closest('li');
        closestLi.remove();
      }
    } catch (err) {
      showResult('Не получилось удалить компанию. Попробуйте еще раз', false);
    }
  } else {
    window.location = evt.target.href;
  }
});

addRouteForm?.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const { action, method } = evt.target;
  const formData = Object.fromEntries(new FormData(evt.target));
  try {
    const response = await fetch(action, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const oneRouteHTML = await response.text();
    if (response.ok) {
      location.reload();
    }
  } catch (err) {
    showResult('Добавить маршрут не получилось! Попробуйте еще раз', false);
  }
});

mainControlArea?.addEventListener('click', async (evt) => {
  const { action, method } = mainForm;
  const userData = Object.fromEntries(new FormData(mainForm));
  if (evt.target.className === 'main-form-input') {
    const response = await fetch(`${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    const routes = await response.json();
    if (response.ok) {
      let { companies, citiesTo, citiesFrom } = routes;
      companies = unicalizeObj(companies);
      citiesTo = unicalizeObj(citiesTo);
      citiesFrom = unicalizeObj(citiesFrom);
      companiesUl.innerHTML = generateLiElems(companies, 'company');
      fromCitiesUl.innerHTML = generateLiElems(citiesFrom, 'fromCity');
      toCitiesUl.innerHTML = generateLiElems(citiesTo, 'toCity');
    }
  }
});

function unicalizeObj(arr) {
  const uzedId = [];
  const newArray = [];
  for (let i = 0; i < arr.length; i += 1) {
    // eslint-disable-next-line no-restricted-syntax
    // eslint-disable-next-line guard-for-in
    for (const key in arr[i]) {
      if (!uzedId.includes(arr[i].id)) {
        newArray.push(arr[i]);
        uzedId.push(arr[i].id);
      }
    }
  }
  return newArray;
}

function generateLiElems(arr, name) {
  let liHtml = '';

  arr.forEach((elem) => {
    if (elem.checked) {
      liHtml += `<li>${elem.name} <input type="radio" checked class="main-form-input" name="${name}" value="${elem.id}"></li>`;
    } else {
      liHtml += `<li>${elem.name} <input type="radio" class="main-form-input" name="${name}" value="${elem.id}"></li>`;
    }
  });

  return liHtml;
}

routesArea?.addEventListener('click', async (evt) => {
  evt.preventDefault();
  if (evt.target.className.includes('delete-routes-of-company')) {
    try {
      const response = await fetch(evt.target.href, {
        method: 'DELETE'
      });

      if (response.ok) {
        const closestDiv = evt.target.closest('.routes-of-company__one-routre');
        closestDiv.remove();
      }
    } catch {
      console.log(err);
      showResult('Удалить запись не получилось! Попробуйте еще раз!');
    }
  }
});
