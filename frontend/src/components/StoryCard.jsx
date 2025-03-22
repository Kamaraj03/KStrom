import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../styles/components/StoryCard.module.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StoryCard = ({ story }) => {
  return (
    <motion.div
      className={styles.storyCard}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Trending Badge */}
      {story.isTrending && <span className={styles.trendingBadge}>🔥 Trending</span>}

      {/* Story Image */}
      {story.imageUrl && <img src={`${API_BASE_URL}${story.imageUrl}`} alt={story.title} />}

      {/* Content */}
      <div className={styles.content}>
        <h2>{story.title}</h2>
        <p>{story.content.substring(0, 50)}...</p>
      </div>

      {/* Read More Button - Dynamic Routing */}
      <Link to={`/${story.type}/${story._id}`} className={styles.readMore}>
        Read More
      </Link>
    </motion.div>
  );
};

export default StoryCard;

