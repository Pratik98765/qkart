import "./styles.css";
import Register from "./register.js";
import Login from "./login.js";
import Product from "./products.js";
import Checkout from "./checkout.js";
import MyOrders from "./orders.js";
import { Routes, Route } from "react-router-dom";

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
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<MyOrders />} />
      </Routes>
    </div>
  );
}
