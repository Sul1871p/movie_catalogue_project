// Titles: https://omdbapi.com/?s=thor&page=1&apikey=fc1fef96
// details: http://www.omdbapi.com/?i=tt3896198&apikey=285ebe6c

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const cardContainer = document.getElementById('card-container');
const posterCard = document.getElementById('poster-card');
const mainPhoto = document.getElementById('mainPhoto');
let searchedTerm = "";

// load movies from API
async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    searchedTerm = searchTerm;;
    // console.log(data.Search);
    if (data.Response == "True") {
        displayMovieList(data.Search);
        displayMovieCards(data.Search);
    };
}

function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }

}

function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if (movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h4>${movies[idx].Title}</h4>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=285ebe6c`);
            //movieSearchBox.value = "";
            console.log(movie.dataset.id)
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
            window.location.href = `http://127.0.0.1:5500/moviepage.html?movieID=${movie.dataset.id}`
            // console.log(movie.dataset.id);
            // console.log(movieDetails);
        });
    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

function displayMovieCards(details) {
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('poster-card');
        if (movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else
            moviePoster = "image_not_found.png";
        cardContainer.innerHTML = `
    <div>
    <div class="movie-card">
    <img src = "${moviePoster}">
    </div>
    <p class="card-title">${movies[idx].Title}</p>
</div>
    `;
        cardContainer.appendChild(movieListItem);
    }
    loadMovieDetails();
}
window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
});

let json_url = "movie.json";
fetch(json_url).then(Response => Response.json())
    .then((data) => {
        data.forEach((ele, i) => {
            let { Title, Poster } = ele;
            let card = document.createElement('div');
            card.classList.add('poster-card');
            card.innerHTML = `<div>
         <div class="movie-card">
         <img src="${Poster}" alt="movie poster">
     </div >
        <p class="card-title">${Title}</p>
        </div>
         `;
            cardContainer.appendChild(card);
        })
        let images = Array.from(document.getElementsByClassName("movie-card"))
        function updateImage(event) {
            let image = event.target
        
            mainPhoto.src = image.src
        }
        images.forEach(function (image) {
            image.addEventListener("click", updateImage)
        });
    });

   


