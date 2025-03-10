//
// //start of edit movie
//
// //loads movie elements - notice apiUrl = 1
// document.addEventListener("DOMContentLoaded", async function(){
//     const apiUrl = "http://localhost:8080/1";
//     const form = document.getElementById(("movieForm"));
//
//     async function fetchMovieData() {
//         try {
//             const response = await fetch(apiUrl);
//             if (!response.ok) throw new Error("Data can't be fetched yo");
//
//             const data = await response.json();
//             console.log("Tjekker lige API Response:", data);//tjekker lige om kaldet fungerer
//
//             document.getElementById("movieTitle")       .value = data.movieTitle || "";
//             document.getElementById("movieLength")      .value = data.movieLength || "";
//             document.getElementById("movieDescription") .value = data.movieDescription || "";
//             document.getElementById("ageRequirement")   .value = data.ageRequirement || "";
//             document.getElementById("moviePosterUrl")   .value = data.moviePosterUrl || "";
//         } catch (error){
//             console.error("Error fetching data", error);
//             alert("failed to DEEZ NUTS.");
//         }
//     }
// })
//
// //show movie js backend



const showInfoTable = document.querySelector('#showMoviesTable');
choice = "showMovieScreenings"

switch (choice) {

    case "showMovies":
        const listOfMovies = [];

        fetch('http://localhost:8080/movies')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Promise not OK');
                }
                return response.json();
            })
            .then(data => {
                const filteredMovies = data.filter(movie => movie.inRotation === true)
                listOfMovies.push(...filteredMovies);
                console.log(listOfMovies);
                populateTableOfMovies();
            })
            .catch(error => {
                console.error('Some error', error);
            });

    function populateTableOfMovies() {
        let rowTitles = document.createElement("tr");

        rowTitles.innerHTML = `
        <th>Film titel</th>
        <th>Spilletid</th>
        <th>Beskrivelse</th>
        <th>Aldersgrænse</th>
        <th>Plakat url</th>
        <th></th>`;
        showInfoTable.appendChild(rowTitles);

        listOfMovies.forEach(movie => {
            let row = document.createElement('tr');
            row.setAttribute("data-id", movie.movieId);
            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = "<i class=\"fa-solid fa-trash\"></i>";
            deleteButton.addEventListener('click', () => {
                deleteMovie(movie)
            });

            row.innerHTML = `
        <td>${movie.movieTitle}</td>
        <td>${movie.movieLength}</td>
        <td>${movie.movieDescription}</td>
        <td>${movie.ageRequirement}</td>
        <td>${movie.moviePosterUrl}</td>
        <td class="td__buttonTd"><button><i class="fa-solid fa-pen-to-square"></i></button></td>
    `;
            row.children[5].appendChild(deleteButton);
            showInfoTable.appendChild(row);
        })
    }
    break

    case "showMovieScreenings":
        const listOfMovieScreenings = [];

        fetch('http://localhost:8080/showMovieScreenings')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Promise not OK');
                }
                return response.json();
            })
            .then(data => {
                // const filteredMovieScreenings = data.filter(movieScreening => movieScreening.hasPlayed === true)
                // listOfMovieScreenings.push(...filteredMovieScreenings);
                listOfMovieScreenings.push(...data);

                console.log(listOfMovieScreenings);
                populateTableOfMovieScreenings();
            })
            .catch(error => {
                console.error('Some error', error);
            });

    function populateTableOfMovieScreenings() {
        let rowTitles = document.createElement("tr");

        rowTitles.innerHTML = `
        <th>Film titel</th>
        <th>Dato</th>
        <th>Tidspunkt</th>
        <th>Sal</th>
        <th></th>`; //Indeholder knapperne

        showInfoTable.appendChild(rowTitles);

        listOfMovieScreenings.forEach(movieScreening => {
            let row = document.createElement('tr');
            row.setAttribute("data-id", movieScreening.movieScreeningId);
            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = "<i class=\"fa-solid fa-trash\"></i>";
            deleteButton.addEventListener('click', () => {
                deleteMovieScreening(movieScreening)
            });

            row.innerHTML = `
        <td>${movieScreening.movie.movieTitle}</td>
        <td>${movieScreening.screeningDate}</td>
        <td>${formatScreeningTimeEnum(movieScreening.screeningTime) || "Unkown time"}</td>
        <td>${movieScreening.auditorium.auditoriumNumber}</td>
        <td><button><i class="fa-solid fa-pen-to-square"></i></button></td> 
    `;
            row.children[4].appendChild(deleteButton);
            showInfoTable.appendChild(row);
        })
    }
    break
}

// Sletter en film og sætter variablen inRotation til false i DB.
function deleteMovie(movie) {
    if (!confirm("Er du sikker på, at du vil slette filmen: " + movie.movieTitle)) {
        return;
    }
    fetch(`http://localhost:8080/${movie.movieId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"

            },
            body: JSON.stringify({movieId: movie.movieId})
        }
    ).then(response => {
        if (response.ok) {
            console.log("Movie with id " + movie.movieId + " set to inactive in database")

            const rowToDelete = document.querySelector(`tr[data-id="${movie.movieId}"]`);

            if (rowToDelete) {
                rowToDelete.remove();
            } else {
                console.error("Failed to update DOM with deleted movie")
            }
        }
    })
        .catch(error => {
            console.log(error);
        })
}

function deleteMovieScreening(movieScreening) {
    //Mangler funktionalitet til at slette.
}

function formatScreeningTimeEnum (screeningTime) {
    screeningTime.split();
    let formattetScreeningTime = "";

    formattetScreeningTime = screeningTime[5]+screeningTime[6]+"."+screeningTime[8]+screeningTime[9];

    return formattetScreeningTime
}

