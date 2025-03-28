import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import "../styles/viewPage.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ViewPost = ({ type }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
    axios.get(`${API_BASE_URL}/api/${type}/${id}`).then((res) => {
      setPost(res.data);
      setLikes(res.data.likes || 0);
    });
  }, [id, type]);

  const handleLike = async () => {
    setLikes((prevLikes) => prevLikes + 1);
    await axios.put(`${API_BASE_URL}/api/${type}/${id}/like`, { likes: likes + 1 });
  };

  if (!post) return <p>Loading...</p>;

  return (
    <motion.div className="view-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="view-box">
        {post.imageUrl && <img src={`${API_BASE_URL}${post.imageUrl}`} alt={post.title} className="view-image" />}
        <h1 className="view-title">{post.title}</h1>
        <p className="view-content">{post.content}</p>

        <div className="interaction-box">
          <button className="icon-btn" onClick={handleLike}><FaHeart className="like-icon" /> {likes}</button>
          <div className="share-buttons">
            <FacebookShareButton url={currentUrl}><FaFacebook className="share-icon facebook" /></FacebookShareButton>
            <TwitterShareButton url={currentUrl}><FaTwitter className="share-icon twitter" /></TwitterShareButton>
            <WhatsappShareButton url={currentUrl}><FaWhatsapp className="share-icon whatsapp" /></WhatsappShareButton>
          </div>
        </div>

        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    </motion.div>
  );
};

export default ViewPost;

