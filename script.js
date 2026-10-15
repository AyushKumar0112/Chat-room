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
