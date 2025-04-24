import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import "../styles/home.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


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

        // Include type (poem or story) and sort by createdAt in descending order
        const poemsWithType = poemsRes.data.map(poem => ({ ...poem, type: "poem" }));
        const storiesWithType = storiesRes.data.map(story => ({ ...story, type: "story" }));

        // Combine both poems and stories and sort by createdAt (latest first)
        const allPosts = [...poemsWithType, ...storiesWithType].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setPosts(allPosts);

        const storedView = sessionStorage.getItem("lastView");
        if (storedView) setView(storedView);

        // ✅ Scroll restoration
        const savedScroll = sessionStorage.getItem("scrollPosition");
        if (savedScroll) {
          setTimeout(() => {
            window.scrollTo(0, parseInt(savedScroll));
            sessionStorage.removeItem("scrollPosition");
          }, 100);
        }
      } catch (err) {
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewChange = (newView) => {
    setView(newView);
    sessionStorage.setItem("lastView", newView);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingPosts = filteredPosts.filter(
    post => post.likes > 50 || (post.comments && post.comments.length > 5)
  );
  const filteredPoems = filteredPosts.filter(post => post.type === "poem");
  const filteredStories = filteredPosts.filter(post => post.type === "story");

  return (
    <div
      className="home-container"
      style={{
        backgroundImage: "url('/images/forest-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        textAlign: "center",
        position: "relative",
        zIndex: "1",
      }}
    >
      <div className="overlay"></div>

      <h1 className="title">
        உணர்வுகள் பேசும் இடம் <span className="kstrom">KStrom</span>
      </h1>
      <p className="subtitle">"A place where emotions speak"</p>

      <div className="search-toggle-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search poems and stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>

        <div className="toggle-buttons">
          <button className={view === "poems" ? "active" : ""} onClick={() => handleViewChange("poems")}>
            கவிதைகள்
          </button>
          <button className={view === "stories" ? "active" : ""} onClick={() => handleViewChange("stories")}>
            சிறு கதைகள்
          </button>
          <button className={view === "trending" ? "active" : ""} onClick={() => handleViewChange("trending")}>
            🔥 பிரபலமானவை
          </button>
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

