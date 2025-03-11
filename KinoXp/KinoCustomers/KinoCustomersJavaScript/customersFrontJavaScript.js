//--------------------------------------------------------------------------------------------
const commonWidth = '100%';
const commonMaxWidth = '1260px';

// Apply styles to movieContainer
const movieContainer = document.getElementById('movie-container');


// Create headerDiv
const headerDiv = document.createElement('div');
headerDiv.textContent = 'BILLETTER TIL AKTUELLE FILM';
headerDiv.classList.add('header-div');

// Create dateDiv
const dateDiv = document.createElement('div');
const today = new Date();
const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

dateDiv.textContent = today.toLocaleDateString('da-DK', options);
dateDiv.className = 'date-div';

const dateInput = document.createElement('input');
dateInput.type = 'date';

// Set its initial value to today (ISO format)
const todayISO = today.toISOString().split('T')[0];
dateInput.value = todayISO;
dateInput.className = 'date-input';

// Create a wrapper inside the dateDiv for both text and input (optional but cleaner)
const dateWrapper = document.createElement('div');
dateWrapper.classList.add('date-wrapper');

// Create a label for displaying the formatted date
const dateLabel = document.createElement('div');
dateLabel.textContent = today.toLocaleDateString('da-DK', options);
dateWrapper.classList.add = ('date-label');

// Clear dateDiv's content and append the wrapper
dateDiv.textContent = '';  // Remove previous textContent
dateWrapper.appendChild(dateLabel);  // Add the date text
dateWrapper.appendChild(dateInput);  // Add the date input
dateDiv.appendChild(dateWrapper);    // Add everything to the main dateDiv

// Insert the divs into the body, above the movie container
document.body.insertBefore(headerDiv, movieContainer);
document.body.insertBefore(dateDiv, movieContainer);

// When the user selects a different date
dateInput.addEventListener('change', () => {
    const selectedDate = dateInput.value;

    // Update the label showing the selected date in da-DK format
    const selectedDateObj = new Date(selectedDate);
    dateLabel.textContent = selectedDateObj.toLocaleDateString('da-DK', options);

    // Populate screenings for the selected date
    populateMoviesScreenings(selectedDate);
});

function groupByTitleAndDate(screenings) {
    const moviesMap = new Map();

    screenings.forEach(screening => {
        const movieId = screening.movie.movieId;
        const screeningDate = screening.screeningDate; // Assuming format "YYYY-MM-DD"

        if (!moviesMap.has(movieId)) {
            moviesMap.set(movieId, {
                movie: screening.movie,
                dates: new Map()
            });
        }

        const movieGroup = moviesMap.get(movieId);

        if (!movieGroup.dates.has(screeningDate)) {
            movieGroup.dates.set(screeningDate, []);
        }

        movieGroup.dates.get(screeningDate).push(screening);
    });

    return moviesMap;
}

// Function to populate movies with their screenings
function populateMoviesScreenings(selectedDate) {
    let movieScreenings = [];

    fetch('http://localhost:8080/showMovieScreenings')
        .then(response => {
            if (!response.ok) {
                throw new Error('Promise not OK');
            }
            return response.json();
        })
        .then(data => {
            movieScreenings = data.filter(movieScreening => movieScreening.hasPlayed === false);
            console.log(movieScreenings);

            const groupedMovies = groupByTitleAndDate(movieScreenings);

            // Clear the container before adding new elements
            movieContainer.innerHTML = '';

            // Loop through each movie
            groupedMovies.forEach(({ movie, dates }) => {

                // Only proceed if there are screenings for the selected date
                if (!dates.has(selectedDate)) {
                    return; // Skip this movie if no screenings on the selected date
                }

                const screenings = dates.get(selectedDate);

                // Create the movie div
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie-div');

                // Create the movie poster
                const poster = document.createElement('img');
                poster.src = movie.moviePosterUrl;

                // Create the movie title
                const title = document.createElement('h3');
                title.textContent = movie.movieTitle;

                // Create the screening times container
                const screeningTimesContainer = document.createElement('div');
                screeningTimesContainer.classList.add('screening-times-container');

                // Loop through each screening for this movie on the selected date
                screenings.forEach(screening => {
                    const timeButton = document.createElement('button');
                    const formattedTime = formatScreeningTimeEnum(screening.screeningTime);

                    timeButton.textContent = `${formattedTime}`;

                    timeButton.onclick = function () {
                        window.location.href = `/booking-page?screeningId=${screening.movieScreeningId}`;
                    };

                    screeningTimesContainer.appendChild(timeButton);
                });

                // Append elements to movieDiv
                movieDiv.appendChild(poster);
                movieDiv.appendChild(title);
                movieDiv.appendChild(screeningTimesContainer);

                // Append movieDiv to the main container
                movieContainer.appendChild(movieDiv);
            });
        });
}

function formatScreeningTimeEnum(screeningTime) {
    screeningTime.split();
    let formattetScreeningTime = "";

    formattetScreeningTime = screeningTime[5] + screeningTime[6] + "." + screeningTime[8] + screeningTime[9];

    return formattetScreeningTime
}

// Populate movies with screening times
const todayDate = new Date().toISOString().split('T')[0];
populateMoviesScreenings(todayDate);
