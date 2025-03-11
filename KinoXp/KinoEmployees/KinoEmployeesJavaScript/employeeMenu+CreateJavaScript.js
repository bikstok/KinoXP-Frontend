document.addEventListener("DOMContentLoaded", () => {
    showMenu() //Hvad der vises som default


});

// <button className="hamburger">
//     <!-- material icons https://material.io/resources/icons/ -->
//     <i className="menuIcon material-icons">menu</i>
//     <i className="closeIcon material-icons">close</i>
// </button>

function showMenu() {
    const mainDiv = document.querySelector('.main');

    const burgerMenu = document.createElement('button');
    burgerMenu.classList.add("burger-menu");


    const burgerMenuIcon = document.createElement('i');
    burgerMenuIcon.classList.add("material-icons")
    burgerMenuIcon.innerText = "menu";

    burgerMenu.appendChild(burgerMenuIcon)
    mainDiv.    appendChild(burgerMenu)


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



    const menuContainer = document.createElement("div");
    menuContainer.id = "menuContainer";

    const createMovie = document.createElement("button");
    createMovie.id = "createMovie";
    createMovie.classList.add("menuButton")
    createMovie.innerText = "Opret Ny Film"
    createMovie.addEventListener("click", (e) => {
        createMovieForm()
    })

    const createMovieScreening = document.createElement("button");
    createMovieScreening.id = "createMovieScreening";
    createMovieScreening.classList.add("menuButton")
    createMovieScreening.innerText = "Opret Ny Filmvisning"
    createMovieScreening.addEventListener("click", (e) => {
        createMovieScreeningForm()
    })

    const showMovies = document.createElement('a');
    showMovies.id = "showMovies";
    showMovies.classList.add("menuButton")
    showMovies.innerText = "Se Filmoversigt";
    showMovies.href = "dummyRUDPage.html?type=movies";

    const showMoviesScreening = document.createElement("a");
    showMoviesScreening.id = "showMovieScreening";
    showMoviesScreening.classList.add("menuButton")
    showMoviesScreening.innerText = "Se Filmvisningsoversigt";
    showMoviesScreening.href = "dummyRUDPage.html?type=screenings";


    const showBookings = document.createElement('a');
    showBookings.id = "showBookings";
    showBookings.classList.add("menuButton")
    showBookings.innerText = "Se Bookingsoversigt"

    menuContainer.appendChild(createMovie);
    menuContainer.appendChild(createMovieScreening);
    menuContainer.appendChild(showMovies);
    menuContainer.appendChild(showMoviesScreening);
    menuContainer.appendChild(showBookings);

    mainDiv.appendChild(menuContainer);
};

function createMovieForm() {
    const menuContainer = document.getElementById("menuContainer");
    menuContainer.style.display = "none";
    const mainDiv = document.querySelector('.main');


    const form = document.createElement('form');
    form.id = "movieForm";
    form.classList.add('employeeCreateEditMovies');

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "X"
    closeButton.classList.add("closeButton");
    closeButton.addEventListener("click", (e) => {
        form.remove();
        menuContainer.style.display = "flex";
    })

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Film titel';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'movieTitle';
    titleInput.name = 'movieTitle';


    const lengthLabel = document.createElement('label');
    lengthLabel.textContent = 'Film længde';
    const lengthInput = document.createElement('input');
    lengthInput.type = 'number';
    lengthInput.id = 'movieLength';
    lengthInput.name = 'movieLength';


    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = 'Beskrivelse';
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.id = 'movieDescription';
    descriptionInput.name = 'movieDescription';


    const ageLabel = document.createElement('label');
    ageLabel.textContent = 'Aldersgrænse';
    const ageSelect = document.createElement('select');
    ageSelect.id = 'ageRequirement';
    ageSelect.name = 'ageRequirement';

    const ageOptions = ['Vælg aldersgrænse', '12', '16', '18', '0'];
    ageOptions.forEach(age => {
        const option = document.createElement('option');
        option.value = age === 'Vælg aldersgrænse' ? '' : age;
        option.textContent = age;
        ageSelect.appendChild(option);
    });


    const posterLabel = document.createElement('label');
    posterLabel.textContent = 'Plakat URL/JPEG/PNG';
    const posterInput = document.createElement('input');
    posterInput.type = 'text';
    posterInput.id = 'moviePosterUrl';
    posterInput.name = 'moviePosterUrl';


    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.id = 'submitButton';
    submitButton.textContent = 'Opret Film';


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

        fetch("http://localhost:8080/movie", {
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

    const screeningTimeLabel = document.createElement("label");
    screeningTimeLabel.textContent = 'Tidspunkt';
    const screeningTime = document.createElement("select");

    const screeningDateLabel = document.createElement("label");
    screeningDateLabel.textContent = 'Dato';
    const screeningDate = document.createElement("input");
    screeningDate.type = 'date';

    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.id = 'submitButton';
    submitButton.textContent = 'Opret Filmvisning';


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

        const movieScreening = {
            movie: {
                movieTitle: movie.movieTitle,
                movieLength: movie.movieLength,
                movieDescription: movie.movieDescription,
                ageRequirement: movie.ageRequirement,
                moviePosterUrl: movie.moviePosterUrl,
                inRotation: movie.inRotation
            },
            auditorium: {
                auditoriumNumber: auditorium.auditoriumNumber
            },
            screeningTime: screeningTime,
            screeningDate: screeningDate,
            hasPlayed: false
        }


        fetch("http://localhost:8080/movieScreening", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(movieScreening)
        }).then(response => {
            if (!response.ok) {
                console.log("Error:", response.status);
            } else {
                alert("Filmvisningen er blevet oprettet")
            }
        })
    })
}