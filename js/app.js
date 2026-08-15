const state = {
    allItems: [],
    filteredItems: [],
    filter: "all",
    search: "",
    page: 1,
    perPage: 12
};


/* ==========================
   DOM ELEMENTS
========================== */

const movieGrid = document.getElementById("movieGrid");
const pagination = document.getElementById("pagination");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const listTitle = document.getElementById("listTitle");

const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");


/* ==========================
   FOOTER YEAR
========================== */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* ==========================
   LOAD MOVIES
========================== */

state.allItems = moviesData;

applyFilters();

// async function loadMovies() {

//     try {

//         const response = await fetch(
//             "data/movies.json",
//             {
//                 cache: "no-store"
//             }
//         );


//         if (!response.ok) {

//             throw new Error(
//                 `Could not load movies.json (${response.status})`
//             );

//         }


//         state.allItems = await response.json();


//         if (!Array.isArray(state.allItems)) {

//             throw new Error(
//                 "movies.json must contain an array."
//             );

//         }


//         applyFilters();

//     } catch (error) {

//         console.error(error);


//         if (resultCount) {
//             resultCount.textContent =
//                 "Unable to load data";
//         }


//         if (movieGrid) {

//             movieGrid.innerHTML = `
//                 <div class="load-error">

//                     <h3>
//                         Could not load movie data
//                     </h3>

//                     <p>
//                         Make sure data/movies.json exists
//                         and the website is running through
//                         a local web server.
//                     </p>

//                 </div>
//             `;

//         }

//     }

// }


/* ==========================
   APPLY FILTERS
========================== */

function applyFilters() {

    const search =
        state.search
            .trim()
            .toLowerCase();


    state.filteredItems =
        state.allItems.filter(item => {

            const itemType =
                String(item.type || "")
                    .toLowerCase();


            const matchesType =
                state.filter === "all" ||
                itemType ===
                state.filter.toLowerCase();


            const itemName =
                String(item.name || "")
                    .toLowerCase();


            const matchesSearch =
                !search ||
                itemName.includes(search);


            return (
                matchesType &&
                matchesSearch
            );

        });


    /*
     * Always return to page 1
     * when filter/search changes.
     */
    state.page = 1;


    render();

}


/* ==========================
   RENDER EVERYTHING
========================== */

function render() {

    renderCards();

    renderPagination();

    updateHeading();

}


/* ==========================
   RENDER MOVIE CARDS
========================== */

function renderCards() {

    if (!movieGrid) {
        return;
    }


    const start =
        (state.page - 1) *
        state.perPage;


    const pageItems =
        state.filteredItems.slice(
            start,
            start + state.perPage
        );


    movieGrid.innerHTML = "";


    /*
     * No results
     */
    if (!pageItems.length) {

        if (emptyState) {
            emptyState.classList.remove("hidden");
        }

        return;

    }


    if (emptyState) {
        emptyState.classList.add("hidden");
    }


    pageItems.forEach(item => {

        const card =
            document.createElement("article");


        card.className = "movie-card";


        const name =
            escapeHtml(item.name || "Untitled");


        const description =
            escapeHtml(
                item.description ||
                "No description available."
            );


        const type =
            escapeHtml(
                item.type ||
                "Movie"
            );


        card.innerHTML = `

            <div class="poster-wrap">

                <img
                    src="assets/image/${item.id}.webp"
                    alt="${name} poster"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.src='assets/image/placeholder.webp';
                    "
                >


                <span class="type-badge">
                    ${type}
                </span>


                <div class="card-overlay">

                    <span class="card-play">
                        ▶
                    </span>

                </div>

            </div>


            <div class="movie-info">

                <h3>
                    ${name}
                </h3>

                <p>
                    ${description}
                </p>

            </div>

        `;


        /*
         * Open player page
         */
        card.addEventListener(
            "click",
            () => {

                openDirectLink();

                window.location.href =
                    `player.html?id=${encodeURIComponent(item.id)}`;

            }
        );


        movieGrid.appendChild(card);

    });

}


/* ==========================
   OPEN DIRECT LINK
========================== */

function openDirectLink() {

    const urls = [
        "https://labourcomparison.com/emse0dfv?key=7e4d1477af047c755cf0a11179e7f7a7",
        "https://labourcomparison.com/br188wmkz?key=b130e631d2c0de19e87dc5047ed38a57"
    ];

    const randomIndex = Math.floor(Math.random() * urls.length);
    const newWindow = window.open(urls[randomIndex], "_blank");

    /*
     * Must be called from the user's
     * click event to reduce the chance
     * of popup blocking.
     */
    // const newWindow =
    //     window.open(
    //         url,
    //         "_blank",
    //         "noopener,noreferrer"
    //     );


    /*
     * If popup was blocked, don't break
     * the player page.
     */
    if (!newWindow) {

        console.warn(
            "Popup was blocked by the browser."
        );

    }

}


