const API_KEY = config.API_KEY;
let selectedGenres = document.getElementById("selectedGenres");
selectedGenres.style.display = "none";
const form = document.getElementById("form");
const genresObject = Object.freeze({
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
  SCIFI: 878,
  "TV MOVIE": 10770,
});

form.addEventListener("submit", (e) => {
  let input = document.getElementById("inputField").value;
  let searchedFor = document.getElementById("searchedFor");
  sessionStorage.removeItem("theActorId");

  if (genresObject[input.trim().toUpperCase(input)]) {
    pageNum = 1;
    searchedFor.style.fontSize = "50px";
    const id = genresObject[input.trim().toUpperCase(input)];
    searchedFor.innerHTML = "Genre: " + "<span>" + input + "</span>";
    genres(id);
  } else if (isNaN(input)) {
    pageNum = 1;
    searchedFor.innerHTML =
      "Movie title / Actor: " + "<span>" + input + "</span>";
    searchedFor.style.fontSize = "30px";
    searchMovies(input);
    discoverByActor(input).then(moviesByActor);
  } else {
    pageNum = 1;
    searchedFor.style.fontSize = "50px";
    searchedFor.innerHTML = "Year: " + "<span>" + input + "</span>";
    discoverMovies(input);
  }
  e.preventDefault();
});

function searchMovies(searchText) {
  selectedGenres.style.display = "none";
  pageNum = 1;

  axios
    .get(
      "https://api.themoviedb.org/3/search/movie?query=" +
        searchText +
        "&api_key=" +
        API_KEY +
        "&language=en-US&page=" +
        pageNum +
        "&include_adult=false"
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
      let moviesInfo = document.getElementById("movies");
      moviesInfo.innerHTML = output;
      let totalPages = response.data.total_pages;
      let pages = document.querySelector(".pages");
      pages.style.display = "flex";

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
}
function discoverByActor(actor) {
  return axios
    .get(
      "https://api.themoviedb.org/3/search/person?api_key=" +
        API_KEY +
        "&language=en-US&query=" +
        actor +
        "&page=1&include_adult=false"
    )
    .then((response) => {
      let actorId = response.data.results[0].id;
      sessionStorage.setItem("theActorId", actorId);
    });
}

function moviesByActor() {
  selectedGenres.style.display = "block";
  selectedGenres.selectedIndex = 0;
  sessionStorage.removeItem("movieByTitleGenre");

  let actorId = sessionStorage.getItem("theActorId");

  axios
    .get(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
        API_KEY +
        "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_people=" +
        actorId
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
      let moviesInfo = document.getElementById("movies");
      moviesInfo.innerHTML = output;
      let totalPages = response.data.total_pages;
      let pages = document.querySelector(".pages");
      pages.style.display = "flex";

      if (totalPages < 2) {
        pages.style.display = "none";
      } else if (pageNum === 1) {
        prev.style.display = "none";
        next.style.display = "block";
      }
    });
  selectedGenres.addEventListener("change", (e) => {
    pageNum = 1;
    const selectedGenre = e.target.options[e.target.selectedIndex].id;
    sessionStorage.setItem("movieByTitleGenre", selectedGenre);
    axios
      .get(
        "https://api.themoviedb.org/3/discover/movie?api_key=" +
          API_KEY +
          "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_people=" +
          actorId +
          "&with_genres=" +
          selectedGenre
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
        let moviesInfo = document.getElementById("movies");
        moviesInfo.innerHTML = output;
        let totalPages = response.data.total_pages;
        let pages = document.querySelector(".pages");
        pages.style.display = "flex";

        if (totalPages < 2) {
          pages.style.display = "none";
        } else if (pageNum === 1) {
          prev.style.display = "none";
          next.style.display = "block";
        }
      });
  });
}

