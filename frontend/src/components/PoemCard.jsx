import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "../styles/components/PoemCard.module.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PoemCard = ({ poem }) => {
  return (
    <motion.div
      className={styles.poemCard}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Trending Badge */}
      {poem.isTrending && <span className={styles.trendingBadge}>🔥 Trending</span>}

      {/* Poem Image */}
      {poem.imageUrl && <img src={`${API_BASE_URL}${poem.imageUrl}`} alt={poem.title} />}

      {/* Content */}
      <div className={styles.content}>
        <h2>{poem.title}</h2>
        <p>{poem.content.substring(0, 50)}...</p>
      </div>

      {/* Read More Button - Dynamic Routing */}
      <Link to={`/${poem.type}/${poem._id}`} className={styles.readMore}>
        Read More
      </Link>
    </motion.div>
  );
};

export default PoemCard;

