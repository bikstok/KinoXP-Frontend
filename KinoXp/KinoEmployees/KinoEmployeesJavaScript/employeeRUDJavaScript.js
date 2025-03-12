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
                const filteredMovieScreenings = data.filter(movieScreening => movieScreening.hasPlayed === false)
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
        editButton.addEventListener("click", function () {
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

        // Append knap-cellen til rækken
        row.appendChild(tdButtonTd);

        // Append rækken til tabellen
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
        deleteButton.className = "td__buttonTd";
        deleteButton.innerHTML = "<i class=\"fa-solid fa-trash\"></i>";
        deleteButton.addEventListener('click', () => {
            deleteMovieScreening(movieScreening)
        });

        let tdButtonTd = document.createElement("td");
        tdButtonTd.className = "td__buttonTd";

        let editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        editButton.className = "td__buttonTd";
        editButton.addEventListener("click", function () {
            updateMovieScreeningForm(movieScreening);
        })

        row.innerHTML = `
        <td>${movieScreening.movie.movieTitle}</td>
        <td>${movieScreening.screeningDate}</td>
        <td>${formatScreeningTimeEnum(movieScreening.screeningTime) || "Unkown time"}</td>
        <td>${movieScreening.auditorium.auditoriumNumber}</td>
    `;
        // Append knapperne til knap-cellen
        tdButtonTd.appendChild(editButton);
        tdButtonTd.appendChild(deleteButton);
        showInfoTable.appendChild(row);

        // Append knap-cellen til rækken
        row.appendChild(tdButtonTd);
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
            const currentMovie = data;
            //alt logik her fra dom manipulationen
            let editMovieModal = document.createElement("div");
            editMovieModal.id = "employeeCreateEditMovie"
            editMovieModal.className = "employeeCreateEditMovies"

            // close button
            const closeButton = document.createElement("button");
            closeButton.innerHTML = "X"
            closeButton.classList.add("closeButton");
            closeButton.addEventListener("click", (e) => {
                editMovieModal.remove();
                rows.style.display = "table";
            })

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

            var ages = [10, 13, 18, 0]
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

            saveEditedFiles.innerHTML = "Gem ændringer";
            saveEditedFiles.type = "button";
            saveEditedFiles.id = "saveEditedFiles";
            saveEditedFiles.name = "saveEditedFiles";

            saveEditedFiles.addEventListener("click", () => {
                const updatedMovie = {
                    movieId: currentMovie.movieId,
                    movieTitle: movieTitleInput.value,
                    movieLength: movieLengthInput.value,
                    movieDescription: movieDescriptionInput.value,
                    ageRequirement: ageRequirementSelect.value,
                    moviePosterUrl: moviePosterInput.value,
                    inRotation: currentMovie.inRotation,
                }


                fetch("http://localhost:8080/updateMovie", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedMovie)
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Movie updated:", data);
                        // Her kan du evt. opdatere DOM'en eller lukke modalen
                    })
                    .catch(error => {
                        console.error("Error updating movie:", error);
                    });

                console.log(updatedMovie);

                editMovieModal.remove();
                rows.style.display = "table";
            });

            editMovieModal.appendChild(closeButton);

            editMovieModal.appendChild(movieTitleLabel);
            editMovieModal.appendChild(movieTitleInput);
            //tilføjer et linjeskift for testens skyld. Så kan vi altid kigge i styles senere:


            editMovieModal.appendChild(movieLengthLabel);
            editMovieModal.appendChild(movieLengthInput)


            editMovieModal.appendChild(movieDescriptionLabel);
            editMovieModal.appendChild(movieDescriptionInput);


            editMovieModal.appendChild(ageRequirementLabel);
            editMovieModal.appendChild(ageRequirementSelect);


            editMovieModal.appendChild(moviePosterLabel);
            editMovieModal.appendChild(moviePosterInput);

            editMovieModal.appendChild(saveEditedFiles);

            document.body.appendChild(editMovieModal);
        })
        .catch(error => {
            console.error("Error fetching movie data:", error);
        });
}

