export async function genFullConvo(botId, botData, chatData, setChatData, userData, messageLimit = 10) {
    console.log("genFullConvo called with botId:", botId);
    console.log("Bot data:", botData);
    console.log("User data:", userData);
    console.log("Chat data:", chatData);
  
    // Use environment variable for API endpoint
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8080";
    console.log(`[${new Date().toISOString()}] Using API endpoint:`, apiEndpoint);
  
    let updatedChat = [...chatData]; // Copy the existing chat data
  
    // Helper function for random delay
    const randomDelay = () => {
      const delay = Math.random() * 1000 + 1000; // 1 to 2 seconds
      return new Promise((resolve) => setTimeout(resolve, delay));
    };
  
    for (let i = updatedChat.length; i < messageLimit; i++) {
      // Determine whose turn it is: alternate between the user and the bot
      const currentSpeaker = i % 2 === 0 ? botData : userData; // The one receiving the message
      const otherSpeaker = i % 2 === 0 ? userData : botData; // Alternate between userData and botData
  
      // Construct the payload for the current speaker
      const payload = {
        personOne: {
          name: currentSpeaker.name,
          profilePicture: currentSpeaker.profilePicture,
          personality: currentSpeaker.personality,
          twitter: currentSpeaker.twitter,
          instagram: currentSpeaker.instagram,
          linkedin: currentSpeaker.linkedin,
          facebook: currentSpeaker.facebook,
          hobbies: currentSpeaker.hobbies,
          job: currentSpeaker.job,
          interests: currentSpeaker.interests,
        },
        personTwo: {
          name: otherSpeaker.name,
          profilePicture: otherSpeaker.profilePicture,
          personality: otherSpeaker.personality,
          twitter: otherSpeaker.twitter,
          instagram: otherSpeaker.instagram,
          linkedin: otherSpeaker.linkedin,
          facebook: otherSpeaker.facebook,
          hobbies: otherSpeaker.hobbies,
          job: otherSpeaker.job,
          interests: otherSpeaker.interests,
        },
        messageHistory: updatedChat.map(([content, role]) => {
          const participant = role === "user" ? userData.name : botData.name;
          return { role: participant, content };
        }),
      };
  
      console.log(`[${new Date().toISOString()}] Payload for API (Speaker: ${currentSpeaker.name}):`, payload);
  
      try {
        // Add random delay before making the request
        await randomDelay();
  
        // Make HTTP POST request to the API
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), // Send the payload as the body
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }
  
        const data = await response.json();
        console.log(`[${new Date().toISOString()}] Response from API:`, data);
  
        if (!data.response) {
          throw new Error("API response does not contain 'response' field.");
        }
  
        // Add the response to the chat history
        updatedChat.push([data.response, currentSpeaker === userData ? "user" : "ai"]);
  
        console.log(`[${new Date().toISOString()}] Updated chat history:`, updatedChat);
  
        // Save updated chat history to context
        setChatData((prevData) => {
          const newData = [...prevData];
          newData[botId] = updatedChat; // Update only the specific bot's chat data
          return newData;
        });
  
        // Break early if we reach the message limit
        if (updatedChat.length >= messageLimit) break;
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in genFullConvo:`, error);
        throw error; // Stop the loop on error
      }
    }
  
    return updatedChat; // Return the full conversation
  }
  