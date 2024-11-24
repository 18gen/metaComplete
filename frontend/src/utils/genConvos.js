export async function genFullConvo(
    botId,
    botData,
    chatData,
    setChatData,
    userData,
    setCompatibilityScores, // Function to update compatibility scores
    compatibilityScores, // Array to store compatibility scores
    messageLimit = 10
  ) {
    console.log("genFullConvo called with botId:", botId);
    console.log("Bot data:", botData);
    console.log("User data:", userData);
    console.log("Chat data:", chatData);
  
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8080";
    console.log(`[${new Date().toISOString()}] Using API endpoint:`, apiEndpoint);
  
    let updatedChat = [...chatData]; // Copy the existing chat data
    let lastPayload = null; // Define a variable to hold the last payload used
  
    const randomDelay = () => {
      const delay = Math.random() * 1000 + 1000; // 1 to 2 seconds
      return new Promise((resolve) => setTimeout(resolve, delay));
    };
  
    for (let i = updatedChat.length; i < messageLimit; i++) {
      const currentSpeaker = i % 2 === 0 ? botData : userData; // The one receiving the message
      const otherSpeaker = i % 2 === 0 ? userData : botData;
  
      // Construct the payload
      lastPayload = {
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
  
      console.log(`[${new Date().toISOString()}] Payload for API (Speaker: ${currentSpeaker.name}):`, lastPayload);
  
      try {
        await randomDelay();
  
        const response = await fetch(`${apiEndpoint}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(lastPayload),
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
  
        updatedChat.push([data.response, currentSpeaker === userData ? "user" : "ai"]);
        console.log(`[${new Date().toISOString()}] Updated chat history:`, updatedChat);
  
        setChatData((prevData) => {
          const newData = [...prevData];
          newData[botId] = updatedChat;
          return newData;
        });
  
        if (updatedChat.length >= messageLimit) break;
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in genFullConvo:`, error);
        throw error;
      }
    }
  
    // After reaching message limit, make a request to /match
    try {
      const matchResponse = await fetch(`${apiEndpoint}/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lastPayload), // Use the last payload from the loop
      });
  
      if (!matchResponse.ok) {
        const errorText = await matchResponse.text();
        throw new Error(`HTTP error on /match! Status: ${matchResponse.status}, Message: ${errorText}`);
      }
  
      const matchData = await matchResponse.json();
      console.log(`[${new Date().toISOString()}] Match response:`, matchData);
  
      if (!matchData.compatibility.score) {
        throw new Error("Match response does not contain 'score' field.");
      }
  
      setCompatibilityScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[botId] = matchData.compatibility.score;
        return newScores;
      });
  
      console.log(`Compatibility score for botId ${botId}:`, matchData.compatibility.score);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching compatibility score:`, error);
    }
  
    return updatedChat;
  }
  