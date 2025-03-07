const submitMovieButton = document.querySelector('#submitButton');

const employeeCreateEditMovies  = document.querySelector('#employeeCreateMovies');


submitMovieButton.addEventListener("click", event => {
    const employeeCreateMovies = document.querySelector('#employeeCreateMovies');

    const movie = {
        movieTitle : employeeCreateMovies.movieTitle.value,
        movieLength : employeeCreateMovies.movieLength.value,
        movieDescription : employeeCreateMovies.movieDescription.value,
        ageRequirement : employeeCreateMovies.ageRequirement.value,
        moviePosterUrl : employeeCreateMovies.moviePosterUrl.value,
    };

    console.log(movie);
})