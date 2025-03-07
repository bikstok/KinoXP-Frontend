const submitMovieButton = document.querySelector('#submitButton');


submitMovieButton.addEventListener("click", event => {
    event.preventDefault(); // Prevents unintended form submission (if necessary)

    const employeeCreateMovies = document.querySelector('#employeeCreateMovies');

    const movie = {
        movieTitle: employeeCreateMovies.elements["movieTitle"].value,
        movieLength: employeeCreateMovies.elements["movieLength"].value,
        movieDescription: employeeCreateMovies.elements["movieDescription"].value,
        ageRequirement: employeeCreateMovies.elements["ageRequirement"].value,
        moviePosterUrl: employeeCreateMovies.elements["moviePosterUrl"].value,

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