from flask import Flask, jsonify
from main import get_token

app = Flask(__name__)

@app.route('/get-token', methods=['GET'])
def get_api_token():
    token = get_token()  # Call your token-fetching function
    return jsonify({'token': token})

if __name__ == '__main__':
    app.run(debug=True)