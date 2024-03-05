from flask import Flask, jsonify
from flask_cors import CORS
from main import get_token, search_for_artist, get_songs_by_artists

app = Flask(__name__)
CORS(app)

@app.route('/get-spotify-data', methods=['GET'])
def get_spotify_data():
    token = get_token()
    artist_result = search_for_artist(token, "ACDC")
    artist_id = artist_result["id"]
    songs = get_songs_by_artists(token, artist_id)
    followers = artist_result["followers"]["total"]

    spotify_data = {
        "name": artist_result["name"],
        "followers": followers,
        "topTracks": [{"name": song["name"]} for song in songs],
    }

    return jsonify(spotify_data)

if __name__ == '__main__':
    app.run(debug=True)