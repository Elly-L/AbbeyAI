document.getElementById("chatForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const userInput = document.getElementById("userInput");
    const message = userInput.value.trim();
    if (!message) return;
  
    // Append user's message to chat log
    appendMessage("user", message);
    userInput.value = "";
    scrollChatToBottom();
  
    // Call the backend API to get the AI response
    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      appendMessage("ai", data.response);
      scrollChatToBottom();
    } catch (error) {
      console.error("Error:", error);
      appendMessage("ai", "Sorry, something went wrong!");
      scrollChatToBottom();
    }
  });
  
  function appendMessage(sender, text) {
    const chatLog = document.getElementById("chatLog");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.classList.add(sender === "user" ? "user-message" : "ai-message");
    messageDiv.textContent = text;
    chatLog.appendChild(messageDiv);
  }
  
  function scrollChatToBottom() {
    const chatLog = document.getElementById("chatLog");
    chatLog.scrollTop = chatLog.scrollHeight;
  }
  