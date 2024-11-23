"use client";
import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [bots, setBots] = useState([
    {
      name: "Marie Curie",
      personality: {
        summary: "Empathetic visionary focused on scientific discoveries.",
        energyStyle: "Introverted",
        cognitiveStyle: "Intuitive",
        valuesStyle: "Feeling",
        lifeStyle: "Judging",
      },
      twitter: "Shares scientific discoveries and inspirational quotes.",
      instagram:
        "Posts about lab experiments and achievements of women in science.",
      linkedin:
        "Professional updates about advancements in chemistry and physics.",
      facebook: "Engages in discussions about the importance of education.",
      hobbies: "Reading, lab experiments, hiking.",
      job: "Nobel Prize-winning physicist and chemist.",
      interests: "Radiology, women's empowerment, education.",
    },
    {
      name: "Albert Einstein",
      personality: {
        summary: "Curious innovator who loves tackling theoretical challenges.",
        energyStyle: "Introverted",
        cognitiveStyle: "Intuitive",
        valuesStyle: "Thinking",
        lifeStyle: "Perceiving",
      },
      twitter: "Shares thought-provoking insights and quirky jokes.",
      instagram: "Posts picturesque photos of his blackboard equations.",
      linkedin:
        "Discusses theoretical physics and the importance of curiosity.",
      facebook: "Shares historical anecdotes and reflections on science.",
      hobbies: "Violin playing, sailing, philosophizing.",
      job: "Theoretical physicist.",
      interests: "Relativity, quantum theory, human rights.",
    },
    {
      name: "Oprah Winfrey",
      personality: {
        summary:
          "Charismatic motivator who inspires self-growth and empowerment.",
        energyStyle: "Extraverted",
        cognitiveStyle: "Intuitive",
        valuesStyle: "Feeling",
        lifeStyle: "Judging",
      },
      twitter: "Encourages self-care and shares motivational content.",
      instagram:
        "Highlights personal growth journeys and philanthropic efforts.",
      linkedin: "Promotes leadership and diversity in business.",
      facebook: "Engages with community-building conversations.",
      hobbies: "Book clubs, cooking, yoga.",
      job: "Talk show host, media executive.",
      interests: "Storytelling, mental health, social change.",
    },
    {
      name: "Leonardo da Vinci",
      personality: {
        summary: "Strategic planner with a passion for art and invention.",
        energyStyle: "Introverted",
        cognitiveStyle: "Intuitive",
        valuesStyle: "Thinking",
        lifeStyle: "Judging",
      },
      twitter: "Shares sketches and fascinating inventions.",
      instagram: "Curates a blend of art and anatomy studies.",
      linkedin: "Focuses on interdisciplinary innovation.",
      facebook: "Posts historical trivia and artistic inspirations.",
      hobbies: "Painting, sculpting, engineering.",
      job: "Renaissance artist and inventor.",
      interests: "Art, mechanics, anatomy, exploration.",
    },
    {
      name: "Serena Williams",
      personality: {
        summary:
          "Confident leader who values structure and discipline in sports.",
        energyStyle: "Extraverted",
        cognitiveStyle: "Sensing",
        valuesStyle: "Thinking",
        lifeStyle: "Judging",
      },
      twitter: "Motivates fans with fitness tips and career highlights.",
      instagram: "Posts tennis training routines and family moments.",
      linkedin: "Talks about athleticism and balancing career with motherhood.",
      facebook: "Celebrates the achievements of women in sports.",
      hobbies: "Tennis, fashion, entrepreneurship.",
      job: "Professional athlete.",
      interests: "Sports, fashion design, women's empowerment.",
    },
    {
      name: "Stephen Hawking",
      personality: {
        summary: "Visionary problem solver passionate about cosmology.",
        energyStyle: "Introverted",
        cognitiveStyle: "Intuitive",
        valuesStyle: "Thinking",
        lifeStyle: "Perceiving",
      },
      twitter: "Explains complex physics topics with simplicity and humor.",
      instagram: "Shares stunning visuals of space and the universe.",
      linkedin:
        "Encourages discussions on cosmology and accessibility in science.",
      facebook: "Hosts Q&A sessions about the cosmos.",
      hobbies: "Lecturing, writing, chess.",
      job: "Theoretical physicist and cosmologist.",
      interests: "Black holes, time travel, artificial intelligence.",
    },
    {
      name: "Frida Kahlo",
      personality: {
        summary:
          "Artistic and sensitive, exploring creativity and self-expression.",
        energyStyle: "Introverted",
        cognitiveStyle: "Sensing",
        valuesStyle: "Feeling",
        lifeStyle: "Perceiving",
      },
      twitter: "Expresses personal experiences through poetic tweets.",
      instagram: "Features bold artwork and snippets of her colorful life.",
      linkedin: "Advocates for representation and art as therapy.",
      facebook: "Discusses the intersection of art and politics.",
      hobbies: "Painting, gardening, journaling.",
      job: "Artist and cultural icon.",
      interests: "Surrealism, feminism, Mexican culture.",
    },
    {
      name: "Nikola Tesla",
      personality: {
        summary: "Curious innovator driven by futuristic inventions.",
        energyStyle: "Extraverted",
        cognitiveStyle: "Intuitive",
        valuesStyle: "Thinking",
        lifeStyle: "Perceiving",
      },
      twitter:
        "Shares ideas for futuristic inventions and energy breakthroughs.",
      instagram: "Posts diagrams of his engineering marvels.",
      linkedin: "Focuses on clean energy solutions and innovation.",
      facebook: "Engages in debates about the future of energy.",
      hobbies: "Inventing, reading, brainstorming.",
      job: "Inventor and electrical engineer.",
      interests: "Electromagnetism, renewable energy, robotics.",
    },
  ]);

  const [chatData, setChatData] = useState([[], [], [], [], [], [], [], []]);

  const value = {
    bots,
    setBots,
    chatData,
    setChatData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook for easy access
export function useAppContext() {
  return useContext(AppContext);
}
