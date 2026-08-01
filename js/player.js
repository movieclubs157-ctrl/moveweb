const container = document.getElementById("movieContainer");

// Get Movie ID
const params = new URLSearchParams(window.location.search);
const movieId = Number(params.get("id"));

// Find Movie
const movie = movies.find(m => m.id === movieId);

// Movie Not Found
if (!movie) {

    container.innerHTML = `
        <div class="not-found">
            <h1>Movie Not Found</h1>
            <br>
            <a href="index.html" class="back-btn">Go Back</a>
        </div>
    `;

} else {

    renderMovie();

}

// Advertisement URLs
const adLinks = [
    "https://labourcomparison.com/emse0dfv?key=7e4d1477af047c755cf0a11179e7f7a7",
    "https://labourcomparison.com/br188wmkz?key=b130e631d2c0de19e87dc5047ed38a57"
];

// Returns a random ad URL
function getRandomAdLink() {
    const randomIndex = Math.floor(Math.random() * adLinks.length);
    return adLinks[randomIndex];
}

// ===============================
// Render Movie
// ===============================

function renderMovie() {

    container.innerHTML = `
    
        <img
            src="${movie.imageUrl}"
            class="poster"
            alt="${movie.name}"
        >

        <h1 class="movie-title">
            ${movie.name}
        </h1>

        <div class="support-box">

            <p class="support-text">
                Click to continue watching.
            </p>

            <button
                id="openAdBtn"
                class="play-button">
		Click Here
            </button>

        </div>

    `;

    document
        .getElementById("openAdBtn")
        .addEventListener("click", openAdvertisement);

}

// ===============================
// Open Advertisement
// ===============================

function openAdvertisement() {

    const randomAd = getRandomAdLink();

    window.open(randomAd, "_blank");

    const btn = document.getElementById("openAdBtn");

    btn.innerHTML = "✅ Play";

    btn.removeEventListener("click", openAdvertisement);

    btn.addEventListener("click", startCountdown);

}

// ===============================
// Countdown
// ===============================

function startCountdown() {

    container.innerHTML = `

        <div class="countdown-box">

            <h2>
                Preparing your movie...
            </h2>

            <p>
                Please wait while we load your movie.
            </p>

            <h1 id="timer">
                10
            </h1>

        </div>

    `;

    let seconds = 10;

    const timer = document.getElementById("timer");

    const interval = setInterval(() => {

        seconds--;

        timer.textContent = seconds;

        if (seconds <= 0) {

            clearInterval(interval);

            loadPlayer();

        }

    }, 1000);

}

// ===============================
// Load Player
// ===============================

function loadPlayer() {

    container.innerHTML = `

        <iframe
            class="player"
            src="${movie.url}"
            allowfullscreen
            allow="fullscreen; autoplay; encrypted-media"
            referrerpolicy="origin"
        ></iframe>

    `;

}