// --- 1. DOM ELEMENT SELECTIONS ---
const sendButton = document.querySelector(".send");
const inputField = document.querySelector("textarea");
const messageArea = document.querySelector(".chat_message");

const loginScreen = document.querySelector(".login_screen");
const usernameInput = document.querySelector(".username");
const loginBtn = document.querySelector(".join");
const chatTitle = document.querySelector(".avatar_name");

const avatarUrlInput = document.querySelector(".avatar-url-input");
const avatarFileInput = document.querySelector(".avatar-file-input");
const chatAvatar = document.querySelector(".avatar");

const cameraBtn = document.querySelector(".camera");
const cameraFileInput = document.querySelector(".camera-file-input");
const micBtn = document.querySelector(".mic_icon");

const phoneCallBtn = document.querySelector(".phone-btn");
const videoCallBtn = document.querySelector(".video-btn");
const newChatBtn = document.querySelector(".new-chat-btn");
const historyBtn = document.querySelector(".history-btn"); // New History Button

// --- 2. INITIALIZATION & ROBUST LOCAL STORAGE RESTORE ---
window.addEventListener("DOMContentLoaded", function () {
  const savedUser = localStorage.getItem("saved_username");
  const savedAvatar = localStorage.getItem("saved_avatar");

  if (savedUser) {
    chatTitle.textContent = savedUser;
    if (savedAvatar && chatAvatar) {
      chatAvatar.src = savedAvatar;
    }
    if (loginScreen) loginScreen.style.display = "none";

    loadActiveChat();
  } else {
    if (loginScreen) loginScreen.style.display = "flex";
  }
});

// --- 3. LOGIN PHASE (Saves Name & Avatar properly) ---
if (loginBtn) {
  loginBtn.addEventListener("click", function () {
    const user_name = usernameInput.value.trim();
    let avatarSrc = chatAvatar ? chatAvatar.src : "";

    if (avatarFileInput && avatarFileInput.files.length > 0) {
      avatarSrc = URL.createObjectURL(avatarFileInput.files[0]);
      chatAvatar.src = avatarSrc;
      avatarFileInput.value = "";
    } else if (avatarUrlInput && avatarUrlInput.value.trim() !== "") {
      avatarSrc = avatarUrlInput.value.trim();
      chatAvatar.src = avatarSrc;
      avatarUrlInput.value = "";
    }

    if (user_name !== "") {
      chatTitle.textContent = user_name;
      localStorage.setItem("saved_username", user_name);
      localStorage.setItem("saved_avatar", avatarSrc);
      usernameInput.value = "";
    }

    if (loginScreen) loginScreen.style.display = "none";
    if (inputField) inputField.focus();
  });
}

// --- 4. SEND TEXT MESSAGE ---
if (sendButton) {
  sendButton.addEventListener("click", function () {
    const userText = inputField.value;

    if (userText.trim() !== "") {
      const now = new Date();
      const timestring = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      appendAndSaveMessage({
        type: "text",
        content: userText,
        sender: "outgoing",
        time: timestring,
      });

      inputField.value = "";
      inputField.focus();
    }
  });
}

// --- 5. CAMERA & PHOTO SHARING ---
if (cameraBtn && cameraFileInput) {
  cameraBtn.addEventListener("click", () => cameraFileInput.click());

  cameraFileInput.addEventListener("change", function () {
    if (cameraFileInput.files.length > 0) {
      const imageUrl = URL.createObjectURL(cameraFileInput.files[0]);
      const now = new Date();
      const timestring = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      appendAndSaveMessage({
        type: "image",
        content: imageUrl,
        sender: "outgoing",
        time: timestring,
      });

      cameraFileInput.value = "";
    }
  });
}

// --- 6. VOICE NOTE SIMULATION ---
if (micBtn) {
  micBtn.addEventListener("click", function () {
    const now = new Date();
    const timestring = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    appendAndSaveMessage({
      type: "voice",
      content: "0:08",
      sender: "outgoing",
      time: timestring,
    });
  });
}

