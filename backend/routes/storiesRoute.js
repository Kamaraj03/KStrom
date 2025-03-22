import express from "express";
import Story from "../models/Story.js";

const router = express.Router();

// ✅ Get all stories
router.get("/", async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stories", error });
  }
});

// ✅ Get a single story by ID
router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: "Error fetching story", error });
  }
});

// ✅ Add a new story
router.post("/", async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newStory = new Story({ title, content, imageUrl, likes: 0, comments: [] });
    await newStory.save();
    res.json(newStory);
  } catch (error) {
    res.status(500).json({ message: "Error adding story", error });
  }
});

// ✅ Update a story by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      { title, content, imageUrl },
      { new: true }
    );
    if (!updatedStory) return res.status(404).json({ message: "Story not found" });

    res.json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: "Error updating story", error });
  }
});

// ✅ Delete a story by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);
    if (!deletedStory) return res.status(404).json({ message: "Story not found" });

    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting story", error });
  }
});

// ✅ Like a story
router.put("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    story.likes = (story.likes || 0) + 1;
    await story.save();

    res.json({ message: "Story liked!", likes: story.likes });
  } catch (error) {
    res.status(500).json({ message: "Error liking story", error });
  }
});

// ✅ Add a comment to a story
router.post("/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const newComment = { text };
    story.comments.push(newComment);
    await story.save();

    res.json({ message: "Comment added!", comments: story.comments });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

export default router;

