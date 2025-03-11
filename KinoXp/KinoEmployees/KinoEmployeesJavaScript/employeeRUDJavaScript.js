//Default elementer
const moviesTableDiv = document.createElement("div");
moviesTableDiv.id = "showMoviesTableDiv";
moviesTableDiv.classList.add("showMoviesTableDiv");

const showInfoTable = document.createElement("table");
showInfoTable.id = "showMoviesTable";
showInfoTable.classList.add("show-movies-table");

moviesTableDiv.appendChild(showInfoTable);
document.body.appendChild(moviesTableDiv);

const listOfMovies = [];
const listOfMovieScreenings = [];

//Tjekker om det er movies eller screenings der er med som parametre
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

    if (type === "movies") {
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
                populateTableOfMovies();
            })
            .catch(error => {
                console.error('Some error', error);
            });
    } else if (type === "screenings") {

        fetch('http://localhost:8080/showMovieScreenings')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Promise not OK');
                }
                return response.json();
            })
            .then(data => {
                const filteredMovieScreenings = data.filter(movieScreening => movieScreening.hasPlayed === true)
                listOfMovieScreenings.push(...filteredMovieScreenings);

                populateTableOfMovieScreenings();
            })
            .catch(error => {
                console.error('Some error', error);
            });
    } else {
        document.body.innerHTML = "<h1>Der skete en fejl da siden skulle indlæses</h1>";
    }
});


function populateTableOfMovies() {
    showInfoTable.innerHTML = "";

    let rowTitles = document.createElement("tr");
    rowTitles.innerHTML = `
        <th>Film titel</th>
        <th>Spilletid</th>
        <th>Beskrivelse</th>
        <th>Aldersgrænse</th>
        <th>Plakat url</th>
        <th></th>`; // Knappen til sletning/redigering

    showInfoTable.appendChild(rowTitles);

    listOfMovies.forEach(movie => {
        let row = document.createElement('tr');
        row.setAttribute("data-id", movie.movieId);

        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = "<i class=\"fa-solid fa-trash\"></i>";
        deleteButton.addEventListener('click', () => deleteMovie(movie));

        //enabling the tdButton to handle onclick openEditModal
        let tdButtonTd = document.createElement("td");
        tdButtonTd.className = "td__buttonTd";

        let editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        editButton.addEventListener("click",function (){
            openEditModal(movie.movieId);
        })

        row.innerHTML = `
        <td>${movie.movieTitle}</td>
        <td>${movie.movieLength}</td>
        <td>${movie.movieDescription}</td>
        <td>${movie.ageRequirement}</td>
        <td>${movie.moviePosterUrl}</td>
        `;

        // Append knapperne til knap-cellen
        tdButtonTd.appendChild(editButton);
        tdButtonTd.appendChild(deleteButton);

        row.children[5].appendChild(deleteButton);
        showInfoTable.appendChild(row);
    });
}