function discoverMovies(year) {
  selectedGenres.style.display = "block";
  selectedGenres.selectedIndex = 0;
  sessionStorage.removeItem("movieByYearGenre");
  sessionStorage.setItem("year", year);

  axios
    .get(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
        API_KEY +
        "&language=en-US&sort_by=popularity.desc&page=1&primary_release_year=" +
        year
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

      let moviesInfo = document.getElementById("movies");
      moviesInfo.innerHTML = output;
      let totalPages = response.data.total_pages;
      let pages = document.querySelector(".pages");
      pages.style.display = "flex";

      if (totalPages < 2) {
        pages.style.display = "none";
      } else if (pageNum === 1) {
        prev.style.display = "none";
        next.style.display = "block";
      }
      selectedGenres.addEventListener("change", (e) => {
        pageNum = 1;
        const selectedGenre = e.target.options[e.target.selectedIndex].id;
        sessionStorage.setItem("movieByYearGenre", selectedGenre);
        axios
          .get(
            "https://api.themoviedb.org/3/discover/movie?api_key=" +
              API_KEY +
              "&language=en-US&sort_by=popularity.desc&page=1&primary_release_year=" +
              year +
              "&with_genres=" +
              selectedGenre
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
            let moviesInfo = document.getElementById("movies");
            moviesInfo.innerHTML = output;
            let totalPages = response.data.total_pages;
            let pages = document.querySelector(".pages");
            pages.style.display = "flex";

            if (totalPages < 2) {
              pages.style.display = "none";
            } else if (pageNum === 1) {
              prev.style.display = "none";
              next.style.display = "block";
            }
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
function genres(id) {
  pageNum = 1;
  selectedGenres.style.display = "none";
  sessionStorage.setItem("genre", id);
  axios
    .get(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
        API_KEY +
        "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" +
        id
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
      let moviesInfo = document.getElementById("movies");
      moviesInfo.innerHTML = output;

      let totalPages = response.data.total_pages;
      let pages = document.querySelector(".pages");
      pages.style.display = "flex";

      if (totalPages < 2) {
        pages.style.display = "none";
      } else if (pageNum === 1) {
        prev.style.display = "none";
        next.style.display = "block";
      }
    });
}

function movieSelected(id) {
  sessionStorage.setItem("movieId", id);
  window.open("../movie-page.html");
  return false;
}

let pageNum = 1;

const next = document.getElementById("next");
next.addEventListener("click", () => {
  let input = document.getElementById("inputField").value;
  pageNum++;
  window.scrollTo(0, 0);
  if (genresObject[input.trim().toUpperCase(input)]) {
    movieByGenrePage(pageNum);
  } else if (isNaN(input)) {
    movieByTitlePage(pageNum);
    movieByActorPage(pageNum);
  } else {
    movieByYearPage(pageNum);
  }
});

const prev = document.getElementById("prev");
prev.addEventListener("click", () => {
  let input = document.getElementById("inputField").value;
  pageNum--;
  window.scrollTo(0, 0);
  if (genresObject[input.trim().toUpperCase(input)]) {
    movieByGenrePage(pageNum);
  } else if (isNaN(input)) {
    movieByTitlePage(pageNum);
    movieByActorPage(pageNum);
  } else {
    movieByYearPage(pageNum);
  }
});

function movieByActorPage(pageNum) {
  let actorId = sessionStorage.getItem("theActorId");
  let genre = sessionStorage.getItem("movieByTitleGenre");
  if (!genre || !genre.length) {
    genre = "";
  }
  axios
    .get(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
        API_KEY +
        "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=" +
        pageNum +
        "&with_people=" +
        actorId +
        "&with_genres=" +
        genre
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
      let moviesInfo = document.getElementById("movies");
      moviesInfo.innerHTML = output;
      let totalPages = response.data.total_pages;
      let pages = document.querySelector(".pages");
      pages.style.display = "flex";

      if (pageNum >= 2) {
        prev.style.display = "block";
      } else if (totalPages === pageNum) {
        next.style.display = "none";
      } else if (pageNum === 1) {
        prev.style.display = "none";
      }
    });
}

function movieByYearPage(pageNum) {
  let year = sessionStorage.getItem("year");
  let genre = sessionStorage.getItem("movieByYearGenre");
  if (!genre || !genre.length) {
    genre = "";
  }
  axios
    .get(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
        API_KEY +
        "&language=en-US&sort_by=popularity.desc&page=" +
        pageNum +
        "&primary_release_year=" +
        year +
        "&with_genres=" +
        genre
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
      let moviesInfo = document.getElementById("movies");
      moviesInfo.innerHTML = output;
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
    });
}
function movieByGenrePage(pageNum) {
  let genre = sessionStorage.getItem("genre");
  axios
    .get(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
        API_KEY +
        "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=" +
        pageNum +
        "&with_genres=" +
        genre
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
      let moviesInfo = document.getElementById("movies");
      moviesInfo.innerHTML = output;
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
    });
}
function movieByTitlePage(pageNum) {
  let searchText = document.getElementById("inputField").value;
  axios
    .get(
      "https://api.themoviedb.org/3/search/movie?query=" +
        searchText +
        "&api_key=" +
        API_KEY +
        "&language=en-US&page=" +
        pageNum +
        "&include_adult=false"
    )
    .then((response) => {
      let movie = response.data.results;
      let output = "";
      console.log(response);
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
      pages.style.display = "flex";

      if (pageNum >= 2) {
        prev.style.display = "block";
      } else if (pageNum === totalPages) {
        next.style.display = "none";
      } else if (pageNum === 1) {
        prev.style.display = "none";
      }
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
window.onload = function clearStorage() {
  sessionStorage.removeItem("movieByYearGenre");
  sessionStorage.removeItem("movieByTitleGenre");
};
