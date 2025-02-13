import os
import requests
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Load API key from environment variables
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "").strip()  # ✅ Strip extra spaces/newline

if not ANTHROPIC_API_KEY:
    print("⚠️ ERROR: Missing Anthropic API Key! Check Render Environment Variables.")

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
        "x-api-key": ANTHROPIC_API_KEY  # ✅ Ensure correct API key format
    }

    # ✅ Switched from "claude-2" to "claude-instant-1" for lower cost
    payload = {
        "model": "claude-instant-1",  # ✅ Cheaper & faster model
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
            print(f"⚠️ API Error: {response_data}")  # ✅ Print API error details
            return jsonify({"response": f"Error from API: {response_data}"}), 500
    except requests.exceptions.RequestException as e:
        print(f"❌ Request Failed: {str(e)}")  # ✅ Logs exact failure in Render logs
        return jsonify({"response": "Error: Failed to connect to Anthropic API."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)  # ✅ Allows Render to bind properly
