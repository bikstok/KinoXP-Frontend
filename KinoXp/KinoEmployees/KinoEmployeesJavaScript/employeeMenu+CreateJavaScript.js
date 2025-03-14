//---------------------------AddEventListener som viser default items---------------------------
document.addEventListener("DOMContentLoaded", () => {
    showMenu() //Hvad der vises som default
});

//---------------------------function showMenu---------------------------
function showMenu() {
    const mainDiv = document.querySelector('.main');

    //burgermenu'en
    const burgerMenu = document.createElement('button');
    burgerMenu.classList.add("burger-menu");

    const burgerMenuIcon = document.createElement('i');
    burgerMenuIcon.classList.add("material-icons")
    burgerMenuIcon.innerText = "menu";

    burgerMenu.appendChild(burgerMenuIcon)
    mainDiv.appendChild(burgerMenu)

    burgerMenu.addEventListener('click', (e) => {

        let existingModal = document.querySelector('.pop-up');
        if (existingModal) {

            existingModal.remove();

            burgerMenuIcon.innerText = "menu";
        } else {

            burgerMenuIcon.innerText = "close";

            const popUpModal = document.createElement("div");
            popUpModal.classList.add("pop-up");

            const logOutButton = document.createElement("button");
            logOutButton.classList.add("logOutButton");
            logOutButton.innerText = "Logout";

            popUpModal.append(logOutButton);

            mainDiv.append(popUpModal);
        }
    });
    //Container for menu'en
    const menuContainer = document.createElement("div");
    menuContainer.id = "menuContainer";

    //Opret ny film
    const createMovie = document.createElement("button");
    createMovie.id = "createMovie";
    createMovie.classList.add("menuButton")
    createMovie.innerText = "Opret Ny Film"
    createMovie.addEventListener("click", (e) => {
        createMovieForm()
    })

    //Opret ny filmvisning
    const createMovieScreening = document.createElement("button");
    createMovieScreening.id = "createMovieScreening";
    createMovieScreening.classList.add("menuButton")
    createMovieScreening.innerText = "Opret Ny Filmvisning"
    createMovieScreening.addEventListener("click", (e) => {
        createMovieScreeningForm()
    })

    //Se filmoversigt
    const showMovies = document.createElement('a');
    showMovies.id = "showMovies";
    showMovies.classList.add("menuButton")
    showMovies.innerText = "Se Filmoversigt";
    showMovies.href = "employeeRUDPage.html?type=movies";

    //Se filmvisnings-oversigt
    const showMoviesScreening = document.createElement("a");
    showMoviesScreening.id = "showMovieScreening";
    showMoviesScreening.classList.add("menuButton")
    showMoviesScreening.innerText = "Se Filmvisningsoversigt";
    showMoviesScreening.href = "employeeRUDPage.html?type=screenings";

    //Se Bookingsoversigt
    const showBookings = document.createElement('a');
    showBookings.id = "showBookings";
    showBookings.classList.add("menuButton")
    showBookings.innerText = "Se Bookingsoversigt"

    //appending til menuContainer
    menuContainer.appendChild(createMovie);
    menuContainer.appendChild(createMovieScreening);
    menuContainer.appendChild(showMovies);
    menuContainer.appendChild(showMoviesScreening);
    menuContainer.appendChild(showBookings);

    mainDiv.appendChild(menuContainer);
};

