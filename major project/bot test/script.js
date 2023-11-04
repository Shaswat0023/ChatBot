const chatInput = document.querySelector(".chat-input textarea"); //Selects the first text area element inside the html element with the class "Chat-input" and assigns it to the variable `chatInput`. Used to capture user input in a chat interface.

const sendChatBtn = document.querySelector(".chat-input span"); //selects the first <span> element inside an HTML element with the class "chat-input" and assigns it to the variable sendChatBtn. This likely represents a button that users can click to send their chat message.

const chatbox = document.querySelector(".chatbox"); // selects an HTML element with the class "chatbox" and assigns it to the variable chatbox. This is where the chat messages will be displayed.

// const voiceIcon = document.getElementById("voice-icon"); //selects an HTML element with the ID "voice-icon" and assigns it to the variable voiceIcon. This likely represents an icon or element related to voice input or output.

let userMessage; //Declares a variable called userMessage which will be used to store the user's input message.

const API_KEY = "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";

// This is a function declaration that defines a function called createChatLi. It takes two parameters, message  and className. This function is used to create a new chat message element.
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}


//It takes an incoming chat message element (incomingChatLi) as a parameter. This function is responsible for generating a response to the user's message.
const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions"; //This is where the code will send requests to generate responses using GPT-3.

    const messageElement = incomingChatLi.querySelector("p"); //selects the <p> element inside the incomingChatLi, which represents the message content that will be updated with the response.

    const isAskingName = userMessage.toLowerCase().includes("name"); 
    const isAskingAi = userMessage.toLowerCase().includes("who are you?"); 
    const isAskingDayTime = /day|time/gi.test(userMessage); 
    const isGreeting = /hi|hello|hey/gi.test(userMessage);

    if (isAskingName) {
        messageElement.textContent = "My name is Oliver!";
    } else if (isAskingAi) {
            messageElement.textContent = "My name is Oliver!";
    
    } else if (isGreeting) {
        messageElement.textContent = "Hello there! I'm your virtual assistant, here to make your day a little brighter and your tasks a lot easier. Feel free to ask me anything, whether it's a question, a task, or just a friendly chat. I'm here to help and have a great conversation with you. What can I assist you with today?";
    } else if (isAskingDayTime) {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();
        const formattedTime = currentDate.toLocaleTimeString();
        messageElement.textContent = `The current date is ${formattedDate} and the time is ${formattedTime}`;
    } else {
        // object called requestOptions with the configuration for a HTTP POST request to the OpenAI API. It specifies the model to use, the message content, and the API key for authentication.
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }]
            })
        }


        // uses the fetch API to make a POST request to the OpenAI API with the provided requestOptions. It then processes the response by converting it to JSON format and updating the messageElement with the generated response.
        fetch(API_URL, requestOptions)
            .then(res => res.json())
            .then(data => {
                messageElement.textContent = data.choices[0].message.content;
            })

            // If there's an error during the API request, this code handles the error by updating the messageElement with an error message.
            .catch(error => {
                messageElement.textContent = "Oops! Something went wrong. Please try again.";
            });
    }
}

// used to scroll the chatbox to the bottom so that the most recent messages are visible.
function scrollToBottom() {
    chatbox.scrollTop = chatbox.scrollHeight;
}

//function captures the user's message, appends it to the chatbox as an outgoing message, clears the input field, displays a "Thinking..." message, generates a response, and scrolls to the bottom to show the latest messages in the chat interface. This function manages the user's input and the display of chat messages.
const handleChat = () => {

    // captures the user's input from the chatInput element (which is a textarea), trims any leading or trailing whitespace, and assigns the cleaned message to the userMessage variable. Trimming removes unnecessary spaces or newlines that the user might have entered.
    userMessage = chatInput.value.trim();

    // checks if the userMessage is empty or contains only whitespace after trimming. If the message is empty, the function immediately returns, and no further action is taken. This is a validation step to prevent sending empty messages.
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    
    // After adding the user's message to the chatbox, this line clears the text input field by setting its value to an empty string. This allows the user to start typing a new message easily.
    chatInput.value = ''; 


    //  sets up a delay using setTimeout. The code inside the function passed to setTimeout will run after a 600-millisecond
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        generateResponse(incomingChatLi);
       
        scrollToBottom();
    }, 100);
}

window.addEventListener("load", scrollToBottom);

sendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        handleChat();
    }
});
