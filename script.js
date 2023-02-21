const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");
const favoriteButton = document.getElementById("favorite");
const newsButton = document.getElementById("news");
// last 10 day
const startDate = new Date();
startDate.setDate(startDate.getDate() - 10);
const year = startDate.getFullYear();
const month = startDate.getMonth() + 1 < 10 ? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1;
const day = startDate.getDate();
// URL and API key
const apiKey = "DEMO_KEY";
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${year}-${month}-${day}`;
// array news
let newsArray = [];
let favorites = {};

function createNewsDOM(page) {
  let currentArray = [];
  if (page == "favorites") {
    currentArray = Object.values(favorites);
    imagesContainer.replaceChildren();
  }
  if (page === "news") {
    currentArray = newsArray;
    imagesContainer.replaceChildren();
  }

  currentArray.forEach((news) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const link = document.createElement("a");
    link.href = news.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // img
    const image = document.createElement("img");
    image.src = news.url;
    image.alt = "NASA IMG";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    // card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = news.title;
    const saveText = document.createElement("p");
    saveText.classList.add("clickble");

    if (page === "news") {
      saveText.textContent = "add to favorites";
      saveText.addEventListener("click", () => {
        saveFavorite(news.url);
      });
    }
    if (page === "favorites") {
      saveText.textContent = "remove favorites";
      saveText.addEventListener("click", () => {
        removeFavorites(news.url);
      });
    }

    // text
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = news.explanation;

    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // date
    const date = document.createElement("strong");
    date.textContent = news.date;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${news.copyright === undefined ? "" : news.copyright}`;

    // append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.append(image);
    card.append(link, cardBody);
    imagesContainer.append(card);
  });
}

function updateInfo(page) {
  if (localStorage.getItem("Favorites")) {
    favorites = JSON.parse(localStorage.getItem("Favorites"));
  }
  createNewsDOM(page);
  loader.classList.add("hidden");
}

async function getNasaInfo() {
  loader.classList.remove("hidden");
  try {
    const res = await fetch(apiURL);
    newsArray = await res.json();
    newsArray.reverse();
    updateInfo("news");
  } catch (err) {
    // err
  }
}

function saveFavorite(itemUrl) {
  newsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      console.log(favorites);
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      localStorage.setItem("Favorites", JSON.stringify(favorites));
    }
  });
}

function removeFavorites(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem("Favorites", JSON.stringify(favorites));
    createNewsDOM("favorites");
  }
}

favoriteButton.addEventListener("click", () => {
  createNewsDOM("favorites");
});

newsButton.addEventListener("click", () => {
  createNewsDOM("news");
});

getNasaInfo();
