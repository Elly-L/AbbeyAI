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

    // Check if AI response exists
    if (data.response) {
      appendMessage("ai", data.response);
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

function appendMessage(sender, text) {
  const chatLog = document.getElementById("chatLog");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender === "user" ? "user-message" : "ai-message");
  messageDiv.textContent = text;
  chatLog.appendChild(messageDiv);
}

function scrollChatToBottom() {
  const chatLog = document.getElementById("chatLog");
  chatLog.scrollTop = chatLog.scrollHeight;
}
