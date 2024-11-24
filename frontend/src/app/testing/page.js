"use client";
import React, { useState } from "react";
import { genConvo } from "../../utils/genConvos";
import { useAppContext } from "../../context/AppContext";

export default function Page() {
  // Load context data
  const { bots, chatData, setChatData, userData } = useAppContext();
  const [conversation, setConversation] = useState([]); // Local state for conversation
  const [loading, setLoading] = useState(false); // Loading state
  const [botId, setBotId] = useState(0); // Default bot ID

  const handleConversation = async () => {
    console.log("Starting conversation with botId:", botId);
    console.log("Loaded bot data:", bots[botId]);
    console.log("Loaded user data:", userData);
    console.log("Loaded chat history:", chatData[botId]);

    setLoading(true);
    try {
      // Pass all necessary data to genConvo
      const convo = await genConvo(
        botId,
        bots[botId], // Pass specific bot's data
        chatData[botId], // Pass specific bot's chat history
        setChatData,
        userData // Pass user data
      );
      setConversation(convo); // Update local conversation state
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
        {conversation.length === 0 && !loading ? (
          <p>No conversation yet. Press the button to start!</p>
        ) : (
          <div>
            {conversation.map((message, index) => (
              <p key={index}>
                <strong>
                  {message.role === "assistant" ? bots[botId]?.name : "You"}:
                </strong>{" "}
                {message.content}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
