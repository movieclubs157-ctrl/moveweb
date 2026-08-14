/* =========================================================
   COMMON.JS
========================================================= */


/* =========================================================
   GET MOVIE ID FROM URL
========================================================= */

function getMovieId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return Number(
        params.get("id")
    );

}


/* =========================================================
   FIND MOVIE
========================================================= */

function getMovieById(id) {

    return movies.find(
        function(movie) {

            return movie.id === id;

        }
    );

}


/* =========================================================
   GET POSTER PATH
========================================================= */

function getPoster(movieId) {

    return `assets/movieimage/${movieId}.webp`;

}


/* =========================================================
   FOOTER SHOW / HIDE
========================================================= */

function setupFooter() {

    const toggle =
        document.getElementById(
            "footerToggle"
        );

    const ad =
        document.getElementById(
            "footerAd"
        );


    if (!toggle || !ad) {

        return;

    }


    toggle.addEventListener(
        "click",
        function() {

            ad.classList.toggle(
                "footer-hidden"
            );


            if (
                ad.classList.contains(
                    "footer-hidden"
                )
            ) {

                toggle.textContent =
                    "Show Advertisement";

            }
            else {

                toggle.textContent =
                    "Hide Advertisement";

            }

        }
    );

}


/* =========================================================
   INITIALIZE COMMON FUNCTIONS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setupFooter();

    }
);


/* =========================================================
   DIRECT AD LINKS
========================================================= */

const directLinks = [
    "https://example-ad-1.com",
    "https://example-ad-2.com",
    "https://example-ad-3.com"
];


/* =========================================================
   OPEN RANDOM DIRECT LINK
========================================================= */

function openRandomDirectLink() {

    if (directLinks.length === 0) {
        return;
    }

    const randomIndex =
        Math.floor(
            Math.random() * directLinks.length
        );

    const randomLink =
        directLinks[randomIndex];

    window.open(
        randomLink,
        "_blank"
    );

}