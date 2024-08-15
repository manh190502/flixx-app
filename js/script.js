const global = {
  currentPage: window.location.pathname,
};

// Spinner
function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}
function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// Highlight active link
function highlightActiveLink() {
  const link = document.querySelectorAll(".nav-link");
  link.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
}

// fetch pupular movie and display on home page

async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
              <a href="movie-details.html?id=${movie.id}">
                ${
                  movie.poster_path
                    ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
                    : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
                }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
    `;

    document.querySelector("#popular-movies").appendChild(div);
  });
}

//fetch tv show and display

async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular");
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
                <a href="tv-details.html?id=${show.id}">
                  ${
                    show.poster_path
                      ? `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
              />`
                      : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}"
              />`
                  }
            </a>
            <div class="card-body">
              <h5 class="card-title">${show.name}</h5>
              <p class="card-text">
                <small class="text-muted">Air Date: ${
                  show.first_air_date
                }</small>
              </p>
            </div>
      `;

    document.querySelector("#popular-shows").appendChild(div);
  });
}

// Display movie details

async function displayMovieDetails() {
  const movieID = window.location.search.split("=")[1];
  const movie = await fetchAPIData(`movie/${movieID}`);

  //   overlay for background image
  displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `
            <div class="details-top">
            <div>
                ${
                  movie.poster_path
                    ? `              <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
              />`
                    : `              <img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${movie.title}"
              />`
                } 
            </div>
            <div>
              <h2>${movie.title}</h2>
              <p>
                <i class="fas fa-star text-primary"></i>
                ${movie.vote_average} / 10
              </p>
              <p class="text-muted">Release Date: ${movie.release_date}</p>
              <p>
                ${movie.overview}
              </p>
              <h5>Genres</h5>
              <ul class="list-group">
                ${movie.genres
                  .map((genre) => `<li>${genre.name}</li>`)
                  .join("")}
              </ul>
              <a href="${
                movie.homepage
              }" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
          </div>
          <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
              <li><span class="text-secondary">Budget:</span> $${formatNumberWithCommas(
                movie.budget
              )}</li>
              <li><span class="text-secondary">Revenue:</span> $${formatNumberWithCommas(
                movie.revenue
              )}</li>
              <li><span class="text-secondary">Runtime:</span> ${
                movie.runtime
              } minutes</li>
              <li><span class="text-secondary">Status:</span> ${
                movie.status
              }</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">${movie.production_companies
              .map((company) => `${company.name}`)
              .join(", ")}</div>
          </div>
    `;

  document.querySelector("#movie-details").appendChild(div);
}

// Display tvshow details

async function displayShowDetails() {
  const tvID = window.location.search.split("=")[1];
  const tv = await fetchAPIData(`tv/${tvID}`);

  //   overlay for background image
  displayBackgroundImage("show", tv.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `
               <div class="details-top">
          <div>
            ${
              tv.poster_path
                ? `            <img
              src="https://image.tmdb.org/t/p/w500${tv.poster_path}"
              class="card-img-top"
              alt="${tv.name}"
            />`
                : `            <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${tv.name}"
            />`
            }
          </div>
          <div>
            <h2>${tv.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${tv.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${tv.first_air_date}</p>
            <p>
                ${tv.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${tv.genres.map((genre) => `${genre.name}`).join("")}
            </ul>
            <a href="${
              tv.homepage
            }" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              tv.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                tv.last_episode_to_air.name
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${tv.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${tv.production_companies.map(
            (company) => `${company.name}`
          )}</div>
        </div>
      `;

  document.querySelector("#show-details").appendChild(div);
}

// add commas to number
function formatNumberWithCommas(number) {
  return number.toLocaleString("en-US");
}

// display backdrop on details page
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

// display slider movies
async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
            </h4>    
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Fetch data form TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = "1fccf003db72b9cb5ae3390702f54d71";
  const API_URL = "https://api.themoviedb.org/3/";

  showSpinner();

  const res = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await res.json();

  hideSpinner();
  return data;
}

// init app
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayPopularMovies();
      displaySlider();
      break;
    case "/shows.html":
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/search.html":
      console.log("Search");
      break;
  }

  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
