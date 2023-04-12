const API_KEY = config.API_KEY;
const spinner = document.querySelector(".spinner");
spinner.style.display = "none";
const container = document.querySelector(".showcase");
container.style.display = "none";
const pages = document.querySelector(".pages");
pages.style.display = "none";
window.onload = function getMovies() {
  spinner.style.display = "block";
  setTimeout(() => {
    spinner.style.display = "none";
    container.style.display = "flex";
    pages.style.display = "flex";
  }, 1000);
  axios
    .get(
      "https://api.themoviedb.org/3/movie/now_playing?api_key=" +
        API_KEY +
        "&language=en-US&page=1&region=US"
    )
    .then((response) => {
      let movie = response.data.results;
      let output = "";
      for (let i = 0; i < movie.length; i++) {
        let id = response.data.results[i].id;
        id = JSON.stringify(id);
        let favoriteMovies =
          JSON.parse(localStorage.getItem("favoriteMovies")) || [];
        if (favoriteMovies.indexOf(id) === -1) {
          output += `
					<div class="card">
						<div class="overlay">
						<div class="addBtn"><span><i class="material-icons watch" onclick="addToList('${movie[i].id}')">watchlist</i></span>
						<span><i class="material-icons favorite" onclick="favorite('${movie[i].id}')">favorite</i></span></div>
						<div class="movie">
							<h2>${movie[i].title}</h2>
								<p id="p_rating"><strong>Rating:</strong> <span>${movie[i].vote_average} / 10  <i class="material-icons star">star_rate</i></span> </p>
								<p><strong>Release date:</strong> <span>${movie[i].release_date} <i class="material-icons date">date_range</i> </span></p>
								<a onclick="movieSelected('${movie[i].id}')" href="#">Details</a>
						</div>
						</div>
						<div class="card_img">
							<img src="http://image.tmdb.org/t/p/w400/${movie[i].poster_path}" onerror="this.onerror=null;this.src='../images/imageNotFound.png';">
						</div>
					</div>
					`;
        } else {
          output += `
					<div class="card">
					<div class="overlay">
					<div class="addBtn"><span><i class="material-icons watch" onclick="addToList('${movie[i].id}')">watchlist</i></span>
					<span><i class="material-icons favoriteMarked" onclick="favorite('${movie[i].id}')">favorite</i></span></div>
					<div class="movie">
						<h2>${movie[i].title}</h2>
							<p id="p_rating"><strong>Rating:</strong> <span>${movie[i].vote_average} / 10  <i class="material-icons star">star_rate</i></span> </p>
							<p><strong>Release date:</strong> <span>${movie[i].release_date} <i class="material-icons date">date_range</i> </span></p>
							<a onclick="movieSelected('${movie[i].id}')" href="#">Details</a>
					</div>
					</div>
					<div class="card_img">
						<img src="http://image.tmdb.org/t/p/w400/${movie[i].poster_path}" onerror="this.onerror=null;this.src='../images/imageNotFound.png';">
					</div>
				</div>
				`;
        }
      }

      let movieInfo = document.getElementById("movies");
      movieInfo.innerHTML = output;
      let totalPages = response.data.total_pages;
      let pages = document.querySelector(".pages");
      if (totalPages < 2) {
        pages.style.display = "none";
      } else if (pageNum === 1) {
        prev.style.display = "none";
        next.style.display = "block";
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
function movieSelected(id) {
  sessionStorage.setItem("movieId", id);
  window.open("../movie-page.html");
  return false;
}
let pageNum = 1;
const prev = document.getElementById("prev");
prev.addEventListener("click", () => {
  pageNum--;
  window.scrollTo(0, 0);
  search(pageNum);
});
const next = document.getElementById("next");
next.addEventListener("click", () => {
  pageNum++;
  window.scrollTo(0, 0);
  search(pageNum);
});

function search(pageNum) {
  axios
    .get(
      "https://api.themoviedb.org/3/movie/now_playing?api_key=" +
        API_KEY +
        "&language=en-US&page=" +
        pageNum
    )
    .then((response) => {
      let movie = response.data.results;
      let output = "";
      for (let i = 0; i < movie.length; i++) {
        let id = response.data.results[i].id;
        id = JSON.stringify(id);
        let favoriteMovies =
          JSON.parse(localStorage.getItem("favoriteMovies")) || [];
        if (favoriteMovies.indexOf(id) === -1) {
          output += `
					<div class="card">
						<div class="overlay">
						<div class="addBtn"><span><i class="material-icons watch" onclick="addToList('${movie[i].id}')">watchlist</i></span>
						<span><i class="material-icons favorite" onclick="favorite('${movie[i].id}')">favorite</i></span></div>
						<div class="movie">
							<h2>${movie[i].title}</h2>
								<p id="p_rating"><strong>Rating:</strong> <span>${movie[i].vote_average} / 10  <i class="material-icons star">star_rate</i></span> </p>
								<p><strong>Release date:</strong> <span>${movie[i].release_date} <i class="material-icons date">date_range</i> </span></p>
								<a onclick="movieSelected('${movie[i].id}')" href="#">Details</a>
						</div>
						</div>
						<div class="card_img">
							<img src="http://image.tmdb.org/t/p/w400/${movie[i].poster_path}" onerror="this.onerror=null;this.src='../images/imageNotFound.png';">
						</div>
					</div>
					`;
        } else {
          output += `
					<div class="card">
					<div class="overlay">
					<div class="addBtn"><span><i class="material-icons watch" onclick="addToList('${movie[i].id}')">watchlist</i></span>
					<span><i class="material-icons favorite" onclick="favorite('${movie[i].id}')">favorite</i></span></div>
					<div class="movie">
						<h2>${movie[i].title}</h2>
							<p id="p_rating"><strong>Rating:</strong> <span>${movie[i].vote_average} / 10  <i class="material-icons star">star_rate</i></span> </p>
							<p><strong>Release date:</strong> <span>${movie[i].release_date} <i class="material-icons date">date_range</i> </span></p>
							<a onclick="movieSelected('${movie[i].id}')" href="#">Details</a>
					</div>
					</div>
					<div class="card_img">
						<img src="http://image.tmdb.org/t/p/w400/${movie[i].poster_path}" onerror="this.onerror=null;this.src='../images/imageNotFound.png';">
					</div>
				</div>
				`;
        }
      }
      let movieInfo = document.getElementById("movies");
      movieInfo.innerHTML = output;

      let totalPages = response.data.total_pages;
      let pages = document.querySelector(".pages");
      pages.style.display = "flex";

      if (pageNum >= 2) {
        prev.style.display = "block";
      } else if (pageNum === totalPages) {
        next.style.display = "none";
      } else if (pageNum === 1) {
        prev.style.display = "none";
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function addToList(id) {
  let storedId = JSON.parse(localStorage.getItem("movies")) || [];
  if (storedId.indexOf(id) === -1) {
    storedId.push(id);
    localStorage.setItem("movies", JSON.stringify(storedId));
    const added = document.getElementById("added");
    added.innerHTML = "Added to watchlist !";
    added.classList.add("added");
    setTimeout(() => {
      added.classList.remove("added");
    }, 1500);
  } else {
    const alreadyStored = document.getElementById("alreadyStored");
    alreadyStored.innerHTML = "Already in watchlist !";
    alreadyStored.classList.add("alreadyStored");
    setTimeout(() => {
      alreadyStored.classList.remove("alreadyStored");
    }, 1500);
  }
}
function favorite(id) {
  let storedId = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  if (storedId.indexOf(id) === -1) {
    storedId.push(id);
    localStorage.setItem("favoriteMovies", JSON.stringify(storedId));
    const added = document.getElementById("added");
    added.innerHTML = "Added to Favorites !";
    added.classList.add("added");
    setTimeout(() => {
      added.classList.remove("added");
    }, 1500);
  } else {
    const alreadyStored = document.getElementById("alreadyStored");
    alreadyStored.innerHTML = "Already in favorites !";
    alreadyStored.classList.add("alreadyStored");
    setTimeout(() => {
      alreadyStored.classList.remove("alreadyStored");
    }, 1500);
  }
}
