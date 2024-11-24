"use client";
import React, { useState } from "react";
import { genFullConvo } from "../../utils/genConvos";
import { useAppContext } from "../../context/AppContext";

export default function Page() {
  // Load context data
  const { bots, chatData, setChatData, userData, compatibilityScores, setCompatibilityScores, read, setRead  } = useAppContext(); // Access bots, chat data, and user data from context
  const [loading, setLoading] = useState(false); // Loading state
  const [botId, setBotId] = useState(0); // Default bot ID

  const handleConversation = async () => {
    console.log("Starting conversation with botId:", botId);
    console.log("Loaded bot data:", bots[botId]);
    console.log("Loaded user data:", userData);
    console.log("Loaded chat history:", chatData[botId]);

    setLoading(true);
    try {
      // Pass all necessary data to genFullConvo
      await genFullConvo(
        botId,
        bots[botId], // Pass specific bot's data
        chatData[botId], // Pass specific bot's chat history
        setChatData,
        userData, // Pass user data
        setCompatibilityScores, // Pass setCompatibilityScores
        compatibilityScores // Pass compatibilityScores
      );      
    } catch (error) {
      console.error("Error generating conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Chat with {bots[botId]?.name || "a bot"}</h1>
      <button
        onClick={handleConversation}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Loading..." : `Talk to ${bots[botId]?.name || "Bot"}`}
      </button>
      <div style={{ marginTop: "20px", fontSize: "16px" }}>
        <h2>Conversation:</h2>
        {chatData[botId]?.length === 0 && !loading ? (
          <p>No conversation yet. Press the button to start!</p>
        ) : (
          <div>
            {chatData[botId]?.map(([content, role], index) => (
              <p key={index}>
                <strong>{role === "user" ? userData.name : bots[botId]?.name}:</strong>{" "}
                {content}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
