import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now } // Add createdAt field
});

export default mongoose.model("Story", StorySchema);