//---------------------------function CreateMovieForm---------------------------
function createMovieForm() {
    const menuContainer = document.getElementById("menuContainer");
    menuContainer.style.display = "none";
    const mainDiv = document.querySelector('.main');

    //oprettelse af 'form'
    const form = document.createElement('form');
    form.id = "movieForm";
    form.classList.add('employeeCreateEditMovies');

    //Lukke knap
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "X"
    closeButton.classList.add("closeButton");
    closeButton.addEventListener("click", (e) => {
        form.remove();
        menuContainer.style.display = "flex";
    })
    //label & input movieTitle
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Film titel';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'movieTitle';
    titleInput.name = 'movieTitle';

    //label & input Film længde
    const lengthLabel = document.createElement('label');
    lengthLabel.textContent = 'Film længde';
    const lengthInput = document.createElement('input');
    lengthInput.type = 'number';
    lengthInput.id = 'movieLength';
    lengthInput.name = 'movieLength';

    //label & input movieDescription
    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = 'Beskrivelse';
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.id = 'movieDescription';
    descriptionInput.name = 'movieDescription';

    //label & input ageRequirement
    const ageLabel = document.createElement('label');
    ageLabel.textContent = 'Aldersgrænse';
    const ageSelect = document.createElement('select');
    ageSelect.id = 'ageRequirement';
    ageSelect.name = 'ageRequirement';

    //label & input age
    const ageOptions = ['Vælg aldersgrænse', '12', '16', '18', '0'];
    ageOptions.forEach(age => {
        const option = document.createElement('option');
        option.value = age === 'Vælg aldersgrænse' ? '' : age;
        option.textContent = age;
        ageSelect.appendChild(option);
    });

    //label & input moviePosterUrl
    const posterLabel = document.createElement('label');
    posterLabel.textContent = 'Plakat URL/JPEG/PNG';
    const posterInput = document.createElement('input');
    posterInput.type = 'text';
    posterInput.id = 'moviePosterUrl';
    posterInput.name = 'moviePosterUrl';

    //label & input Opret film
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.id = 'submitButton';
    submitButton.textContent = 'Opret Film';

    //appending to form
    form.appendChild(closeButton)
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(lengthLabel);
    form.appendChild(lengthInput);
    form.appendChild(descriptionLabel);
    form.appendChild(descriptionInput);
    form.appendChild(ageLabel);
    form.appendChild(ageSelect);
    form.appendChild(posterLabel);
    form.appendChild(posterInput);
    form.appendChild(submitButton);

    mainDiv.appendChild(form);

    submitButton.addEventListener("click", event => {
        event.preventDefault();

        const movie = {
            movieTitle: titleInput.value,
            movieLength: lengthInput.value,
            movieDescription: descriptionInput.value,
            ageRequirement: ageSelect.value,
            moviePosterUrl: posterInput.value,
        };

        console.log("Sending Data:", movie); // Debugging log

        fetch("https://kinoxpapi-hqhfffgncxdhf6bu.northeurope-01.azurewebsites.net/movie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(movie)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Success:", data);
                alert("Film oprettet!");
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Der opstod en fejl.");
            });
    });
}

