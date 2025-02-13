from flask import Flask, request, jsonify, render_template
import os
import requests

app = Flask(__name__)

# Ensure your Anthropic API key is set as an environment variable named ANTHROPIC_API_KEY
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    # Build your prompt for the AI model – adjust as needed per Anthropic's docs.
    prompt = f"User: {user_message}\nAssistant:"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {ANTHROPIC_API_KEY}"
    }
    
    # Adjust the payload as per Anthropic's API requirements.
    payload = {
        "prompt": prompt,
        "max_tokens_to_sample": 150,
        "stop_sequences": ["\n", "User:"]
    }
    
    # Call Anthropic's API endpoint
    api_url = "https://api.anthropic.com/v1/complete"
    response = requests.post(api_url, json=payload, headers=headers)
    
    if response.status_code == 200:
        ai_response = response.json().get("completion", "I couldn’t generate a response.")
    else:
        ai_response = "Error: Failed to retrieve response from Anthropic API."
    
    return jsonify({"response": ai_response})

if __name__ == "__main__":
    app.run(debug=True)
