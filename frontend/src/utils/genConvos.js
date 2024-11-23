export async function genConvo(botId, botData, chatHistory, setChatData, userData) {
    console.log("genConvo called with botId:", botId);
    console.log("Bot data:", botData);
    console.log("User data:", userData);
    console.log("Chat history:", chatHistory);
  
    // Ensure chatHistory is an array
    const validChatHistory = Array.isArray(chatHistory) ? chatHistory : [];
    let updatedChat = [...validChatHistory];
  
    if (updatedChat.length === 0) {
      updatedChat.push({ role: "user", content: `Hi ${botData.name}, let's talk!` });
      console.log("Initialized chat with first user message:", updatedChat);
    }
  
    const ws = new WebSocket("ws://195.242.13.27:8080");
    console.log("WebSocket connection initialized to:", "ws://195.242.13.27:8080");
  
    return new Promise((resolve, reject) => {
      ws.onopen = () => {
        console.log("WebSocket connection opened.");
  
        // Generate the prompt to pass to the LLM
        const generatePrompt = (userMessage) => {
          return `
            User: ${userData.name}
            Personality: ${userData.personality.summary}
            Interests: ${userData.interests}
            Bot: ${botData.name}
            Personality: ${botData.personality.summary}
            Social Media:
              - Twitter: ${botData.twitter}
              - Instagram: ${botData.instagram}
              - LinkedIn: ${botData.linkedin}
              - Facebook: ${botData.facebook}
            Chat History:
            ${updatedChat.map((message) => `${message.role === "user" ? "User" : "Bot"}: ${message.content}`).join("\n")}
            User: ${userMessage}
          `.trim();
        };
  
        const sendMessageToLLM = (message) => {
          const prompt = generatePrompt(message);
  
          const payload = JSON.stringify({
            prompt, // Include the generated prompt
          });
          console.log("Sending message to LLM:", payload);
          ws.send(payload);
        };
  
        sendMessageToLLM("Hi!");
  
        ws.onmessage = (event) => {
          console.log("Message received from LLM:", event.data);
          const data = JSON.parse(event.data);
  
          const turn = updatedChat.length % 2 === 0 ? "assistant" : "user";
          console.log("Turn determined:", turn);
  
          updatedChat.push({
            role: turn,
            content: data.response,
          });
          console.log("Updated chat history:", updatedChat);
  
          if (updatedChat.length >= 10) {
            console.log("Conversation reached 10 messages. Closing WebSocket.");
            ws.close();
            setChatData((prevData) => {
              const newData = [...prevData];
              newData[botId] = updatedChat; // Update only the specific bot's chat data
              return newData;
            });
            resolve(updatedChat);
          } else if (turn === "user") {
            console.log("Sending next user message.");
            sendMessageToLLM("What do you think?");
          }
        };
  
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };
  
        ws.onclose = () => {
          console.log("WebSocket closed.");
        };
      };
    });
  }
  