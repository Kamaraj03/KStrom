import express from "express";
import Quote from "../models/Quote.js";

const router = express.Router();


// GET - Fetch the latest quote
router.get("/", async (req, res) => {
  try {
    const quote = await Quote.findOne().sort({ createdAt: -1 }); // Get the latest quote
    res.json(quote || {}); // Return empty object if no quote exists
  } catch (error) {
    res.status(500).json({ error: "Error fetching quote" });
  }
});

// POST - Add a new quote
router.post("/", async (req, res) => {
  try {
    const { text } = req.body;
    const newQuote = new Quote({ text });
    await newQuote.save();
    res.json(newQuote);
  } catch (error) {
    res.status(500).json({ error: "Error adding quote" });
  }
});

// PUT - Update an existing quote
router.put("/:id", async (req, res) => {
  try {
    const { text } = req.body;
    const updatedQuote = await Quote.findByIdAndUpdate(req.params.id, { text }, { new: true });
    res.json(updatedQuote);
  } catch (error) {
    res.status(500).json({ error: "Error updating quote" });
  }
});

// DELETE - Remove a quote
router.delete("/:id", async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.json({ message: "Quote deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting quote" });
  }
});

export default router;

