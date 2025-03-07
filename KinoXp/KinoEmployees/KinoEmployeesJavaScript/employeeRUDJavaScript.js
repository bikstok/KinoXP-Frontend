
//start of edit movie

//loads movie elements - notice apiUrl = 1
document.addEventListener("DOMContentLoaded", async function(){
    const apiUrl = "http://localhost:8080/1";
    const form = document.getElementById(("movieForm"));

    async function fetchMovieData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Data can't be fetched yo");

            const data = await response.json();
            console.log("Tjekker lige API Response:", data);//tjekker lige om kaldet fungere

            document.getElementById("movieTitle")       .value = data.movieTitle || "";
            document.getElementById("movieLength")      .value = data.movieLength || "";
            document.getElementById("description")      .value = data.description || "";
            document.getElementById("ageRequirement")   .value = data.ageRequirement || "";
            document.getElementById("moviePosterUrl")   .value = data.moviePosterUrl || "";
        } catch (error){
            console.error("Error fetching data", error);
            alert("failed to load movie data.");
        }
    }
    fetchMovieData();
})

//show movie js backend


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
            deleteButton.textContent = "slet";
            deleteButton.addEventListener('click', () => {
                deleteMovie(movie.movieId)
            });

            row.innerHTML = `
        <td>${movie.movieTitle}</td>
        <td>${movie.movieLength}</td>
        <td>${movie.description}</td>
        <td>${movie.ageRequirement}</td>
        <td>${movie.moviePosterUrl}</td>
        <td><button>Rediger</button></td>
       
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

