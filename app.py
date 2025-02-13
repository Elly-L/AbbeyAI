import os
import requests
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Load API key from environment variables
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    prompt = f"User: {user_message}\nAssistant:"

    headers = {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY  # ✅ Corrected header name for Anthropic API
    }

    payload = {
        "model": "claude-2",  # ✅ Ensure correct model name
        "prompt": prompt,
        "max_tokens_to_sample": 150
    }

    api_url = "https://api.anthropic.com/v1/complete"

    try:
        response = requests.post(api_url, json=payload, headers=headers)
        response_data = response.json()

        if response.status_code == 200:
            return jsonify({"response": response_data.get("completion", "No response from AI.")})
        else:
            print(f"API Error: {response_data}")  # ✅ Print API error details
            return jsonify({"response": f"Error from API: {response_data}"}), 500
    except Exception as e:
        print(f"Request Failed: {str(e)}")  # ✅ Print error message
        return jsonify({"response": "Error: Failed to connect to Anthropic API."}), 500

if __name__ == "__main__":
    app.run(debug=True)
