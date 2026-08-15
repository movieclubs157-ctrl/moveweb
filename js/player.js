/* ==========================
   PLAYER STATE
========================== */

const state = {
    item: null,
    selectedEpisode: null,
    isLoading: false
};


/* ==========================
   DOM ELEMENTS
========================== */

const details =
    document.getElementById("details");

const playerArea =
    document.getElementById("playerArea");

const episodeTabs =
    document.getElementById("episodeTabs");

const watchTitle =
    document.getElementById("watchTitle");

const watchStatus =
    document.getElementById("watchStatus");

const placeholderTitle =
    document.getElementById("placeholderTitle");

const yearElement =
    document.getElementById("year");


/* ==========================
   FOOTER YEAR
========================== */

if (yearElement) {
    yearElement.textContent =
        new Date().getFullYear();
}


/* ==========================
   GET MOVIE ID
========================== */

const params =
    new URLSearchParams(
        window.location.search
    );


const itemId =
    params.get("id");


/* ==========================
   LOAD DATA
========================== */

async function loadPlayerData() {

    if (!itemId) {

        showError(
            "No movie or series was selected."
        );

        return;

    }


    try {

        // const response =
        //     await fetch(
        //         "data/movies.json",
        //         {
        //             cache: "no-store"
        //         }
        //     );


        // if (!response.ok) {

        //     throw new Error(
        //         `Could not load movies.json (${response.status})`
        //     );

        // }


        // const movies =
        //     await response.json();


        // if (!Array.isArray(movies)) {

        //     throw new Error(
        //         "movies.json must contain an array."
        //     );

        // }


        /*
         * Compare as strings so both
         * numeric and string IDs work.
         */
        const item =
            moviesData.find(
                movie =>
                    String(movie.id) ===
                    String(itemId)
            );


        if (!item) {

            showError(
                "Movie or series not found."
            );

            return;

        }


        state.item = item;


        renderDetails();


        if (
            normalizeType(item.type) ===
            "series"
        ) {

            renderEpisodes();

            showSeriesPlaceholder();

        } else {

            renderMoviePlayer();

        }


        /*
         * Update browser title
         */
        document.title =
            `${item.name || "Watch"} - StreamHub`;


    } catch (error) {

        console.error(error);


        showError(
            "Unable to load the selected title."
        );

    }

}


/* ==========================
   RENDER DETAILS
========================== */

function renderDetails() {

    if (!details || !state.item) {
        return;
    }


    const item =
        state.item;


    const name =
        escapeHtml(
            item.name ||
            "Untitled"
        );


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


    details.innerHTML = `

        <div class="details-poster">

            <img
                src="assets/image/${item.id}.webp"
                alt="${name} poster"
                onerror="
                    this.onerror=null;
                    this.src='assets/image/placeholder.webp';
                "
            >

        </div>


        <div class="details-content">

            <span class="type-badge large">
                ${type}
            </span>


            <h1>
                ${name}
            </h1>


            <p>
                ${description}
            </p>

        </div>

    `;

}


/* ==========================
   MOVIE PLAYER
========================== */

function renderMoviePlayer() {

    if (!playerArea || !state.item) {
        return;
    }


    /*
     * Movie must have a URL.
     */
    if (!state.item.url) {

        showPlayerError(
            "No movie player URL is available."
        );

        return;

    }


    const name =
        state.item.name ||
        "Movie";


    if (watchTitle) {

        watchTitle.textContent =
            name;

    }


    if (placeholderTitle) {

        placeholderTitle.textContent =
            `Ready to watch ${name}`;

    }


    /*
     * Show a play button.
     *
     * The direct URL will be opened
     * only after the user clicks.
     */
    playerArea.innerHTML = `

        <div class="player-placeholder">

            <div class="play-circle">
                ▶
            </div>


            <h3>
                ${escapeHtml(name)}
            </h3>


            <p>
                Click below to start watching.
            </p>


            <button
                id="playMovieBtn"
                class="primary-play-btn"
                type="button">

                ▶
                Play Movie

            </button>

        </div>

    `;


    const playButton =
        document.getElementById(
            "playMovieBtn"
        );


    playButton?.addEventListener(
        "click",
        () => {

            playMovie(
                state.item.url
            );

        }
    );


    setStatus(
        "Ready",
        "ready"
    );

}


/* ==========================
   PLAY MOVIE
========================== */

