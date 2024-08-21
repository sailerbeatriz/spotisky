// Função para buscar o clima para uma cidade
function getClimateForCity(city) {
    return fetch(`/get_climate?city=${encodeURIComponent(city)}`)
        .then(response => response.json())
        .then(data => data.climate);
}

// Função para buscar playlists no backend
function fetchSpotifyPlaylists(query) {
    return fetch(`/get_playlist?name=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => data.playlists);
}

// Função para definir a cor de fundo com base no clima
function setBackgroundColor(climate) {
    const body = document.body;
    switch(climate) {
        case "Calor":
            body.style.backgroundColor = "#F7C6C7"; // Cor para calor
            break;
        case "Ensolarado":
            body.style.backgroundColor = "#FFD700"; // Cor para ensolarado
            break;
        case "Nublado":
            body.style.backgroundColor = "#B0C4DE"; // Cor para nublado
            break;
        case "Chuva":
            body.style.backgroundColor = "#4682B4"; // Cor para chuva
            break;
        case "Frio":
            body.style.backgroundColor = "#B0E0E6"; // Cor para frio
            break;
        case "Tempestade":
            body.style.backgroundColor = "#4B0082"; // Cor para tempestade
            break;
        default:
            body.style.backgroundColor = "#F0F8FF"; // Cor padrão
    }
}

// Função para buscar e exibir playlists
function fetchPlaylists(city) {
    getClimateForCity(city).then(climate => {
        setBackgroundColor(climate);
        
        // Determinar a palavra-chave para a pesquisa
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

        fetchSpotifyPlaylists(query).then(playlists => {
            const playlistsSection = document.getElementById('playlists-section');
            // Limpar playlists anteriores
            playlistsSection.innerHTML = "";
            
            // Adicionar novas playlists
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
    });
}

// Exemplo de chamada
document.getElementById('search-button').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    fetchPlaylists(city);
});
