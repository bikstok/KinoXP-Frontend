
choice = "showMovies"

switch (choice) {

    case "showMovies":
        const listOfMovies = [];
        const showInfoTable = document.querySelector('#showMoviesTable');

        fetch('http://localhost:8080/movies')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Promise not OK');
                }
                return response.json();
            })
            .then(data => {
                listOfMovies.push(...data);
                console.log(listOfMovies);
                populateTableOfMovies();
            })
            .catch(error => {
                console.error('Some error', error);
            });

    function populateTableOfMovies() {
        listOfMovies.forEach(movie => {
            let row = document.createElement('tr');

            row.innerHTML = `
        <td>${movie.movieTitle}</td>
        <td>${movie.movieLength}</td>
        <td>${movie.description}</td>
        <td>${movie.ageRequirement}</td>
        <td>${movie.moviePosterUrl}</td>
        <td><button>Rediger</button><button>Slet</button></td>
       
    `;

            showInfoTable.appendChild(row);
        })

    }
}