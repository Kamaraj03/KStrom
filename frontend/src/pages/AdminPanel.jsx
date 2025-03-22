import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminpanel.scss"; // ✅ Ensure correct SCSS import

const API_BASE_URL = "http://localhost:5000"; // Adjust if needed

const AdminPanel = () => {
  const [poems, setPoems] = useState([]);
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [type, setType] = useState("poem"); // "poem" or "story"
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPoems, setShowPoems] = useState(true); // Toggle for showing Poems or Stories

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [poemRes, storyRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/poems`),
        axios.get(`${API_BASE_URL}/api/stories`),
      ]);
      setPoems(poemRes.data);
      setStories(storyRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = "";
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const imageRes = await axios.post(`${API_BASE_URL}/upload`, formData);
        imageUrl = imageRes.data.imageUrl;
      }

      const postData = { title, content, imageUrl };
      const endpoint = `${API_BASE_URL}/api/${type === "story" ? "stories" : "poems"}`;

      if (editingId) {
        await axios.put(`${endpoint}/${editingId}`, postData);
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
      } else {
        await axios.post(endpoint, postData);
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error(`Error adding/updating ${type}:`, error.response ? error.response.data : error);
      alert(`Failed to add/update ${type}.`);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImage(null);
    document.getElementById("image").value = "";
    setEditingId(null);
  };

  const handleEdit = (item, itemType) => {
    setTitle(item.title);
    setContent(item.content);
    setType(itemType);
    setEditingId(item._id);
  };

  const handleDelete = async (id, itemType) => {
    if (window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/${itemType === "story" ? "stories" : "poems"}/${id}`);
        alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully!`);
        fetchData();
      } catch (error) {
        console.error(`Error deleting ${itemType}:`, error.response ? error.response.data : error);
        alert(`Failed to delete ${itemType}.`);
      }
    }
  };

  return (
    <div className="admin-panel">
      <h2 className="admin-panel__title">
        {editingId ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}` : "Add New Poem or Story"}
      </h2>

      <form onSubmit={handleSubmit} className="admin-panel__form">
        <label htmlFor="postType">Post Type:</label>
        <select id="postType" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="poem">Poem</option>
          <option value="story">Story</option>
        </select>

        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label htmlFor="content">Content:</label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>

        <label htmlFor="image">Upload Image:</label>
        <input type="file" id="image" onChange={handleFileChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Toggle buttons for poems and stories */}
      <div className="admin-panel__toggle">
        <button onClick={() => setShowPoems(true)} className={showPoems ? 'active' : ''}>Show Poems</button>
        <button onClick={() => setShowPoems(false)} className={!showPoems ? 'active' : ''}>Show Stories</button>
      </div>

     
      <ul className="admin-panel__list">
        {(showPoems ? poems : stories).map((item) => (
          <li key={item._id} className="admin-panel__item">
            <h3>{item.title}</h3>
            <p>{item.content.substring(0, 100)}...</p>
            <button onClick={() => handleEdit(item, showPoems ? "poem" : "story")}>Edit</button>
            <button onClick={() => handleDelete(item._id, showPoems ? "poem" : "story")}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;

