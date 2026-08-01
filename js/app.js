const movieGrid = document.getElementById("movieGrid");
const searchInput = document.getElementById("searchInput");
const loader = document.getElementById("loader");

let filteredMovies = [...movies];

/* ==============================
    INITIALIZE
============================== */

window.addEventListener("DOMContentLoaded", () => {
    showLoader();

    setTimeout(() => {
        renderMovies(filteredMovies);
        hideLoader();
    }, 400);
});

/* ==============================
    RENDER MOVIES
============================== */

function renderMovies(movieList) {

    movieGrid.innerHTML = "";

    if (movieList.length === 0) {

        movieGrid.innerHTML = `
            <div class="no-result">
                <h2>No Movies Found</h2>
            </div>
        `;

        return;
    }

    movieList.forEach(movie => {

        const card = document.createElement("div");

        card.className = "movie-card";

        card.innerHTML = `
        
            <img
                class="movie-image"
                src="${movie.imageUrl}"
                alt="${movie.name}"
                loading="lazy"
            >

            <div class="movie-content">

                <h3 class="movie-title">
                    ${movie.name}
                </h3>

                <button
                    class="play-btn"
                    data-id="${movie.id}"
                >
                    ▶ Play Now
                </button>

            </div>

        `;

        movieGrid.appendChild(card);

    });

}

/* ==============================
    PLAY BUTTON
============================== */

movieGrid.addEventListener("click", (e) => {

    if (!e.target.classList.contains("play-btn"))
        return;

    const id = e.target.dataset.id;

    window.location.href = `player.html?id=${id}`;

});

/* ==============================
    SEARCH
============================== */

searchInput.addEventListener("keyup", function () {

    const keyword = this.value.trim().toLowerCase();

    filteredMovies = movies.filter(movie =>

        movie.name
            .toLowerCase()
            .includes(keyword)

    );

    renderMovies(filteredMovies);

});

/* ==============================
    LOADER
============================== */

function showLoader() {

    loader.classList.remove("hidden");

}

function hideLoader() {

    loader.classList.add("hidden");

}