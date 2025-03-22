import express from "express";
import Comment from "../models/Comment.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    res.status(201).json({ message: "Comment added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment." });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

export default router;

