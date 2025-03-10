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
            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = "<i class=\"fa-solid fa-trash\"></i>";
            deleteButton.addEventListener('click', () => {
                deleteMovie(movie.movieId)
            });

            row.innerHTML = `
        <td>${movie.movieTitle}</td>
        <td>${movie.movieLength}</td>
        <td>${movie.movieDescription}</td>
        <td>${movie.ageRequirement}</td>
        <td>${movie.moviePosterUrl}</td>
        <td><button><i class="fa-solid fa-pen-to-square"></i></button></td>
       
    `;

            row.children[5].appendChild(deleteButton);
            showInfoTable.appendChild(row);
        })
    }
}

function deleteMovie(movieId) {
    fetch(`http://localhost:8080/${movieId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"

            },
            body: JSON.stringify({
                movieId: movieId
            })
        }
    ).catch(error => {
        console.log(error);})
}