//Tilføjelse af modalet til DOM'en omkring filmvisninger
function createMovieScreeningForm() {

    const menuContainer = document.getElementById("menuContainer");
    menuContainer.style.display = "none";

    const mainDiv = document.querySelector('.main');

    const creatMovieScreeningForm = document.createElement('form');
    creatMovieScreeningForm.id = "movieForm";
    creatMovieScreeningForm.classList.add('employeeCreateEditMovies');

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "X"
    closeButton.classList.add("closeButton");
    closeButton.addEventListener("click", (e) => {
        creatMovieScreeningForm.remove();
        menuContainer.style.display = "flex";
    })

    //Movie objekter
    const movieTitleLabel = document.createElement('label');
    movieTitleLabel.textContent = 'Film titel';
    const movie = document.createElement("select")

    const auditoriumLabel = document.createElement("label");
    auditoriumLabel.textContent = 'Film sal';
    const auditorium = document.createElement("select");
    const auditoriumOption1 = document.createElement("option");
    auditoriumOption1.innerText = "Sal 1"
    auditoriumOption1.setAttribute("data-id", 1)
    const auditoriumOption2 = document.createElement("option");
    auditoriumOption2.innerText = "Sal 2"
    auditoriumOption2.setAttribute("data-id", 2)

    const screeningTimeLabel = document.createElement("label");
    screeningTimeLabel.textContent = 'Tidspunkt';
    const screeningTime = document.createElement("select");
    screeningTime.id = "screeningTime";

    const screeningDateLabel = document.createElement("label");
    screeningDateLabel.textContent = 'Dato';
    const screeningDate = document.createElement("input");
    screeningDate.type = 'date';

    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.id = 'submitButton';
    submitButton.textContent = 'Opret Filmvisning';

    auditorium.addEventListener("change", () => updateAvailableTimeSlots(auditorium, screeningDate));
    screeningDate.addEventListener("change", () => updateAvailableTimeSlots(auditorium, screeningDate));

    //Tilføjelse af movies til selecten
    fetch("https://kinoxpapi-hqhfffgncxdhf6bu.northeurope-01.azurewebsites.net/movies")
        .then(response => response.json())
        .then(listOfmovies => {
            console.log(listOfmovies)

            for (let i = 0; i < listOfmovies.length; i++) {
                const movieOption = document.createElement("option")
                movieOption.innerText = listOfmovies[i].movieTitle;
                movieOption.setAttribute("data-id", listOfmovies[i].movieId);
                movie.appendChild(movieOption)
            }

        })
    //Tilføjelse af salen til selecten
    auditorium.appendChild(auditoriumOption1)
    auditorium.appendChild(auditoriumOption2)


    creatMovieScreeningForm.appendChild(closeButton)
    creatMovieScreeningForm.appendChild(movieTitleLabel);
    creatMovieScreeningForm.appendChild(movie);
    creatMovieScreeningForm.appendChild(auditoriumLabel);
    creatMovieScreeningForm.appendChild(auditorium);
    creatMovieScreeningForm.appendChild(screeningTimeLabel);
    creatMovieScreeningForm.appendChild(screeningTime);
    creatMovieScreeningForm.appendChild(screeningDateLabel);
    creatMovieScreeningForm.appendChild(screeningDate);


    creatMovieScreeningForm.appendChild(submitButton);


    mainDiv.appendChild(creatMovieScreeningForm)
    document.body.appendChild(mainDiv);


    submitButton.addEventListener("click", () => {

       const auditoriumNumber = auditorium.options[auditorium.selectedIndex].getAttribute("data-id");
        const movieScreening = {
            movie: {
                movieId: movie.options[movie.selectedIndex].getAttribute("data-id")
            },
            auditorium: {
                auditoriumId: auditoriumNumber
            },
            screeningTime: formatTimeToEnum(screeningTime.value),
            screeningDate: screeningDate.value
        };


        console.log(movieScreening)


        fetch("https://kinoxpapi-hqhfffgncxdhf6bu.northeurope-01.azurewebsites.net/movieScreening", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(movieScreening)
        }).then(response => {
            if (!response.ok) {
                console.log("Error:", response.status);
            } else {
                alert("Filmvisningen: " + movie.options[movie.selectedIndex].innerText + " i sal " + auditoriumNumber + " Kl: " + screeningTime.value + " Er oprettet i databasen");
                creatMovieScreeningForm.remove();
                menuContainer.style.display = "flex";
            }
        })
    })
}


function updateAvailableTimeSlots(auditorium, screeningDate) {
    const listOfTimeslots = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];


    const selectedAuditoriumNumber = auditorium.options[auditorium.selectedIndex].getAttribute("data-id");
    const selectedScreeningDate = screeningDate.value;

    if (!selectedAuditoriumNumber || !selectedScreeningDate) {
        return
    }

    console.log("Tjekker tiderne for d. " + selectedScreeningDate + " i sal: " + selectedAuditoriumNumber)

    fetch(`https://kinoxpapi-hqhfffgncxdhf6bu.northeurope-01.azurewebsites.net/movieScreenings/${selectedAuditoriumNumber}/${selectedScreeningDate}`)
        .then(response => response.json())
        .then(movieScreenings => {
            console.log(movieScreenings)

            const bookedTimes = movieScreenings.map(screening =>
                screening.screeningTime.replace("TIME_", "").replace("_", ":").replace("_", "")
            );

            console.log(bookedTimes)

            const availableTimes = listOfTimeslots.filter(time => !bookedTimes.includes(time));

            console.log("Ledige tider:", availableTimes);

            updateTimeDropdown(availableTimes)

        })
}

function updateTimeDropdown(availableTimes) {
    const screeningTime = document.getElementById("screeningTime");


    screeningTime.innerHTML = "";

    availableTimes.forEach(time => {
        const timeOption = document.createElement("option");
        timeOption.innerText = time;
        screeningTime.appendChild(timeOption);
    });
}

function formatTimeToEnum(timeString) {
    if (!timeString) return null;

    const [hours, minutes] = timeString.split(":");
    return `TIME_${hours}_${minutes}`;
}

