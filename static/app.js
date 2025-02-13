import os
import requests
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Load API key from environment variables
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    print("⚠️ ERROR: Missing Anthropic API Key! Check your Render environment variables.")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"response": "Error: No message received!"}), 400

    prompt = f"User: {user_message}\nAssistant:"
    headers = {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY  # Ensure the header is correct
    }
    payload = {
        "model": "claude-2",  # Make sure this model name is valid for your API key
        "prompt": prompt,
        "max_tokens_to_sample": 150
    }
    api_url = "https://api.anthropic.com/v1/complete"

    try:
        response = requests.post(api_url, json=payload, headers=headers)
        # Try to decode JSON; if it fails, log the response text.
        try:
            response_data = response.json()
        except Exception as json_err:
            print(f"❌ Failed to decode JSON. Status Code: {response.status_code}. Response Text: {response.text}")
            return jsonify({"response": "Error: Received invalid response from Anthropic API."}), 500

        if response.status_code == 200:
            return jsonify({"response": response_data.get("completion", "No response from AI.")})
        else:
            print(f"⚠️ API Error: {response_data}")
            return jsonify({"response": f"Error from API: {response_data}"}), 500
    except requests.exceptions.RequestException as e:
        print(f"❌ Request Failed: {str(e)}")
        return jsonify({"response": "Error: Failed to connect to Anthropic API."}), 500

if __name__ == "__main__":
    # Bind to 0.0.0.0 so that Render can reach your service
    app.run(host="0.0.0.0", port=5000)
