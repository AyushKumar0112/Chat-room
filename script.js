// 1. Grab your elements from HTML (using CSS classes/tags)
const sendButton = document.querySelector(".send");
const inputField = document.querySelector("textarea");
const messageArea = document.querySelector(".chat_message");

// 2. Listen for a click on the send button
sendButton.addEventListener("click", function () {
  const userText = inputField.value; //Read what You Typed

  // Make sure they didn't send an empty message
  if (userText.trim() !== "") {
    // Step2: Create a new chat bubble element
    const bubble = document.createElement("div");

    // Put the typed text inside the bubble
    bubble.textContent = userText;

    // Give it a CSS class for styling (you can style this class in CSS layout)
    bubble.classList.add("chat_bubble");

    // Append the bubble into your message display area
    messageArea.appendChild(bubble);

    //Step3: Auto-scroll to the bottom
    messageArea.scrollTop = messageArea.scrollHeight;

    //Clear the input field after sending the message
    inputField.value = "";

    //Bring the cursor right back to the textarea!
    inputField.focus();
  }
});

//login phase
const loginScreen = document.querySelector(".login_screen");
const usernameInput = document.querySelector(".username");
const loginBtn = document.querySelector(".join");
const chatTitle = document.querySelector(".avatar_name");

const avatarUrlInput = document.querySelector(".avatar-url-input");
const avatarFileInput = document.querySelector(".avatar-file-input");
const chatAvatar = document.querySelector(".avatar");

loginBtn.addEventListener("click", function () {
  const user_name = usernameInput.value.trim();

  //Check if a local file was selected
  if (avatarFileInput && avatarFileInput.files.length > 0) {
    //Creates a temporary local browser link for the uploaded file
    chatAvatar.src = URL.createObjectURL(avatarFileInput.files[0]);
    avatarFileInput.value = "";
  }

  //Otherwise, check if a text URL was pasted
  else if (avatarUrlInput && avatarUrlInput.value.trim() !== "") {
    chatAvatar.src = avatarUrlInput.value.trim();
    avatarUrlInput.value = "";
  }
  //(If neither is provided, your default avatar stays intact)

  if (user_name !== "") {
    // 1. Update the chat header name with the typed username
    chatTitle.textContent = user_name;
    usernameInput.value = "";
  }

  //Hide the login overlay
  loginScreen.style.display = "none";
  inputField.focus();
});