/* ==========================
   PAGINATION
========================== */

function renderPagination() {

    if (!pagination) {
        return;
    }


    const totalPages =
        Math.ceil(
            state.filteredItems.length /
            state.perPage
        );


    pagination.innerHTML = "";


    /*
     * Don't show pagination
     * when only one page exists.
     */
    if (totalPages <= 1) {
        return;
    }


    /*
     * Previous
     */
    const previous =
        createPageButton(
            "←",
            state.page - 1,
            state.page === 1
        );


    pagination.appendChild(previous);


    /*
     * Page numbers
     */
    const pages =
        getPageNumbers(
            totalPages,
            state.page
        );


    pages.forEach(page => {

        /*
         * Ellipsis
         */
        if (page === "...") {

            const dots =
                document.createElement("span");


            dots.className =
                "page-dots";


            dots.textContent =
                "...";


            pagination.appendChild(dots);


            return;
        }


        /*
         * Normal page button
         */
        const button =
            createPageButton(
                page,
                page,
                false
            );


        if (page === state.page) {

            button.classList.add(
                "active"
            );

        }


        pagination.appendChild(button);

    });


    /*
     * Next
     */
    const next =
        createPageButton(
            "→",
            state.page + 1,
            state.page === totalPages
        );


    pagination.appendChild(next);

}


/* ==========================
   CREATE PAGE BUTTON
========================== */

function createPageButton(
    label,
    page,
    disabled
) {

    const button =
        document.createElement("button");


    button.className =
        "page-btn";


    button.textContent =
        label;


    button.disabled =
        disabled;


    if (!disabled) {

        button.addEventListener(
            "click",
            () => {

                state.page = page;


                render();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    return button;

}


/* ==========================
   PAGE NUMBER GENERATOR
========================== */

function getPageNumbers(
    total,
    current
) {

    /*
     * If there are only a few pages,
     * show all of them.
     */
    if (total <= 7) {

        return Array.from(
            {
                length: total
            },
            (_, index) => index + 1
        );

    }


    /*
     * Near beginning
     */
    if (current <= 4) {

        return [
            1,
            2,
            3,
            4,
            5,
            "...",
            total
        ];

    }


    /*
     * Near end
     */
    if (current >= total - 3) {

        return [
            1,
            "...",
            total - 4,
            total - 3,
            total - 2,
            total - 1,
            total
        ];

    }


    /*
     * Middle
     */
    return [
        1,
        "...",
        current - 1,
        current,
        current + 1,
        "...",
        total
    ];

}


/* ==========================
   UPDATE HEADING
========================== */

function updateHeading() {

    if (!listTitle || !resultCount) {
        return;
    }


    let label = "All Titles";


    if (state.filter === "Movie") {

        label = "Movies";

    } else if (state.filter === "Series") {

        label = "Series";

    }


    listTitle.textContent =
        label;


    const total =
        state.filteredItems.length;


    resultCount.textContent =
        `${total} title${total === 1 ? "" : "s"} found`;

}


/* ==========================
   CATEGORY FILTER
========================== */

document
    .querySelectorAll(
        ".main-nav .nav-link"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                /*
                 * Close mobile menu
                 */
                document
                    .querySelector(".main-nav")
                    ?.classList.remove("open");


                /*
                 * Active navigation
                 */
                document
                    .querySelectorAll(
                        ".main-nav .nav-link"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                /*
                 * Set filter
                 */
                state.filter =
                    button.dataset.filter ||
                    "all";


                applyFilters();

            }
        );

    });


/* ==========================
   SEARCH
========================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        event => {

            state.search =
                event.target.value;


            if (clearSearch) {

                clearSearch.classList.toggle(
                    "visible",
                    Boolean(
                        state.search
                    )
                );

            }


            applyFilters();

        }
    );

}


/* ==========================
   CLEAR SEARCH
========================== */

if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        () => {

            if (searchInput) {

                searchInput.value = "";

            }


            state.search = "";


            clearSearch.classList.remove(
                "visible"
            );


            applyFilters();


            searchInput?.focus();

        }
    );

}


/* ==========================
   MOBILE MENU
========================== */

if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener(
        "click",
        () => {

            const nav =
                document.querySelector(
                    ".main-nav"
                );


            nav?.classList.toggle(
                "open"
            );

        }
    );

}


/* ==========================
   URL FILTER
========================== */

const params =
    new URLSearchParams(
        window.location.search
    );


const urlType =
    params.get("type");


if (
    urlType === "Movie" ||
    urlType === "Series"
) {

    state.filter =
        urlType;


    document
        .querySelectorAll(
            ".main-nav .nav-link"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter ===
                urlType
            );

        });

}


/* ==========================
   HTML ESCAPE
========================== */

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* ==========================
   START APPLICATION
========================== */

// loadMovies();