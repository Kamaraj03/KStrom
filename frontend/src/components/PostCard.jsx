import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../styles/components/PostCard.module.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PostCard = ({ post }) => {
  return (
    <motion.div
      className={styles.postCard}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Trending Badge */}
      {post.isTrending && <span className={styles.trendingBadge}>🔥 Trending</span>}

      {/* Post Image */}
      {post.imageUrl && <img src={`${API_BASE_URL}${post.imageUrl}`} alt={post.title} />}

      {/* Content */}
      <div className={styles.content}>
        <h2>{post.title}</h2>
        <p>{post.content.substring(0, 50)}...</p>
      </div>

      {/* Read More Button - Dynamic Routing */}
      <Link to={`/${post.type}/${post._id}`} className={styles.readMore}>
        Read More
      </Link>
    </motion.div>
  );
};

export default PostCard;

