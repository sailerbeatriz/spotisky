import requests
from flask import Flask

app = Flask(__name__)
app.secret_key = 'e645484f7ffd4534894809d8568d9be7'

CLIENT_ID = '82b2059287df4d038b8e2b177b2f1537'
CLIENT_SECRET = 'e645484f7ffd4534894809d8568d9be7'
REDIRECT_URL ='http://localhost:8888/callback'

AUTH_URL ='https://accounts.spotify.com/authorize'
TOKEN_URL ='https://accounts.spotify.com/authorize/api/token'
API_BASE_URL = 'https://api.spotify.com/v1/'

