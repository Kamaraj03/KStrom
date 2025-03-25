import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema({
  text: { type: String, required: true }, // The quote text
  createdAt: { type: Date, default: Date.now } // Timestamp for reference
});

export default mongoose.model("Quote", QuoteSchema);

