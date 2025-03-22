import express from "express";
import Poem from "../models/Poem.js";

const router = express.Router();

// ✅ Get all poems
router.get("/", async (req, res) => {
  try {
    const poems = await Poem.find();
    res.json(poems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching poems", error });
  }
});

// ✅ Get a single poem by ID
router.get("/:id", async (req, res) => {
  try {
    const poem = await Poem.findById(req.params.id);
    if (!poem) return res.status(404).json({ message: "Poem not found" });
    res.json(poem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching poem", error });
  }
});

// ✅ Add a new poem
router.post("/", async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newPoem = new Poem({ title, content, imageUrl, likes: 0, comments: [] });
    await newPoem.save();
    res.json(newPoem);
  } catch (error) {
    res.status(500).json({ message: "Error adding poem", error });
  }
});

// ✅ Update a poem by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const updatedPoem = await Poem.findByIdAndUpdate(
      req.params.id,
      { title, content, imageUrl },
      { new: true }
    );
    if (!updatedPoem) return res.status(404).json({ message: "Poem not found" });

    res.json(updatedPoem);
  } catch (error) {
    res.status(500).json({ message: "Error updating poem", error });
  }
});

// ✅ Delete a poem by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedPoem = await Poem.findByIdAndDelete(req.params.id);
    if (!deletedPoem) return res.status(404).json({ message: "Poem not found" });

    res.json({ message: "Poem deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting poem", error });
  }
});

// ✅ Like a poem
router.put("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const poem = await Poem.findById(id);

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    poem.likes = (poem.likes || 0) + 1;
    await poem.save();

    res.json({ message: "Poem liked!", likes: poem.likes });
  } catch (error) {
    res.status(500).json({ message: "Error liking poem", error });
  }
});

// ✅ Add a comment to a poem
router.post("/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const poem = await Poem.findById(id);

    if (!poem) {
      return res.status(404).json({ message: "Poem not found" });
    }

    const newComment = { text };
    poem.comments.push(newComment);
    await poem.save();

    res.json({ message: "Comment added!", comments: poem.comments });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

export default router;