//viser og populater filmvisningstabellen
function populateTableOfMovieScreenings() {

    showInfoTable.innerHTML = "";
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
    if (!confirm("Er du sikker på, at du vil slette filvisningen: " + movieScreening.movieTitle)) {
        return;
    }
    fetch(`http://localhost:8080/deactivateMovieScreening/${movieScreening.movieScreeningId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({movieScreeningId: movieScreening.movieScreeningId})
        }
    ).then(response => {
        if (response.ok) {
            console.log("Movie screening with id " + movieScreening.movieScreeningId + " set to inactive in database")

            const rowToDelete = document.querySelector(`tr[data-id="${movieScreening.movieScreeningId}"]`);

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

//Formatter - TIME_12_00 til 12:00
function formatScreeningTimeEnum(screeningTime) {
    screeningTime.split();
    let formattetScreeningTime = "";

    formattetScreeningTime = screeningTime[5] + screeningTime[6] + "." + screeningTime[8] + screeningTime[9];

    return formattetScreeningTime
}

// Opens a modal that populates the data from the selected movie and then stores it
function openEditModal(movieId) {
    console.log("Vi er inde i metoden")
    const rows = document.getElementById("showMoviesTable")
    rows.style.display = "none";
    fetch(`http://localhost:8080/${movieId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            //alt logik her fra dom manipulationen
            let editMovieModal = document.createElement("div");
            editMovieModal.id = "employeeCreateEditMovie"

            //Label og input til film titel:
            let movieTitleLabel = document.createElement("label");
            movieTitleLabel.innerText = "Film Titel";
            let movieTitleInput = document.createElement("input");
            movieTitleInput.type = "text";
            movieTitleInput.id = "movieTitle";
            movieTitleInput.name = "movieTitle";

            //Label og input til film længde:
            let movieLengthLabel = document.createElement("label")
            movieLengthLabel.innerText = "Film længde"
            let movieLengthInput = document.createElement("input")
            movieLengthInput.type = "text";
            movieLengthInput.id = "movieLength"
            movieLengthInput.name = "movieLength"

            //Label og input til film beskrivelse:
            let movieDescriptionLabel = document.createElement("label");
            movieDescriptionLabel.innerText = "Beskrivelse"
            let movieDescriptionInput = document.createElement("input")
            movieDescriptionInput.type = "text";
            movieDescriptionInput.id = "movieDescription";
            movieDescriptionInput.name = "movieDescription";

            //label, select og option med loop: til alderskrav
            let ageRequirementLabel = document.createElement("label")
            ageRequirementLabel.innerText = "Vælg aldersgrænse"
            let ageRequirementSelect = document.createElement("select")
            ageRequirementSelect.id = "ageRequirement";
            ageRequirementSelect.name = "ageRequirement";
            let ageRequirementDropDown = document.createElement("option")
            ageRequirementDropDown.hidden = true;
            ageRequirementDropDown.innerText = "Vælg aldersgrænse"
            ageRequirementSelect.appendChild(ageRequirementDropDown)
            var ages = ["12", "16", "18", "0"]
            for (var i = 0; i < ages.length; i++) {
                var age = ages[i];
                var option = document.createElement("option");
                option.value = age;
                option.innerText = age;
                ageRequirementSelect.appendChild(option)
            }

            // label og input til plakat url
            let moviePosterLabel = document.createElement("label")
            moviePosterLabel.innerText = "Plakat URL/JPEG/PNG"
            let moviePosterInput = document.createElement("input")
            moviePosterInput.type = "text";
            moviePosterInput.id = "moviePosterUrl";
            moviePosterInput.name = "moviePosterUrl";

            //så skal vi vel fylde vores nye layout ud med data fra filmen man har valgt.
            movieTitleInput.value = data.movieTitle || "";
            movieLengthInput.value = data.movieLength || "";
            movieDescriptionInput.value = data.movieDescription || "";
            ageRequirementSelect.value = data.ageRequirement || "";
            moviePosterInput.value = data.moviePosterUrl || "";

            //så skal vi skulle kunne gemme det.
            let saveEditedFiles = document.createElement("button")
            saveEditedFiles.type = "button";
            saveEditedFiles.id = "saveEditedFiles";
            saveEditedFiles.name = "saveEditedFiles";

            editMovieModal.appendChild(movieTitleLabel);
            editMovieModal.appendChild(movieTitleInput);
            //tilføjer et linjeskift for testens skyld. Så kan vi altid kigge i styles senere:
            editMovieModal.appendChild(document.createElement("br"));

            editMovieModal.appendChild(movieLengthLabel);
            editMovieModal.appendChild(movieLengthInput)
            editMovieModal.appendChild(document.createElement("br"));

            editMovieModal.appendChild(movieDescriptionLabel);
            editMovieModal.appendChild(movieDescriptionInput);
            editMovieModal.appendChild(document.createElement("br"));

            editMovieModal.appendChild(ageRequirementLabel);
            editMovieModal.appendChild(ageRequirementSelect);
            editMovieModal.appendChild(document.createElement("br"));

            editMovieModal.appendChild(moviePosterLabel);
            editMovieModal.appendChild(moviePosterInput);
            editMovieModal.appendChild(document.createElement("br"));

            editMovieModal.appendChild(saveEditedFiles);

            document.body.appendChild(editMovieModal);
        })
        .catch(error => {
            console.error("Error fetching movie data:", error);
        });
}
