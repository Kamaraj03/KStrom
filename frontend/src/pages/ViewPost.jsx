import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaHeart, FaComment, FaShareAlt } from "react-icons/fa";
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton 
} from "react-share";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa"; // Correct Icons
import "../styles/viewPage.scss"; // Import SCSS styles

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ViewPost = ({ type }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false); // Toggle Comment Box

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/${type}/${id}`).then((res) => {
      setPost(res.data);
      setLikes(res.data.likes || 0);
      setComments(res.data.comments || []);
    });
  }, [id, type]);

  // Handle Like
  const handleLike = async () => {
    const updatedLikes = likes + 1;
    setLikes(updatedLikes);
    await axios.put(`${API_BASE_URL}/api/${type}/${id}/like`, { likes: updatedLikes });
  };

  // Handle Comment Submission
  const handleComment = async () => {
    if (!commentText.trim()) return;
    const newComment = { text: commentText };
    const updatedComments = [...comments, newComment];

    setComments(updatedComments);
    setCommentText("");

    await axios.post(`${API_BASE_URL}/api/${type}/${id}/comment`, newComment);
  };

  if (!post) return <p>Loading...</p>;

  return (
    <motion.div className="view-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="view-box">
        {post.imageUrl && <img src={`${API_BASE_URL}${post.imageUrl}`} alt={post.title} className="view-image" />}
        <h1 className="view-title">{post.title}</h1>
        <p className="view-content">{post.content}</p>

        {/* Like, Comment, Share Section */}
        <div className="interaction-box">
          <button className="icon-btn" onClick={handleLike}>
            <FaHeart className="like-icon" /> {likes}
          </button>

          <button className="icon-btn" onClick={() => setShowCommentInput(!showCommentInput)}>
            <FaComment className="comment-icon" />
          </button>

          <div className="share-buttons">
            <FacebookShareButton url={window.location.href}>
              <FaFacebook className="share-icon facebook" />
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href}>
              <FaTwitter className="share-icon twitter" />
            </TwitterShareButton>
            <WhatsappShareButton url={window.location.href}>
              <FaWhatsapp className="share-icon whatsapp" />
            </WhatsappShareButton>
          </div>
        </div>

        {/* Comment Input Box */}
        {showCommentInput && (
          <div className="comment-section">
            <textarea
              placeholder="Write a comment..."
              className="comment-box"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="submit-comment" onClick={handleComment}>Comment</button>
          </div>
        )}

        {/* Display Comments */}
        <div className="comments-section">
          {comments.map((comment, index) => (
            <p key={index} className="comment">{comment.text}</p>
          ))}
        </div>

        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    </motion.div>
  );
};

export default ViewPost;

