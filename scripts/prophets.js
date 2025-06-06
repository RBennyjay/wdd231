const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

async function getProphetData() {
  const response = await fetch(url);
  const data = await response.json();
  displayProphets(data.prophets);
}

const displayProphets = (prophets) => {
  prophets.forEach((prophet, index) => {
    const card = document.createElement('section');
    const fullName = document.createElement('h2');
    const birthDate = document.createElement('p');
    const birthPlace = document.createElement('p');
    const portrait = document.createElement('img');

    fullName.textContent = `${prophet.name} ${prophet.lastname}`;
    birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
    birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
    portrait.setAttribute('width', '340');
    portrait.setAttribute('height', '400');

    // Only lazy-load images after the first one
    if (index !== 0) {
      portrait.setAttribute('loading', 'lazy');
    }

    card.appendChild(fullName);
    card.appendChild(birthDate);
    card.appendChild(birthPlace);
    card.appendChild(portrait);

    cards.appendChild(card);
  });
};
// Call the function to fetch and display prophet data
getProphetData();
