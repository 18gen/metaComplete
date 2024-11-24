"use client";
import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [userData, setUserData] = useState({
    name: "Ada Lovelace",
    profilePicture: "ada_lovelace.png",
    personality: {
      summary:
        "Visionary and analytical, combining creativity with logic to pioneer new ideas.",
      energyStyle: "Introvert",
      cognitiveStyle: "Intuitive",
      valuesStyle: "Thinkers",
      lifeStyle: "Judgers",
    },
    twitter:
      "Shares insights about mathematics, technology, and the future of computation.",
    instagram: "Posts elegant hand-written notes and diagrams of algorithms.",
    linkedin: "Discusses the importance of innovation and women in technology.",
    facebook:
      "Engages with stories about advancements in programming and historical figures in science.",
    hobbies: "Writing algorithms, reading literature, solving puzzles.",
    job: "Mathematician and first computer programmer.",
    interests:
      "Programming, mathematics, innovation, women's empowerment in STEM.",
  });

  const [bots, setBots] = useState([
    {
      name: "Marie Curie",
      profilePicture: "marie_curie.png",
      personality: {
        summary: "Empathetic visionary focused on scientific discoveries.",
        energyStyle: "Introvert",
        cognitiveStyle: "Intuitive",
        valuesStyle: "Feelers",
        lifeStyle: "Judgers",
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
      profilePicture: "albert_einstein.png",
      personality: {
        summary: "Curious innovator who loves tackling theoretical challenges.",
        energyStyle: "Introvert",
        cognitiveStyle: "Intuitive",
        valuesStyle: "Thinkers",
        lifeStyle: "Perceivers",
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
      profilePicture: "oprah_winfrey.png",
      personality: {
        summary:
          "Charismatic motivator who inspires self-growth and empowerment.",
        energyStyle: "Extravert",
        cognitiveStyle: "Intuitive",
        valuesStyle: "Feelers",
        lifeStyle: "Judgers",
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
      profilePicture: "leonardo_da_vinci.png",
      personality: {
        summary: "Strategic planner with a passion for art and invention.",
        energyStyle: "Introvert",
        cognitiveStyle: "Intuitive",
        valuesStyle: "Thinkers",
        lifeStyle: "Judgers",
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
      profilePicture: "serena_williams.png",
      personality: {
        summary:
          "Confident leader who values structure and discipline in sports.",
        energyStyle: "Extravert",
        cognitiveStyle: "Sensors",
        valuesStyle: "Thinkers",
        lifeStyle: "Judgers",
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
      profilePicture: "stephen_hawking.png",
      personality: {
        summary: "Visionary problem solver passionate about cosmology.",
        energyStyle: "Introvert",
        cognitiveStyle: "Intuitive",
        valuesStyle: "Thinkers",
        lifeStyle: "Perceivers",
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
      profilePicture: "frida_kahlo.png",
      personality: {
        summary:
          "Artistic and sensitive, exploring creativity and self-expression.",
        energyStyle: "Introvert",
        cognitiveStyle: "Sensors",
        valuesStyle: "Feelers",
        lifeStyle: "Perceivers",
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
      profilePicture: "nikola_tesla.png",
      personality: {
        summary: "Curious innovator driven by futuristic inventions.",
        energyStyle: "Extravert",
        cognitiveStyle: "Intuitive",
        valuesStyle: "Thinkers",
        lifeStyle: "Perceivers",
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

  const [chatData, setChatData] = useState([
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ]);

  const value = {
    userData,
    setUserData,
    bots,
    setBots,
    chatData,
    setChatData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
