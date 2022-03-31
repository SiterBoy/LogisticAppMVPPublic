const fromCitiesUl = document.querySelector('.from-block-cities__ul');
const toCitiesUl = document.querySelector('.to-block-cities__ul');
const companiesUl = document.querySelector('.companies-block__ul');
const map = document.querySelector('.yamap');
const openMap = document.querySelector('.generate_map');
const buttonDeleteMap = document.querySelector('.delete_map');

const fromCitiesUlContent = [];
const toCitiesUlContent = [];
const companiesUlContent = [];

function generateAppData() {
  console.log(fromCitiesUl);
  const fromCitiesChildren = fromCitiesUl.children;
  const toCitiesChildren = toCitiesUl.children;
  const companiesChildren = companiesUl.children;

  for (let i = 0; i < fromCitiesChildren.length; i += 1) {
    fromCitiesUlContent.push(fromCitiesChildren[i].textContent);
  }

  for (let i = 0; i < toCitiesChildren.length; i += 1) {
    toCitiesUlContent.push(toCitiesChildren[i].textContent);
  }

  for (let i = 0; i < companiesChildren.length; i += 1) {
    companiesUlContent.push(companiesChildren[i].textContent);
  }
}

async function init() {
  const myMap = new ymaps.Map('map', {
    center: [58.76, 86.64],
    zoom: 3
  });

  const myRoutesCollection = new ymaps.GeoObjectCollection();
  let min;
  let max;
  if (fromCitiesUlContent.length >= toCitiesUlContent.length) {
    max = [...fromCitiesUlContent];
    min = [...toCitiesUlContent];
  } else {
    min = [...fromCitiesUlContent];
    max = [...toCitiesUlContent];
  }

  max.forEach(async (elem) => {
    myRoutesCollection.add(await ymaps.route([elem, min[0]]));
  });

  myMap.geoObjects.add(myRoutesCollection);

  buttonDeleteMap.addEventListener('click', () => {
    myMap.destroy();
    map.classList.toggle('map-active');
  });
}

openMap?.addEventListener('click', (evt) => {
  map.classList.toggle('map-active');
  generateAppData();
  ymaps.ready(init);
});
