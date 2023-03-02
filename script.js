const newsContainer = document.querySelector(".news-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");
const favoriteButton = document.getElementById("favorite");
const newsButton = document.getElementById("news");
const headerLayer = document.querySelector(".layer-header");
const baseLayer = document.querySelector(".layers-base");
const middleaLayer = document.querySelector(".layers-middle-amount");
const middlefLayer = document.querySelector(".layers-middle-forest");
const frontLayer = document.querySelector(".layers-front");
const startDate = new Date();
startDate.setDate(startDate.getDate() - 10);
const year = startDate.getFullYear();
const month = startDate.getMonth() + 1 < 10 ? "0" + (startDate.getMonth() + 1) : startDate.getMonth() + 1;
const day = startDate.getDate();
const apiKey = "DEMO_KEY";
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${year}-${month}-${day}`;
let coordinatFavorite = document.documentElement.clientHeight;
let coordinatNews = document.documentElement.clientHeight;

let newsArray = [];
let favorites = {};

function createNewsDOM(page) {
  let currentArray = [];
  if (page == "favorites") {
    currentArray = Object.values(favorites);
    newsButton.classList.remove("active");
    favoriteButton.classList.add("active");
    newsContainer.replaceChildren();
  }
  if (page === "news") {
    currentArray = newsArray;
    favoriteButton.classList.remove("active");
    newsButton.classList.add("active");
    newsContainer.replaceChildren();
  }
  if (currentArray.length === 0 && page == "favorites") {
    const emptyPage = document.createElement("div");
    emptyPage.classList.add("empty-page");
    const emptyImage = document.createElement("img");
    emptyImage.classList.add("empty-image");
    emptyImage.src = "image/rocket_fav.webp";
    emptyImage.alt = "rocket";
    const emptyText = document.createElement("div");
    emptyText.classList.add("empty-text");
    const emptyTitle = document.createElement("h2");
    emptyTitle.textContent = "Ooops, post list is empty";
    const emptyParagraph = document.createElement("p");
    emptyParagraph.textContent = "Add your favorite posts in the news section";
    emptyPage.append(emptyText, emptyImage);
    emptyText.append(emptyTitle, emptyParagraph);
    newsContainer.append(emptyPage);
  }
  if (Object.keys(currentArray) == "error") {
    loader.classList.add("hidden");
    const errorPage = document.createElement("div");
    errorPage.classList.add("error-page");
    const errorTitle = document.createElement("h3");
    errorTitle.textContent = "Request limit exceeded";
    const errorMessege = document.createElement("p");
    errorMessege.textContent = "Please come back later";
    errorPage.append(errorTitle, errorMessege);
    newsContainer.append(errorPage);
    return;
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
    saveText.classList.add("clickble", "clickble-blue");

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

    const footer = document.createElement("div");
    footer.classList.add("card-bottom");
    // date
    const date = document.createElement("strong");
    date.textContent = news.date;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${news.copyright === undefined ? "" : news.copyright}`;
    const dateBlock = document.createElement("div");
    dateBlock.classList.add("card-date");

    // append
    dateBlock.append(date, copyright);
    footer.append(dateBlock, saveText);
    cardBody.append(cardTitle, cardText, footer);
    link.append(image);
    card.append(link, cardBody);
    newsContainer.append(card);
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
  } catch (error) {
    loader.classList.add("hidden");
    createNewsDOM("news");
  }
}

function saveFavorite(itemUrl) {
  newsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
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

function handleScrollTo(coord) {
  scrollTo(0, coord);
}

newsButton.addEventListener("click", () => {
  coordinatFavorite = window.pageYOffset;
  createNewsDOM("news");
  handleScrollTo(coordinatNews);
});

favoriteButton.addEventListener("click", () => {
  coordinatNews = window.pageYOffset;
  createNewsDOM("favorites");
  handleScrollTo(coordinatFavorite);
});

window.addEventListener("scroll", () => {
  headerLayer.style.cssText = `transform: translate3d(0, calc(${scrollY}px / 2), 0)`;
  baseLayer.style.cssText = `transform: translate3d(0, calc(${scrollY}px  / 1.6), 0)`;
  middleaLayer.style.cssText = `transform: translate3d(0, calc(${scrollY}px  / 2.5), 0)`;
  middlefLayer.style.cssText = `transform: translate3d(0, calc(${scrollY}px  / 4.5), 0)`;
  frontLayer.style.cssText = `transform: translate3d(0, calc(${scrollY}px  / 5.8), 0)`;
});

getNasaInfo();
