import React, { useEffect, useState } from "react";
import axios from "axios";
import PoemCard from "../components/PoemCard";
import StoryCard from "../components/StoryCard";
import { motion } from "framer-motion";
import "../styles/home.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const [poems, setPoems] = useState([]);
  const [stories, setStories] = useState([]);
  const [view, setView] = useState("poems");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const poemsRes = await axios.get(`${API_BASE_URL}/api/poems`);
        const storiesRes = await axios.get(`${API_BASE_URL}/api/stories`);
        
        // Ensure each post has a type
        const poemsWithType = poemsRes.data.map(poem => ({ ...poem, type: "poem" }));
        const storiesWithType = storiesRes.data.map(story => ({ ...story, type: "story" }));
        
        setPoems(poemsWithType);
        setStories(storiesWithType);
      } catch (err) {
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Trending Logic: Filter posts with more than 10 likes OR 5+ comments
  const trendingPosts = [...poems, ...stories].filter(post => post.likes > 10 || (post.comments && post.comments.length > 5));

  // Filtered posts based on search query
  const filteredPoems = poems.filter(poem => poem.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredStories = stories.filter(story => story.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTrending = trendingPosts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="home-container">
      <h1 className="title">Welcome to KStrom</h1>
      <p className="subtitle"> "கவிதைகளும் கதைகளும்... உங்கள் மனதை வருட வரவேற்கின்றன!"</p>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search poems and stories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button className={view === "poems" ? "active" : ""} onClick={() => setView("poems")}>
          கவிதைகள்
        </button>
        <button className={view === "stories" ? "active" : ""} onClick={() => setView("stories")}>
          சிறு கதைகள்
        </button>
        <button className={view === "trending" ? "active" : ""} onClick={() => setView("trending")}>
          🔥 பிரபலமானவை
        </button>
      </div>

      {/* Loading & Error Messages */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <motion.div className="grid-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {view === "poems"
            ? filteredPoems.map((poem) => <PoemCard key={poem._id} poem={poem} />)
            : view === "stories"
            ? filteredStories.map((story) => <StoryCard key={story._id} story={story} />)
            : filteredTrending.map(post =>
                post.type === "poem" ? <PoemCard key={post._id} poem={post} /> : <StoryCard key={post._id} story={post} />
              )}
        </motion.div>
      )}
    </div>
  );
};

export default Home;

