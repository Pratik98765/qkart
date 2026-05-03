import React, { useEffect, useState } from "react";
import Header from "./header.js";
import { Box, Button, CardActions, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Cart from "./cart";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // 1. Create the state for cart items
  const [cartItems, setCartItems] = useState([]);

  // 1. GET Function (Fetch cart from server)
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      const response = await axios.get(
        "https://fakestoreapi.com/carts/user/1",
        {
          // Using user 1 as an example
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Map the API data to match your Cart component's expected format
      const formattedCart = response.data.products.map((p) => ({
        productId: p.productId,
        qty: p.quantity,
      }));
      setCartItems(formattedCart);
    } catch (e) {
      console.error("Could not fetch cart", e);
    }
  };

  // 2. POST Function (Update cart on server)
  const updateCartApi = async (productId, qty) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        "https://fakestoreapi.com/carts",
        {
          userId: 1,
          date: new Date(),
          products: [{ productId, quantity: qty }],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (e) {
      console.error("Could not update cart on server", e);
    }
  };

  // 2. Define the function to handle adding items
  // 1. Update the addToCart logic to use 'productId'
  const addToCart = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to the cart");
      return;
    }

    // Local state update (immediate UI feedback)
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.productId === product.id
      );
      let newItems;

      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item
        );
        // API call to update quantity
        updateCartApi(product.id, existingItem.qty + 1);
      } else {
        newItems = [...prevItems, { productId: product.id, qty: 1 }];
        // API call to add new item
        updateCartApi(product.id, 1);
      }
      return newItems;
    });
  };

 
  const token = true; // 🔥 TEMP (replace with real auth)

  const list = async (searchTerm = "") => {
    try {
      setLoading(true);
      const response = await axios.get("https://fakestoreapi.com/products");
      let allProducts = response.data;

      if (searchTerm) {
        allProducts = allProducts.filter((product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setProducts(allProducts);
    } catch (error) {
      console.log("fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      // 1. Fetch products first
      await list();

      // 2. Get real token and fetch the cart
      const token = localStorage.getItem("token");
      if (token) {
        await fetchCart(token);
      }
    };

    onLoad();
  }, []);

  // 🔹 Only product grid here
  const renderProducts = () => (
    <Grid container sx={{ marginTop: 4 }} spacing={2}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={3} key={product.id}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="200"
              image={product.image}
              alt={product.title}
              sx={{ objectFit: "contain" }}
            />
            <CardContent>
              <Typography variant="h6" noWrap>
                {product.title}
              </Typography>
              <Typography variant="body2">₹ {product.price}</Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<ShoppingCartOutlined />}
                onClick={() => addToCart(product)} // This calls the function below
              >
                ADD TO CART
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      {/* ✅ Render ONCE */}
      <Header performSearch={list} />

      <Box
        component="img"
        src="https://miro.medium.com/v2/resize:fit:870/1*i-E6kKQ0qSPisgKa0i-JYA.png"
        sx={{ width: "100%", height: "400px", objectFit: "fill" }}
      />

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <Grid container>
          {token ? (
            <>
              <Grid item xs={12} md={9}>
                {renderProducts()}
              </Grid>

              <Grid
                item
                xs={12}
                md={3}
                sx={{ bgcolor: "#E9F5E1", minHeight: "100vh" }}
              >
                <Cart products={products} items={cartItems} />
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              {renderProducts()}
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
};

export default Product;
