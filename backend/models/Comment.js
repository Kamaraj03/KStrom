import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  content: { type: String, required: true },
});

export default mongoose.model("Comment", CommentSchema);

