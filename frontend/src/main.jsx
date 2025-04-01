import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import ViewPoem from "./pages/ViewPoem";
import ViewStory from "./pages/ViewStory";
import AdminPanel from "./pages/AdminPanel";
import "./index.css";
import "./styles/global.scss";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/poem/:id" element={<ViewPoem />} />
        <Route path="/story/:id" element={<ViewStory />} />
        <Route path="/vanakkam" element={<AdminPanel />} />
      </Routes>
    </AnimatePresence>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AnimatedRoutes />
    </Router>
  </React.StrictMode>
);

