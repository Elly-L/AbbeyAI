document.getElementById("chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const userInput = document.getElementById("userInput");
  const chatLog = document.getElementById("chatLog");
  const message = userInput.value.trim();

  if (!message) return;

  // Append user's message to chat log
  appendMessage("user", message);
  userInput.value = "";
  scrollChatToBottom();

  try {
    console.log("📡 Sending request to backend...");

    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    // Check if response is valid JSON
    const responseText = await response.text();
    console.log("✅ Raw Response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("❌ Failed to parse JSON response:", responseText);
      appendMessage("ai", "Error: Invalid server response.");
      return;
    }

    // Process AI response before displaying
    if (data.response) {
      let formattedResponse = formatResponse(data.response, message);
      appendMessage("ai", formattedResponse);
    } else {
      console.warn("⚠️ No response received from AI.");
      appendMessage("ai", "Error: No response from AI.");
    }
    
    scrollChatToBottom();
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    appendMessage("ai", "Error: Failed to connect to server.");
    scrollChatToBottom();
  }
});

/**
 * Formats AI response:
 * 1. Replaces "Gemini" with "AbbeyAI"
 * 2. Replaces "Google" with "Eltek"
 * 3. Replaces "trained by Google" with "trained by Eltek in Kenya"
 * 4. Converts **bold text** to <b>bold text</b>
 * 5. Appends a special message for identity-related prompts
 */
function formatResponse(text, userMessage) {
  let formattedText = text
    .replace(/Gemini/gi, "AbbeyAI")  // Case-insensitive replacement of "Gemini"
    .replace(/\bGoogle\b/gi, "Eltek") // Replace "Google" anywhere in the text
    .replace(/trained by Eltek/gi, "trained by Eltek in Kenya") // Ensures training info is accurate
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"); // Converts **bold** to <b>bold</b>

  // Check if the user is asking about AI's identity or abilities
  const identityQuestions = [
    "who are you",
    "what do you do",
    "what can you do",
    "how can you help",
    "tell me about yourself"
  ];

  if (identityQuestions.some((q) => userMessage.toLowerCase().includes(q))) {
    formattedText +=
      " <br><br> I am being developed to specialize in Medicine and help Abigail Mwihaki get through Med School at JKUAT by guiding her to accurate sources of information. I can also assist you with various queries!";
  }

  return formattedText;
}

function appendMessage(sender, text) {
  const chatLog = document.getElementById("chatLog");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender === "user" ? "user-message" : "ai-message");
  messageDiv.innerHTML = text; // ✅ Use innerHTML to render bold formatting
  chatLog.appendChild(messageDiv);
}

function scrollChatToBottom() {
  const chatLog = document.getElementById("chatLog");
  chatLog.scrollTop = chatLog.scrollHeight;
}
