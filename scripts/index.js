const apiKey = 'd09f3422'; // Remplacez par votre propre clé API OMDb
const apiUrl = 'https://www.omdbapi.com/'; // URL de l’API OMDb

const searchInput = document.getElementById('searchInput'); // Champ de recherche
const searchButton = document.getElementById('searchButton'); // Bouton de recherche
const resultsContainer = document.getElementById('resultsContainer'); // Conteneur des résultats
const message = document.getElementById('message'); // Message utilisateur

// Recherche avec clic
searchButton.addEventListener('click', () => {
    const title = searchInput.value.trim();
    searchMovies(title);
});

// Recherche avec Entrée
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const title = searchInput.value.trim();
        searchMovies(title);
    }
});

// Fonction de recherche de films
async function searchMovies(title) {
  resultsContainer.innerHTML = '';
  message.textContent = '';

  if (!title) {
    message.textContent = 'Veuillez saisir un titre de film.';
    return;
  }

  message.textContent = 'Recherche en cours…';

  try {
    let page = 1;
    let all = [];
    let totalResults = 0;

    while (true) {
      const res = await fetch(
        `${apiUrl}?s=${encodeURIComponent(title)}&apikey=${apiKey}&page=${page}`
      );
      const data = await res.json();

      if (data.Response !== 'True') break;

      all = all.concat(data.Search);

      totalResults = Number(data.totalResults || all.length);

      // OMDb: 10 résultats par page
      if (all.length >= totalResults) break;

      page += 1;

      // Option sécurité (évite boucle infinie si API renvoie mal)
      if (page > 50) break;
    }

    if (all.length === 0) {
      message.textContent = `Aucun résultat pour "${title}".`;
      return;
    }

    message.textContent = `${all.length} résultat(s) trouvé(s).`;

    const detailedMovies = await Promise.all(
      all.map(async (m) => {
        const r = await fetch(
          `${apiUrl}?i=${m.imdbID}&plot=short&apikey=${apiKey}`
        );
        return r.json();
      })
    );

    detailedMovies.forEach((movie) => {
      resultsContainer.appendChild(createMovieCard(movie));
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    message.textContent =
      'Erreur lors de l’appel à l’API. Vérifiez votre connexion et votre clé OMDb.';
  }
}


// Création d’une carte de film
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';

    // Gestion de l’affiche avec fallback
    const fallbackPoster = './img/no-poster.png';

    const poster =
        movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : fallbackPoster;

    const plot =
        movie.Plot && movie.Plot !== 'N/A'
            ? movie.Plot
            : 'Description indisponible.';

    const fullPlot = escapeHtml(plot);
    const shortPlot = fullPlot.slice(0, 140);

    card.innerHTML = `
        <img 
            src="${poster}" 
            alt="Affiche de ${escapeHtml(movie.Title)}" 
            class="movie-poster"
            onerror="this.onerror=null; this.src='${fallbackPoster}';"
        />
        <h3 class="movie-title">${escapeHtml(movie.Title)}</h3>
        <p class="movie-year">Année : ${escapeHtml(movie.Year || '')}</p>

        <p class="movie-plot" data-full="${fullPlot}" data-short="${shortPlot}">
            ${fullPlot.length > 140 ? shortPlot + '…' : fullPlot}
        </p>

    ${
        fullPlot.length > 140
            ? `<button type="button" class="toggle-plot">Lire la suite</button>`
            : ``
    }
`;
    // Gestion du bouton Lire la suite / Réduire
    const btn = card.querySelector('.toggle-plot');
    if (btn) {
        btn.addEventListener('click', () => {
            const p = card.querySelector('.movie-plot');
            const isExpanded = btn.dataset.expanded === 'true';

            if (isExpanded) {
                p.textContent = p.dataset.short + '…';
                btn.textContent = 'Lire la suite';
                btn.dataset.expanded = 'false';
            } else {
                p.textContent = p.dataset.full;
                btn.textContent = 'Réduire';
                btn.dataset.expanded = 'true';
            }
        });
    }

    return card;
}

// Petite protection contre injection via innerHTML
function escapeHtml(str) {
    return String(str).replace(
        /[&<>"']/g,
        (m) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;',
            }[m])
    );
}