function playMovie(url) {

    if (state.isLoading) {
        return;
    }


    state.isLoading = true;


    setStatus(
        "Opening...",
        "loading"
    );


    /*
     * Open direct URL first.
     *
     * This is intentionally triggered
     * directly from the user's click.
     */
    openDirectLink(url);


    /*
     * Wait 5 seconds before displaying
     * the iframe on the player page.
     */
    playerArea.innerHTML = `

        <div class="player-placeholder">

            <div class="play-circle">
                ⏳
            </div>


            <h3>
                Preparing player...
            </h3>


            <p>
                Please wait 5 seconds.
            </p>

        </div>

    `;


    let remaining = 5;


    const timer =
        setInterval(
            () => {

                remaining--;


                if (remaining > 0) {

                    playerArea.innerHTML = `

                        <div class="player-placeholder">

                            <div class="play-circle">
                                ⏳
                            </div>


                            <h3>
                                Preparing player...
                            </h3>


                            <p>
                                Player will appear in
                                ${remaining} second${remaining === 1 ? "" : "s"}.
                            </p>

                        </div>

                    `;

                    return;

                }


                clearInterval(timer);


                showMovieIframe(url);


            },
            1000
        );

}


/* ==========================
   SHOW MOVIE IFRAME
========================== */

function showMovieIframe(url) {

    if (!playerArea) {
        return;
    }


    /*
     * IMPORTANT:
     * The URL is inserted as an iframe src
     * using DOM properties rather than raw
     * HTML interpolation.
     */
    playerArea.innerHTML = "";


    const iframe =
        document.createElement(
            "iframe"
        );


    iframe.className =
        "player";


    iframe.allowFullscreen =
        true;


    iframe.allow =
        "fullscreen; autoplay; encrypted-media";


    iframe.referrerPolicy =
        "origin";


    iframe.title =
        state.item?.name ||
        "Movie Player";


    iframe.src =
        url;


    playerArea.appendChild(
        iframe
    );


    state.isLoading = false;


    setStatus(
        "Player Ready",
        "ready"
    );

}


/* ==========================
   SERIES EPISODES
========================== */

function renderEpisodes() {

    if (!episodeTabs || !state.item) {
        return;
    }


    episodeTabs.innerHTML = "";


    const episodes =
        Array.isArray(
            state.item.episodes
        )
            ? state.item.episodes
            : [];


    if (!episodes.length) {

        episodeTabs.innerHTML = `

            <p class="player-placeholder">
                No episodes available.
            </p>

        `;

        return;

    }


    episodes.forEach(
        (episode, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "episode-btn";


            button.textContent =
                `Episode ${
                    episode.epid ??
                    index + 1
                }`;


            button.addEventListener(
                "click",
                () => {

                    selectEpisode(
                        episode,
                        button
                    );

                }
            );


            episodeTabs.appendChild(
                button
            );

        }
    );

}


/* ==========================
   SELECT EPISODE
========================== */