//Tilføjelse af modalet til DOM'en omkring redigering af filmvisninger
async function updateMovieScreeningForm(movieScreening) {

    const listOfMoviesToEdit = await returnListOfMovies();
    const listOfScreeningTimeSlots = await returnListOfScreeningTimeSlots();

    const showMoviesTableDiv = document.getElementById("showMoviesTableDiv");
    showMoviesTableDiv.style.display = "none";

    const mainDiv = document.createElement("div");
    mainDiv.className = ".main";

    const creatMovieScreeningForm = document.createElement('form');
    creatMovieScreeningForm.id = "movieForm";
    creatMovieScreeningForm.classList.add('employeeCreateEditMovies');

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "X"
    closeButton.classList.add("closeButton");
    closeButton.addEventListener("click", (e) => {
        creatMovieScreeningForm.remove();
        showMoviesTableDiv.style.display = "flex";
    })
    const movieTitleLabel = document.createElement('label');
    movieTitleLabel.textContent = 'Film titel';
    const movieTitle = document.createElement("select")

    listOfMoviesToEdit.forEach(movie => {
        console.log(movie);
        let option = document.createElement("option");
        option.innerText = movie.movieTitle;
        option.setAttribute("movieId", movie.movieId);
        movieTitle.appendChild(option);
    })

    const auditoriumLabel = document.createElement("label");
    auditoriumLabel.textContent = 'Film sal';
    const auditorium = document.createElement("select");
    const optionAuditorium1 = document.createElement("option");
    optionAuditorium1.innerText = "Sal 1";
    optionAuditorium1.value = 1;
    optionAuditorium1.setAttribute("auditoriumId", 1);
    const optionAuditorium2 = document.createElement("option");
    optionAuditorium2.innerText = "Sal 2";
    optionAuditorium2.value = 2;
    optionAuditorium2.setAttribute("auditoriumId", 2);
    auditorium.appendChild(optionAuditorium1);
    auditorium.appendChild(optionAuditorium2);

    const selectedAuditoriumNumber = movieScreening.auditorium.auditoriumNumber;
    if (selectedAuditoriumNumber === 1) {
        optionAuditorium1.selected = true;
    } else if (selectedAuditoriumNumber === 2) {
        optionAuditorium2.selected = true;
    }

    const screeningTimeLabel = document.createElement("label");
    screeningTimeLabel.textContent = 'Tidspunkt';
    const screeningTime = document.createElement("select");

    listOfScreeningTimeSlots.forEach(screeningTimeSlot => {
        let option = document.createElement("option");
        option.innerText = formatScreeningTimeEnum(screeningTimeSlot);
        option.value = screeningTimeSlot;
        screeningTime.appendChild(option);
    })

    const screeningDateLabel = document.createElement("label");
    screeningDateLabel.textContent = 'Dato';
    const screeningDate = document.createElement("input");
    screeningDate.type = "date";
    screeningDate.value = movieScreening.screeningDate;

    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.id = 'submitButton';
    submitButton.textContent = 'Gem ændringer';

    submitButton.addEventListener("click", () => {
        let movieScreeningJson = {
            movieScreeningId: movieScreening.movieScreeningId,
            movie: fetchMovieById(movieTitle.getAttribute("movieId")),
            screeningTime: screeningTime.value,
            screeningDate: screeningDate.value,
            hasPlayed: movieScreening.hasPlayed,
            auditorium: fetchAuditoriumById(auditorium.getAttribute("auditoriumId"))
        }

        fetch(`http://localhost:8080/updateMovieScreening`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(movieScreeningJson)
        })
    })


    creatMovieScreeningForm.appendChild(closeButton)
    creatMovieScreeningForm.appendChild(movieTitleLabel);
    creatMovieScreeningForm.appendChild(movieTitle);
    creatMovieScreeningForm.appendChild(auditoriumLabel);
    creatMovieScreeningForm.appendChild(auditorium);
    creatMovieScreeningForm.appendChild(screeningTimeLabel);
    creatMovieScreeningForm.appendChild(screeningTime);
    creatMovieScreeningForm.appendChild(screeningDateLabel);
    creatMovieScreeningForm.appendChild(screeningDate);


    creatMovieScreeningForm.appendChild(submitButton);


    mainDiv.appendChild(creatMovieScreeningForm)
    document.body.appendChild(mainDiv);
}

async function returnListOfMovies() {

    const response = await fetch("http://localhost:8080/movies");
    if (!response.ok) {
        throw new Error("Could not fetch list of movies");
    }
    return await response.json();
}

async function returnListOfScreeningTimeSlots() {

    const response = await fetch("http://localhost:8080/getScreeningTimeSlots");
    if (!response.ok) {
        throw new Error("Could not fetch list of Screening time slots");
    }
    return await response.json();
}

async function fetchMovieById (movieId) {
    const response = await fetch(`http://localhost:8080/${movieId}`);
        if(!response.ok)    {
            throw new Error("Could not fetch movie");
        }
    return await response.json();
}

async function fetchAuditoriumById (auditoriumId) {
    console.log(auditoriumId)
    const response = await fetch(`http://localhost:8080/getAuditoriumById/${auditoriumId}`);
    if(!response.ok)    {
        throw new Error("Could not fetch movie");
    }
    return await response.json();
}