// --- 8. NEW CHAT & HISTORY ARCHIVING ---
if (newChatBtn) {
  newChatBtn.addEventListener("click", function () {
    const currentMessages =
      JSON.parse(localStorage.getItem("chat_messages")) || [];
    if (currentMessages.length > 0) {
      let allHistory = JSON.parse(localStorage.getItem("chat_history")) || [];
      allHistory.push({
        date: new Date().toLocaleString(),
        username: chatTitle.textContent,
        messages: currentMessages,
      });
      localStorage.setItem("chat_history", JSON.stringify(allHistory));
    }

    // Clear active session storage (keep saved_username cleared so it prompts login)
    localStorage.removeItem("chat_messages");
    localStorage.removeItem("saved_username");
    localStorage.removeItem("saved_avatar");

    messageArea.innerHTML = "";
    if (loginScreen) loginScreen.style.display = "flex";
  });
}

// --- 9. VIEW PAST CHAT HISTORY ---
if (historyBtn) {
  historyBtn.addEventListener("click", function () {
    let allHistory = JSON.parse(localStorage.getItem("chat_history")) || [];

    if (allHistory.length === 0) {
      alert(
        "No past chat history found yet! Start a chat and click 'New Chat' to archive it.",
      );
      return;
    }

    // Simple alert-based viewer or console log for your past chats
    let historySummary = "--- PAST CHAT HISTORY ---\n\n";
    allHistory.forEach((chat, index) => {
      historySummary += `${index + 1}. User: ${chat.username} (${chat.date}) - ${chat.messages.length} messages\n`;
    });

    alert(historySummary + "\n(Tip: You can check console for full details)");
    console.log("Full Chat History Archive:", allHistory);
  });
}

// --- 10. HELPER FUNCTIONS FOR RENDERING & STORAGE ---
function appendAndSaveMessage(msgObj) {
  renderBubble(msgObj);

  let messages = JSON.parse(localStorage.getItem("chat_messages")) || [];
  messages.push(msgObj);
  localStorage.setItem("chat_messages", JSON.stringify(messages));
}

function renderBubble(msgObj) {
  const bubble = document.createElement("div");
  bubble.classList.add("chat_bubble", msgObj.sender);

  let innerHTMLContent = "";

  if (msgObj.type === "image") {
    innerHTMLContent = `<div class="message-image"><img src="${msgObj.content}" style="max-width: 100%; border-radius: 8px;"></div>`;
  } else if (msgObj.type === "voice") {
    innerHTMLContent = `<div class="voice-note" style="display: flex; align-items: center; gap: 8px;"><span>🎤 Voice Message</span><span style="font-size: 0.8rem; opacity: 0.7;">${msgObj.content}</span></div>`;
  } else {
    innerHTMLContent = `<div class="message-text">${msgObj.content}</div>`;
  }

  bubble.innerHTML = `
    ${msgObj.sender === "incoming" ? `<span class="sender-name">${msgObj.senderName || "Friend"}</span>` : ""}
    ${innerHTMLContent}
    <div class="message-meta">
        <span class="timestamp">${msgObj.time}</span>
        ${msgObj.sender === "outgoing" ? '<span class="ticks">👍</span>' : ""}
    </div>
  `;

  messageArea.appendChild(bubble);
  messageArea.scrollTop = messageArea.scrollHeight;
}

function loadActiveChat() {
  let messages = JSON.parse(localStorage.getItem("chat_messages")) || [];
  messageArea.innerHTML = "";
  messages.forEach((msg) => renderBubble(msg));
}

function displayIncomingMessage(senderName, messageText) {
  const now = new Date();
  const timestring = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  appendAndSaveMessage({
    type: "text",
    content: messageText,
    sender: "incoming",
    senderName: senderName,
    time: timestring,
  });
}
