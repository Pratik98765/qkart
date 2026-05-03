import "./styles.css";
import Register from "./register.js";
import Login from "./login.js";
import Product from "./products.js";
import Header from "./header";
import { Routes, Route, Link } from "react-router-dom";

export const config = {
  endpoint: "https://qkart-frontend.onrender.com/api/v1", // Fixed: Added quotes
};

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
