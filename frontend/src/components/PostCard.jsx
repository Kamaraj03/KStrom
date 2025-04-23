import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../styles/components/PostCard.module.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const readPosts = JSON.parse(sessionStorage.getItem("readPosts") || "[]");
    setIsNew(!readPosts.includes(post._id));
  }, [post._id]);

  const handleReadMore = () => {
    const readPosts = JSON.parse(sessionStorage.getItem("readPosts") || "[]");
    if (!readPosts.includes(post._id)) {
      readPosts.push(post._id);
      sessionStorage.setItem("readPosts", JSON.stringify(readPosts));
    }

    sessionStorage.setItem("scrollPosition", window.scrollY); // Save scroll position
    navigate(`/${post.type}/${post._id}`);
  };

  return (
    <motion.div
      className={styles.postCard}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {post.isTrending && <span className={styles.trendingBadge}>Trending</span>}
      {isNew && <span className={styles.newBadge}>New</span>}

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

