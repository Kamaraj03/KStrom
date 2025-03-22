import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPoem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/poems/${id}`)
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setExistingImage(res.data.imageUrl);
      })
      .catch((err) => console.error("Error fetching poem:", err));
  }, [id]);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = existingImage;

      // Upload new image if changed
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const imageRes = await axios.post("http://localhost:5000/upload", formData);
        imageUrl = imageRes.data.imageUrl;
      }

      await axios.put(`http://localhost:5000/api/poems/${id}`, {
        title,
        content,
        imageUrl,
      });

      alert("Poem updated successfully!");
      navigate("/admin"); // Redirect back to Admin Panel
    } catch (error) {
      console.error("Error updating poem:", error);
      alert("Failed to update poem.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Poem</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          className="border p-2 w-full mb-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        {existingImage && (
          <img
            src={`http://localhost:5000${existingImage}`}
            alt="Poem"
            className="w-full h-40 object-cover rounded mb-2"
          />
        )}
        <input type="file" className="border p-2 w-full mb-2" onChange={handleFileChange} />
        <button className="bg-green-500 text-white p-2 w-full">Update Poem</button>
      </form>
    </div>
  );
};

export default EditPoem;

