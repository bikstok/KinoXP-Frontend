
//--------------------------------------------------------------------------------------------
const commonWidth = '100%';
const commonMaxWidth = '1260px';

// Apply styles to movieContainer
const movieContainer = document.getElementById('movie-container');


// Create headerDiv
const headerDiv = document.createElement('div');
headerDiv.textContent = 'BILLETTER TIL AKTUELLE FILM';
headerDiv.style.width = commonWidth;
headerDiv.style.maxWidth = commonMaxWidth;
headerDiv.style.margin = '0 auto';
headerDiv.style.padding = '20px';
headerDiv.style.backgroundColor = '#ad4c4c';
headerDiv.style.color = '#e8e7df';
headerDiv.style.textAlign = 'center';
headerDiv.style.fontFamily = 'Montserrat';
headerDiv.style.fontSize = '32px';
headerDiv.style.boxSizing = 'border-box';

// Create dateDiv
const dateDiv = document.createElement('div');
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateDiv.textContent = today.toLocaleDateString('da-DK', options);
dateDiv.style.width = commonWidth;
dateDiv.style.maxWidth = commonMaxWidth;
dateDiv.style.margin = '0 auto';
dateDiv.style.padding = '10px';
dateDiv.style.backgroundColor = '#e8e7df';
dateDiv.style.color = '#333';
dateDiv.style.textAlign = 'center';
dateDiv.style.fontFamily = 'Montserrat';
dateDiv.style.fontSize = '18px';
dateDiv.style.boxSizing = 'border-box';

// Insert the divs into the body, above the movie container
document.body.insertBefore(headerDiv, movieContainer);
document.body.insertBefore(dateDiv, movieContainer);


// Function to populate movies with their screenings
function populateMoviesScreenings(movieData) {
    movieData.forEach(movieScreening => {
        // Create the movie div
        const movieDiv = document.createElement('div');
        movieDiv.style.background = '#c58c8c';
        movieDiv.style.border = '1px solid #ccc';
        movieDiv.style.padding = '0px';
        movieDiv.style.height = 'auto'; // Adjust height automatically
        movieDiv.style.width = '250px';
        movieDiv.style.borderRadius = '8px';
        movieDiv.style.marginBottom = '1px';

        // Create the movie poster
        const poster = document.createElement('img');
        poster.src = movieScreening.movie.moviePosterUrl; // Dynamic URL
        poster.alt = 'https://poster.ebillet.dk/DieHard4k.hd.jpg';
        poster.style.width = '100%';
        poster.style.height = 'auto';

        // Create the movie title
        const title = document.createElement('h3');
        title.textContent = movieScreening.movie.movieTitle;
        title.style.textAlign = 'center';


        // Create the auditorium info
        const auditoriumInfo = document.createElement('p');
        auditoriumInfo.textContent = `Auditorium: ${movieScreening.auditorium.name} | Capacity: ${movieScreening.auditorium.seatingCapacity}`;
        auditoriumInfo.style.fontSize = '12px';
        auditoriumInfo.style.color = '#555';

        // Create the screening times container
        const screeningTimesContainer = document.createElement('div');
        screeningTimesContainer.style.marginTop = '16px';
        screeningTimesContainer.style.background = '#c58c8c'; // Background for screening times
        screeningTimesContainer.style.padding = '8px';
        screeningTimesContainer.style.color = '#fff'; // White text for better visibility

        // Create a clickable time button
        const timeButton = document.createElement('button');
        timeButton.textContent = `Kl: ${movieScreening.screeningTime}`;
        timeButton.style.padding = '6px 12px';
        timeButton.style.marginBottom = '6px';
        timeButton.style.backgroundColor = '#e8e7df';
        timeButton.style.color = '#333';
        timeButton.style.border = 'none';
        timeButton.style.borderRadius = '50px'; // No rounded corners
        timeButton.style.cursor = 'pointer';

        // Link to booking page with movieScreeningId as a query parameter
        timeButton.onclick = function() {
            window.location.href = `/booking-page?screeningId=${movieScreening.movieScreeningId}`;
        };

        // Append the time button to the screening times container
        screeningTimesContainer.appendChild(timeButton);

        // Append elements to the movieDiv
        movieDiv.appendChild(poster);
        movieDiv.appendChild(title);
        movieDiv.appendChild(screeningTimesContainer);

        // Append the movieDiv to the container in the HTML
        movieContainer.appendChild(movieDiv);
    });
}

