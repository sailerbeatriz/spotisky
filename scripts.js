document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const city = document.getElementById('city-input').value;
            searchPlaylists(city);
        });
    }
});

function searchPlaylists(city) {
    fetchPlaylists(city).then(playlists => {
        const playlistsSection = document.getElementById('playlists-section');
        playlistsSection.innerHTML = '';
        
        if (playlists.length > 0) {
            playlists.forEach(playlist => {
                const playlistItem = document.createElement('div');
                playlistItem.className = 'playlist-item';
                playlistItem.innerHTML = `
                    <img src="${playlist.images[0].url}" alt="${playlist.name}">
                    <div class="details">
                        <a href="${playlist.external_urls.spotify}" target="_blank">${playlist.name}</a>
                    </div>
                `;
                playlistsSection.appendChild(playlistItem);
            });
        } else {
            playlistsSection.innerHTML = "<p>Nenhuma playlist disponível para este clima.</p>";
        }
    });
}

function fetchPlaylists(city) {
    return getClimateForCity(city).then(climate => {
        setBackgroundColor(climate);
        
        let query = "";
        switch(climate) {
            case "Calor":
                query = "Energia, Festiva";
                break;
            case "Ensolarado":
                query = "Feliz, Alegre";
                break;
            case "Nublado":
                query = "Relaxante, Melancólico";
                break;
            case "Chuva":
                query = "Introspectivo, Tranquilo";
                break;
            case "Frio":
                query = "Confortável, Nostálgico";
                break;
            case "Tempestade":
                query = "Dramático, Intenso";
                break;
            default:
                query = "Relaxante";
        }

        return fetchSpotifyPlaylists(query);
    });
}

function fetchSpotifyPlaylists(query) {
    // Substitua a URL abaixo pela URL do endpoint que você criou no Flask para buscar playlists
    const apiUrl = `https://api.spotify.com/v1/search?type=playlist&q={query}=${encodeURIComponent(query)}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => data.playlists || [])
        .catch(error => {
            console.error('Erro ao buscar playlists:', error);
            return [];
        });
}

function getClimateForCity(city) {
    // Substitua pela lógica real de buscar clima para a cidade
    return new Promise(resolve => {
        // Exemplo fictício
        const climate = "Ensolarado"; // Isso deve ser substituído pela resposta da API real
        resolve(climate);
    });
}

function setBackgroundColor(climate) {
    const body = document.body;
    switch(climate) {
        case "Calor":
            body.style.backgroundColor = "#ffeb3b"; // Amarelo claro
            break;
        case "Ensolarado":
            body.style.backgroundColor = "#ff5722"; // Laranja
            break;
        case "Nublado":
            body.style.backgroundColor = "#9e9e9e"; // Cinza
            break;
        case "Chuva":
            body.style.backgroundColor = "#03a9f4"; // Azul
            break;
        case "Frio":
            body.style.backgroundColor = "#00bcd4"; // Azul claro
            break;
        case "Tempestade":
            body.style.backgroundColor = "#673ab7"; // Roxo
            break;
        default:
            body.style.backgroundColor = "#f5f5f5"; // Cor padrão
    }
}
