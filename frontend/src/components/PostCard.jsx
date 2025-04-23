import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../styles/components/PostCard.module.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY); // Save scroll position
    navigate(`/${post.type}/${post._id}`); // Navigate to detail page
  };

  return (
    <motion.div
      className={styles.postCard}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {post.isTrending && <span className={styles.trendingBadge}>🔥 Trending</span>}

      {post.imageUrl && <img src={`${API_BASE_URL}${post.imageUrl}`} alt={post.title} />}

      <div className={styles.content}>
        <h2>{post.title}</h2>
        <p>{post.content.substring(0, 50)}...</p>
      </div>

      <button onClick={handleReadMore} className={styles.readMore}>
        Read More...
      </button>
    </motion.div>
  );
};

export default PostCard;

