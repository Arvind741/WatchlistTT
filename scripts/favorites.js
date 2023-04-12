const API_KEY = config.API_KEY;
let movieOutput = document.getElementById("movies");
const removeAllMovies = document.getElementById("removeAllMovies");
window.onload = function displayWatchlist() {
  let toWatch = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  for (let i = 0; i < toWatch.length; i++) {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/" +
          toWatch[i] +
          "?api_key=" +
          API_KEY +
          "&language=en-US"
      )
      .then((response) => {
        let movie = response.data;
        movieOutput.innerHTML += `<div class="card">
             <div class="overlay">
             <div class="addBtn"><span><i class="material-icons trash" onclick="movieSplice('${movie.id}')">delete_forever</i></span></div>
             <div class="movie">
                 <h2>${movie.title}</h2>
                 <p id="p_rating"><strong>Rating:</strong> <span>${movie.vote_average} / 10  <i class="material-icons star">star_rate</i></span> </p>
                 <p><strong>First air date:</strong> <span>${movie.release_date} <i class="material-icons date">date_range</i> </span></p>
                 <a onclick="movieSelected('${movie.id}')" href="#">Details</a>
              </div>
             </div>
             <div class="card_img">
                 <img src="http://image.tmdb.org/t/p/w400/${movie.poster_path}" onerror="this.onerror=null;this.src='../images/imageNotFound.png';">
             </div>
         </div>`;
      });

    removeAllMovies.style.display = "block";
  }
  if (toWatch.length == 0) {
    movieOutput.innerHTML += `<p class="infoText"> There are no favorite movies. Go watch some. <a href="#" onclick="openRecommendMoviesBox()"> Here are some recommendations !</a> </p>`;
  }
};

const recommendedBox = document.querySelector(".recommendedBox");
function openRecommendMoviesBox() {
  document.getElementById(
    "recommendedTitle"
  ).innerHTML = `Recommended Movies: <span class="reload"><i class="material-icons refresh" onclick="reloadRecommendedMovies()">autorenew</i></span>`;
  recommendedBox.classList.add("recommendedBoxActive");
  recommendMovies();
}
function recommendMovies() {
  let minYear = 1990;
  let maxYear = new Date().getFullYear();
  minYear = Math.ceil(minYear);
  maxYear = Math.floor(maxYear);
  let recommendedYear =
    Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;

  let minPage = 1;
  let maxPage = 5;
  minPage = Math.ceil(minPage);
  maxPage = Math.floor(maxPage);
  let recommendedPage =
    Math.floor(Math.random() * (maxPage - minPage + 1)) + minPage;

  axios
    .get(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
        API_KEY +
        "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=" +
        recommendedPage +
        "&primary_release_year=" +
        recommendedYear
    )
    .then((response) => {
      console.log(response);
      let movie = response.data.results;
      movie.length = 4;
      let output = "";
      for (let i = 0; i < movie.length; i++) {
        output += `<div class="recommended_card" onclick="movieSelected(${movie[i].id})">
                <div class="recommendedOverlay">
                    <div class="recommendedInfo">
                        <h2>${movie[i].title}</h2>
                        <p>Rating: ${movie[i].vote_average} / 10 </p>
                        <p>Release date: ${movie[i].release_date}</p>
                    </div>
                </div>
                <div class="recommended_cardImg">
                    <img src="http://image.tmdb.org/t/p/w154/${movie[i].poster_path}" onerror="this.onerror=null;this.src='../images/imageNotFound.png';">
                </div>
                </div>`;
      }
      let recOutput = document.getElementById("recommendedOutput");
      recOutput.innerHTML = output;
    });
}

document.getElementById("closeRecommended").addEventListener("click", () => {
  recommendedBox.classList.remove("recommendedBoxActive");
});

function movieSplice(id) {
  let storedId = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  let index = storedId.indexOf(id);
  storedId.splice(index, 1);
  localStorage.setItem("favoriteMovies", JSON.stringify(storedId));

  const removedWatchlist = document.getElementById("alreadyStored");
  removedWatchlist.innerHTML = "Removed from watchlist !";
  removedWatchlist.classList.add("alreadyStored");
  setTimeout(() => {
    added.classList.remove("alreadyStored");
    location.reload();
  }, 1500);
}

function movieSelected(id) {
  sessionStorage.setItem("movieId", id);
  window.open("movie-page.html");
  return false;
}

let isDown = false;
let startX;
let scrollLeft;
const recommendedOutput = document.getElementById("recommendedOutput");
recommendedOutput.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - recommendedOutput.offsetLeft;
  scrollLeft = recommendedOutput.scrollLeft;
  e.preventDefault();
  console.log(startX);
});
recommendedOutput.addEventListener("mouseup", () => {
  isDown = false;
});
recommendedOutput.addEventListener("mouseenter", () => {
  recommendedOutput.classList.add("active");
});
recommendedOutput.addEventListener("mouseleave", (e) => {
  recommendedOutput.classList.remove("active");
  isDown = false;
});
recommendedOutput.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - recommendedOutput.offsetLeft;
  const walk = x - startX;
  recommendedOutput.scrollLeft = scrollLeft - walk;
});

removeAllMovies.addEventListener("click", () => {
  localStorage.removeItem("favoriteMovies");

  const removedAll = document.getElementById("alreadyStored");
  removedAll.innerHTML = "Removed all movies!";
  removedAll.classList.add("alreadyStored");
  setTimeout(() => {
    added.classList.remove("alreadyStored");
    location.reload();
  }, 1500);
});

document.body.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    recommendedBox.classList.remove("recommendedBoxActive");
  }
});

function reloadRecommendedMovies() {
  recommendMovies();
}