// Example data for multiple movies with screening times
const movieData = [
    {
        "movieScreeningId": 1,
        "movie": {
            "movieId": 1,
            "movieTitle": "Mickey 17",
            "movieLength": 120,
            "movieDescription": "A thrilling adventure of a hero saving the world.",
            "ageRequirement": 13,
            "moviePosterUrl": "https://poster.ebillet.dk/mickey-17-2025.hd.jpg",
            "inRotation": true
        },
        "screeningTime": "18:30",
        "screeningDate": "2025-03-10",
        "hasPlayed": false,
        "auditorium": {
            "auditoriumId": 1,
            "auditoriumNumber": 1
        }
    },
    {
        "movieScreeningId": 2,
        "movie": {
            "movieId": 2,
            "movieTitle": "Paddington",
            "movieLength": 90,
            "movieDescription": "An action-packed thriller.",
            "ageRequirement": 16,
            "moviePosterUrl": "https://poster.ebillet.dk/PigenMedNaalen-2025citat.hd.jpg",
            "inRotation": true
        },
        "screeningTime": "20:00",
        "screeningDate": "2025-03-11",
        "hasPlayed": false,
        "auditorium": {
            "auditoriumId": 6,
            "name": "Auditorium B",
            "seatingCapacity": 200
        }
    },
    {
        "movieScreeningId": 2,
        "movie": {
            "movieId": 2,
            "movieTitle": "Paddington",
            "movieLength": 90,
            "movieDescription": "An action-packed thriller.",
            "ageRequirement": 16,
            "moviePosterUrl": "https://poster.ebillet.dk/PigenMedNaalen-2025citat.hd.jpg",
            "inRotation": true
        },
        "screeningTime": "20:00",
        "screeningDate": "2025-03-11",
        "hasPlayed": false,
        "auditorium": {
            "auditoriumId": 6,
            "name": "Auditorium B",
            "seatingCapacity": 200
        }
    },
    {
        "movieScreeningId": 2,
        "movie": {
            "movieId": 2,
            "movieTitle": "Paddington",
            "movieLength": 90,
            "movieDescription": "An action-packed thriller.",
            "ageRequirement": 16,
            "moviePosterUrl": "https://poster.ebillet.dk/PigenMedNaalen-2025citat.hd.jpg",
            "inRotation": true
        },
        "screeningTime": "20:00",
        "screeningDate": "2025-03-11",
        "hasPlayed": false,
        "auditorium": {
            "auditoriumId": 6,
            "name": "Auditorium B",
            "seatingCapacity": 200
        }
    },
    {
        "movieScreeningId": 2,
        "movie": {
            "movieId": 2,
            "movieTitle": "Paddington",
            "movieLength": 90,
            "movieDescription": "An action-packed thriller.",
            "ageRequirement": 16,
            "moviePosterUrl": "https://poster.ebillet.dk/PigenMedNaalen-2025citat.hd.jpg",
            "inRotation": true
        },
        "screeningTime": "20:00",
        "screeningDate": "2025-03-11",
        "hasPlayed": false,
        "auditorium": {
            "auditoriumId": 6,
            "name": "Auditorium B",
            "seatingCapacity": 200
        }
    },
    {
        "movieScreeningId": 2,
        "movie": {
            "movieId": 2,
            "movieTitle": "Paddington",
            "movieLength": 90,
            "movieDescription": "An action-packed thriller.",
            "ageRequirement": 16,
            "moviePosterUrl": "https://poster.ebillet.dk/PigenMedNaalen-2025citat.hd.jpg",
            "inRotation": true
        },
        "screeningTime": "20:00",
        "screeningDate": "2025-03-11",
        "hasPlayed": false,
        "auditorium": {
            "auditoriumId": 6,
            "name": "Auditorium B",
            "seatingCapacity": 200
        }
    },
    {
        "movieScreeningId": 2,
        "movie": {
            "movieId": 2,
            "movieTitle": "Paddington",
            "movieLength": 90,
            "movieDescription": "An action-packed thriller.",
            "ageRequirement": 16,
            "moviePosterUrl": "https://poster.ebillet.dk/PigenMedNaalen-2025citat.hd.jpg",
            "inRotation": true
        },
        "screeningTime": "20:00",
        "screeningDate": "2025-03-11",
        "hasPlayed": false,
        "auditorium": {
            "auditoriumId": 6,
            "name": "Auditorium B",
            "seatingCapacity": 200
        }
    },
    {
        "movieScreeningId": 2,
        "movie": {
            "movieId": 2,
            "movieTitle": "Paddington",
            "movieLength": 90,
            "movieDescription": "An action-packed thriller.",
            "ageRequirement": 16,
            "moviePosterUrl": "https://poster.ebillet.dk/PigenMedNaalen-2025citat.hd.jpg",
            "inRotation": true
        },
        "screeningTime": "20:00",
        "screeningDate": "2025-03-11",
        "hasPlayed": false,
        "auditorium": {
            "auditoriumId": 6,
            "name": "Auditorium B",
            "seatingCapacity": 200
        }
    },
    {
        "movieScreeningId": 2,
        "movie": {
            "movieId": 2,
            "movieTitle": "Paddington",
            "movieLength": 90,
            "movieDescription": "An action-packed thriller.",
            "ageRequirement": 16,
            "moviePosterUrl": "https://poster.ebillet.dk/PigenMedNaalen-2025citat.hd.jpg",
            "inRotation": true
        },
        "screeningTime": "20:00",
        "screeningDate": "2025-03-11",
        "hasPlayed": false,
        "auditorium": {
            "auditoriumId": 6,
            "name": "Auditorium B",
            "seatingCapacity": 200
        }
    },
    {
        "movieScreeningId": 2,
        "movie": {
            "movieId": 2,
            "movieTitle": "Paddington",
            "movieLength": 90,
            "movieDescription": "An action-packed thriller.",
            "ageRequirement": 16,
            "moviePosterUrl": "https://poster.ebillet.dk/PigenMedNaalen-2025citat.hd.jpg",
            "inRotation": true
        },
        "screeningTime": "20:00",
        "screeningDate": "2025-03-11",
        "hasPlayed": false,
        "auditorium": {
            "auditoriumId": 6,
            "name": "Auditorium B",
            "seatingCapacity": 200
        }
    },
    {
        "movieScreeningId": 2,
        "movie": {
            "movieId": 2,
            "movieTitle": "Paddington",
            "movieLength": 90,
            "movieDescription": "An action-packed thriller.",
            "ageRequirement": 16,
            "moviePosterUrl": "https://poster.ebillet.dk/PigenMedNaalen-2025citat.hd.jpg",
            "inRotation": true
        },
        "screeningTime": "20:00",
        "screeningDate": "2025-03-11",
        "hasPlayed": false,
        "auditorium": {
            "auditoriumId": 6,
            "name": "Auditorium B",
            "seatingCapacity": 200
        }
    }
];

// Populate movies with screening times
populateMoviesScreenings(movieData);
