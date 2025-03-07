const submitMovieButton = document.querySelector('#submitButton');

//Skal denne linje bruges?
const employeeCreateEditMovie  = document.querySelector('#employeeCreateMovie');


submitMovieButton.addEventListener("click", event => {
    const employeeCreateMovie = document.querySelector('#employeeCreateMovie');

    const movie = {
        movieTitle : employeeCreateMovie.movieTitle.value,
        movieLength : employeeCreateMovie.movieLength.value,
        movieDescription : employeeCreateMovie.movieDescription.value,
        ageRequirement : employeeCreateMovie.ageRequirement.value,
        moviePosterUrl : employeeCreateMovie.moviePosterUrl.value,
    };

    console.log(movie);
})