function selectEpisode(
    episode,
    clickedButton
) {

    if (!episode || !episode.url) {

        showPlayerError(
            "This episode does not have a video URL."
        );

        return;

    }


    /*
     * Prevent duplicate clicks while
     * current episode is loading.
     */
    if (state.isLoading) {
        return;
    }


    state.selectedEpisode =
        episode;


    /*
     * Active episode
     */
    document
        .querySelectorAll(
            ".episode-btn"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    clickedButton?.classList.add(
        "active"
    );


    const episodeNumber =
        episode.epid ??
        "Episode";


    if (watchTitle) {

        watchTitle.textContent =
            `${state.item.name} - Episode ${episodeNumber}`;

    }


    /*
     * Start loading process.
     */
    playEpisode(
        episode.url,
        episodeNumber
    );

}


/* ==========================
   PLAY EPISODE
========================== */

function playEpisode(
    url,
    episodeNumber
) {

    state.isLoading = true;


    setStatus(
        "Opening...",
        "loading"
    );


    /*
     * Open direct MP4 URL first.
     */
    openDirectLink(url);


    /*
     * Show countdown.
     */
    let remaining = 5;


    renderEpisodeCountdown(
        remaining,
        episodeNumber
    );


    const timer =
        setInterval(
            () => {

                remaining--;


                if (remaining > 0) {

                    renderEpisodeCountdown(
                        remaining,
                        episodeNumber
                    );

                    return;

                }


                clearInterval(timer);


                showVideoPlayer(
                    url,
                    episodeNumber
                );

            },
            1000
        );

}


/* ==========================
   EPISODE COUNTDOWN
========================== */

function renderEpisodeCountdown(
    remaining,
    episodeNumber
) {

    if (!playerArea) {
        return;
    }


    playerArea.innerHTML = `

        <div class="player-placeholder">

            <div class="play-circle">
                ⏳
            </div>


            <h3>
                Loading Episode ${escapeHtml(
                    episodeNumber
                )}
            </h3>


            <p>
                Video player will appear in
                ${remaining} second${remaining === 1 ? "" : "s"}.
            </p>

        </div>

    `;

}


/* ==========================
   SHOW VIDEO PLAYER
========================== */

function showVideoPlayer(
    url,
    episodeNumber
) {

    if (!playerArea) {
        return;
    }


    playerArea.innerHTML = "";


    const videoContainer =
        document.createElement(
            "div"
        );


    videoContainer.className =
        "video-container";


    const video =
        document.createElement(
            "video"
        );


    video.controls =
        true;


    video.setAttribute(
        "controlsList",
        "nodownload"
    );


    video.preload =
        "metadata";


    video.playsInline =
        true;


    video.setAttribute(
        "playsinline",
        ""
    );


    const source =
        document.createElement(
            "source"
        );


    source.src =
        url;


    source.type =
        "video/mp4";


    video.appendChild(
        source
    );


    video.appendChild(
        document.createTextNode(
            "Your browser does not support HTML5 video."
        )
    );


    videoContainer.appendChild(
        video
    );


    playerArea.appendChild(
        videoContainer
    );


    state.isLoading = false;


    setStatus(
        `Episode ${episodeNumber} Ready`,
        "ready"
    );


    /*
     * If the remote server does not
     * support the video, display a
     * helpful message.
     */
    video.addEventListener(
        "error",
        () => {

            setStatus(
                "Video unavailable",
                "warning"
            );

        }
    );

}


/* ==========================
   SERIES PLACEHOLDER
========================== */

function showSeriesPlaceholder() {

    if (!playerArea) {
        return;
    }


    const name =
        state.item?.name ||
        "Series";


    playerArea.innerHTML = `

        <div class="player-placeholder">

            <div class="play-circle">
                ▶
            </div>


            <h3>
                ${escapeHtml(name)}
            </h3>


            <p>
                Select an episode above
                to start watching.
            </p>

        </div>

    `;


    if (watchTitle) {

        watchTitle.textContent =
            "Select an episode";

    }


    setStatus(
        "Ready",
        "ready"
    );

}


/* ==========================
   OPEN DIRECT LINK
========================== */

function openDirectLink(url) {

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
   STATUS
========================== */

function setStatus(
    text,
    type = ""
) {

    if (!watchStatus) {
        return;
    }


    watchStatus.textContent =
        text;


    watchStatus.classList.remove(
        "loading",
        "ready",
        "warning"
    );


    if (type) {

        watchStatus.classList.add(
            type
        );

    }

}


/* ==========================
   ERROR
========================== */

function showError(message) {

    if (details) {

        details.innerHTML = `

            <div class="load-error">

                <h3>
                    Something went wrong
                </h3>

                <p>
                    ${escapeHtml(message)}
                </p>


                <a href="index.html">
                    ← Back to Home
                </a>

            </div>

        `;

    }


    if (playerArea) {

        playerArea.innerHTML = "";

    }


    if (episodeTabs) {

        episodeTabs.innerHTML = "";

    }


    if (watchTitle) {

        watchTitle.textContent =
            "Unable to load";

    }


    setStatus(
        "Error",
        "warning"
    );

}


/* ==========================
   PLAYER ERROR
========================== */

function showPlayerError(message) {

    if (!playerArea) {
        return;
    }


    playerArea.innerHTML = `

        <div class="player-placeholder">

            <div class="play-circle">
                !
            </div>


            <h3>
                Unable to play
            </h3>


            <p>
                ${escapeHtml(message)}
            </p>

        </div>

    `;


    state.isLoading = false;


    setStatus(
        "Unavailable",
        "warning"
    );

}


/* ==========================
   NORMALIZE TYPE
========================== */

function normalizeType(type) {

    return String(
        type || ""
    )
        .trim()
        .toLowerCase();

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
   START
========================== */

loadPlayerData();