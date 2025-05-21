document.addEventListener('DOMContentLoaded', function() {
  const darkModeToggle = document.getElementById('dark-mode');
  const body = document.body;

  // Check for saved user preference
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    darkModeToggle.checked = true;
  }

  // toggle dark mode
  darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  });
});

const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
let userMsg;


const RASA_SERVER_URL = "https://manel-project.onrender.com/webhooks/rest/webhook";

const createChatSection = (msg, className) => {
  const chatSection = document.createElement("section");
  chatSection.classList.add("chat", className);
  
  let chatContent = className === "outgoing" ? 
    `<p>${msg}</p>` : 
    `<span class="symbole"></span><p>${msg}</p>`;

  chatSection.innerHTML = chatContent;
  return chatSection;
}

// Function to send message to Rasa and get response
const sendMessageToRasa = async (message) => {
  try {
    console.log("Sending message to Rasa:", message);
    console.log("URL:", RASA_SERVER_URL);
    
    const response = await fetch(RASA_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        sender: "user", 
        message: message 
      }),
    });
    
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Rasa response:", data);
    return data;
  } catch (error) {
    console.error("Error communicating with Rasa:", error);
    return [{ text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." }];
  }
}

const handleChat = async () => {
  userMsg = chatInput.value.trim();
  if(!userMsg) {
    return;
  }
  
  // Display user message
  chatbox.appendChild(createChatSection(userMsg, "outgoing"));
  
  // Clear input field
  chatInput.value = "";
  
  // Show typing indicator
  const typingIndicator = document.createElement("section");
  typingIndicator.classList.add("chat", "incoming", "typing-indicator");
  typingIndicator.innerHTML = '<span class="symbole"></span><p>...</p>';
  chatbox.appendChild(typingIndicator);
  
  // Scroll to bottom
  chatbox.scrollTop = chatbox.scrollHeight;
  
  // Send message to Rasa and get response
  const rasaResponse = await sendMessageToRasa(userMsg);
  
  // Remove typing indicator
  chatbox.removeChild(typingIndicator);
  
  // Display Rasa responses
  if (rasaResponse && rasaResponse.length > 0) {
    rasaResponse.forEach(response => {
      if (response.text) {
        chatbox.appendChild(createChatSection(response.text, "incoming"));
      }
    });
  } else {
    chatbox.appendChild(createChatSection("I didn't get a response. Please try again.", "incoming"));
  }
  
  // Scroll to bottom again after all responses are added
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Send message when send button is clicked
sendChatBtn.addEventListener("click", handleChat);

// Fix selector to match the HTML
document.querySelector("#send-btn").addEventListener("click", handleChat);

// Send message when Enter key is pressed (without Shift)
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});