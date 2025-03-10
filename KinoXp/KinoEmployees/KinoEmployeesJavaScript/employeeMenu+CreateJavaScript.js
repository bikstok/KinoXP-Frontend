// Når DOM'en er klar, kører vi funktionen
document.addEventListener("DOMContentLoaded", () => {
    showMenu()



});

function showMenu() {
    const mainDiv = document.querySelector('.main');

    const menuContainer = document.createElement("div");
    menuContainer.id = "menuContainer";

    const createMovie = document.createElement("button");
    createMovie.id = "createMovie";
    createMovie.classList = "menuButton"
    createMovie.innerText = "Opret Ny Film"
    createMovie.addEventListener("click", (e) => {
        createMovieForm()
    })

    const createMovieScreening = document.createElement("button");
    createMovieScreening.id = "createMovieScreening";
    createMovieScreening.classList = "menuButton"
    createMovieScreening.innerText = "Opret Ny Filmvisning"

    const showMovies = document.createElement('a');
    showMovies.id = "showMovies";
    showMovies.classList = "menuButton"
    showMovies.innerText = "Se Filmoversigt"
    showMovies.href = "dummyRUDPage.html"

    const showMoviesScreening = document.createElement("a");
    showMoviesScreening.id = "showMoviesScreening";
    showMoviesScreening.classList = "menuButton"
    showMoviesScreening.innerText = "Se Filmvisningsoversigt"

    const showBookings = document.createElement('a');
    showBookings.id = "showBookings";
    showBookings.classList = "menuButton"
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

    // Opretter form element
    const form = document.createElement('form');
    form.id = "movieForm";
    form.classList.add('employeeCreateEditMovies');

    // Opretter et label og input for filmens titel
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Film titel';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'movieTitle';
    titleInput.name = 'movieTitle';

    // Opretter et label og input for filmens længde
    const lengthLabel = document.createElement('label');
    lengthLabel.textContent = 'Film længde';
    const lengthInput = document.createElement('input');
    lengthInput.type = 'number';
    lengthInput.id = 'movieLength';
    lengthInput.name = 'movieLength';

    // Opretter et label og input for filmens beskrivelse
    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = 'Beskrivelse';
    const descriptionInput = document.createElement('input');
    descriptionInput.type = 'text';
    descriptionInput.id = 'movieDescription';
    descriptionInput.name = 'movieDescription';

    // Opretter et label og select for aldersgrænse
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

    // Opretter et label og input for plakat URL
    const posterLabel = document.createElement('label');
    posterLabel.textContent = 'Plakat URL/JPEG/PNG';
    const posterInput = document.createElement('input');
    posterInput.type = 'text';
    posterInput.id = 'moviePosterUrl';
    posterInput.name = 'moviePosterUrl';

    // Opretter en submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.id = 'submitButton';
    submitButton.textContent = 'Opret Film';

    // Appender alle elementerne til form
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

    // Appender form til main div
    mainDiv.appendChild(form);

    // Event listener for submit
    submitButton.addEventListener("click", event => {
        event.preventDefault(); // Forhindrer utilsigtet form indsendelse

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
