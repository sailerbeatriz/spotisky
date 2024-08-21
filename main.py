import requests
from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json


# API Weather
BASE_URL = "http://api.openweathermap.org/data/2.5/weather?"
API_KEY = "259c2b467ddff37d8f4554f1746f7085"

def get_weather(city):
    url = BASE_URL + "appid=" + API_KEY + "&q=" + city + "&units=metric&lang=pt_br"
    response = requests.get(url)
    return response.json()

def categorize_weather(weather_id):
    if 200 <= weather_id < 300:
        return "Tempestade"
    elif 300 <= weather_id < 400:
        return "Chuva"
    elif 500 <= weather_id < 600:
        return "Chuva"
    elif 600 <= weather_id < 700:
        return "Frio"
    elif 700 <= weather_id < 800:
        return "Nublado"
    elif weather_id == 800:
        return "Sol"
    elif 801 <= weather_id < 900:
        return "Nublado"
    else:
        return "Desconhecido"

# Spotify API
load_dotenv()
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

def get_token():
    auth_string = client_id + ":" + client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {"grant_type": "client_credentials"}
    result = post(url, headers=headers, data=data)
    json_result = json.loads(result.content)
    token = json_result["access_token"]
    return token

def get_auth_header(token):
    return {"Authorization": "Bearer " + token}

def search_for_playlist(token, playlist_name):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query = f"q={playlist_name}&type=playlist&limit=4"
    query_url = url + "?" + query
    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)
    
    playlists = []
    for item in json_result['playlists']['items']:
        playlists.append({
            "name": item['name'],
            "url": item['external_urls']['spotify'],
            "image": item['images'][0]['url']  # Obtendo a capa da playlist
        })
    
    return playlists

def main():
    city = input("Digite o nome da cidade: ")
    weather_response = get_weather(city)
    
    if 'weather' in weather_response:
        weather_id = weather_response['weather'][0]['id']
        description = weather_response['weather'][0]['description']
        print(f"Descrição do clima em {city}: {description}")
        
        categorized_weather = categorize_weather(weather_id)
        print(f"Clima categorizado: {categorized_weather}")
        
        playlists = {
            "Sol": ["Energético", "Feliz", "Otimista"],
            "Nublado": ["Relaxante", "Melancólico"],
            "Chuva": ["Introspectivo", "Tranquilo"],
            "Frio": ["Confortável", "Nostálgico"],
            "Calor": ["Animado", "Tropical"],
            "Tempestade": ["Dramático", "Intenso"]
        }

        if categorized_weather in playlists:
            for playlist_name in playlists[categorized_weather]:
                print(f"Buscando playlists para: {playlist_name}")
                token = get_token()
                playlist_results = search_for_playlist(token, playlist_name)
                
                for playlist in playlist_results:
                    print(f"Nome: {playlist['name']}, URL: {playlist['url']}, Capa: {playlist['image']}")
        else:
            print("Categoria de clima desconhecida.")
    else:
        print("Não foi possível obter os dados do clima.")
        

if __name__ == "__main__":
    main()
