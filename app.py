import os
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Load API key from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

if not GEMINI_API_KEY:
    print("⚠️ ERROR: Missing Google Gemini API Key! Check Render Environment Variables.")

# Configure Google Gemini AI
genai.configure(api_key=GEMINI_API_KEY)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    if not user_message:
        return jsonify({"response": "Error: No message received!"}), 400

    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(user_message)

        if response and response.text:
            return jsonify({"response": response.text})
        else:
            return jsonify({"response": "Error: No response from Gemini AI."}), 500
    except Exception as e:
        print(f"❌ Request Failed: {str(e)}")
        return jsonify({"response": f"Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
