import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import "../styles/home.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("poems");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poemsRes, storiesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/poems`),
          axios.get(`${API_BASE_URL}/api/stories`),
        ]);

        const poemsWithType = poemsRes.data.map(poem => ({ ...poem, type: "poem" }));
        const storiesWithType = storiesRes.data.map(story => ({ ...story, type: "story" }));

        setPosts([...poemsWithType, ...storiesWithType]);

        // Retain last view after clicking back
        const storedView = sessionStorage.getItem("lastView");
        if (storedView) setView(storedView);
      } catch (err) {
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Store the last view before navigating
  const handleViewChange = (newView) => {
    setView(newView);
    sessionStorage.setItem("lastView", newView);
  };

  // Filtering Data
  const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const trendingPosts = filteredPosts.filter(post => post.likes > 10 || (post.comments && post.comments.length > 5));
  const filteredPoems = filteredPosts.filter(post => post.type === "poem");
  const filteredStories = filteredPosts.filter(post => post.type === "story");

  return (
    <div className="home-container" style={{
      backgroundImage: "url('/images/forest-bg.webp')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      position: "relative",
      zIndex: "1",
    }}>
      <div className="overlay"></div>{/* Background Overlay for better text visibility */}
      <h1 className="title"> உணர்வுகள் பேசும் இடம் <span className="kstrom"> KStrom</span></h1>
      <p className="subtitle"> "A place where emotions speak"</p>

      {/* Search Bar */}
      <div className="search-toggle-container">
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
          <button className={view === "poems" ? "active" : ""} onClick={() => handleViewChange("poems")}>கவிதைகள்</button>
          <button className={view === "stories" ? "active" : ""} onClick={() => handleViewChange("stories")}>சிறு கதைகள்</button>
          <button className={view === "trending" ? "active" : ""} onClick={() => handleViewChange("trending")}>🔥 பிரபலமானவை</button>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <motion.div className="grid-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {(view === "poems" && filteredPoems.map(post => <PostCard key={post._id} post={post} />)) ||
          (view === "stories" && filteredStories.map(post => <PostCard key={post._id} post={post} />)) ||
          (view === "trending" && trendingPosts.map(post => <PostCard key={post._id} post={post} />))}
        </motion.div>
      )}
    </div>
  );
};

export default Home;

