
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
  const [cartItems, setCartItems] = useState([]);

  // Get token and username
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "guest";

  // 1. GET Function - Fetch cart from server
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      const response = await axios.get(
        "https://fakestoreapi.com/carts/user/1",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedCart = response.data.products.map((p) => ({
        productId: p.productId,
        qty: p.quantity,
      }));

      setCartItems(formattedCart);

      // Save fetched cart locally
      localStorage.setItem(
        `cart_${username}`,
        JSON.stringify(formattedCart)
      );
    } catch (e) {
      console.error("Could not fetch cart", e);
    }
  };

  // 2. POST Function - Update cart on server
  const updateCartApi = async (productId, qty) => {
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

  // 3. Handle quantity changes
  const handleQuantity = (productId, newQty) => {
    let updatedItems;

    if (newQty === 0) {
      updatedItems = cartItems.filter(
        (item) => item.productId !== productId
      );
    } else {
      updatedItems = cartItems.map((item) =>
        item.productId === productId
          ? { ...item, qty: newQty }
          : item
      );
    }

    setCartItems(updatedItems);

    localStorage.setItem(
      `cart_${username}`,
      JSON.stringify(updatedItems)
    );

    updateCartApi(productId, newQty);
  };

  // 4. Add product to cart
  const addToCart = (product) => {
    if (!token) {
      alert("Please login to add items to the cart");
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.productId === product.id
    );

    let newItems;

    if (existingItem) {
      newItems = cartItems.map((item) =>
        item.productId === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      );

      updateCartApi(product.id, existingItem.qty + 1);
    } else {
      newItems = [
        ...cartItems,
        { productId: product.id, qty: 1 },
      ];

      updateCartApi(product.id, 1);
    }

    setCartItems(newItems);

    localStorage.setItem(
      `cart_${username}`,
      JSON.stringify(newItems)
    );
  };

  // 5. Fetch and search products
  const list = async (searchTerm = "") => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://fakestoreapi.com/products"
      );

      let allProducts = response.data;

      if (searchTerm) {
        allProducts = allProducts.filter((product) =>
          product.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }

      setProducts(allProducts);
    } catch (error) {
      console.log("fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  // 6. Load products and cart when component loads
  useEffect(() => {
    const onLoad = async () => {
      await list();

      const savedCart = localStorage.getItem(`cart_${username}`);

      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Invalid saved cart data", error);
          localStorage.removeItem(`cart_${username}`);
        }
      } else if (token) {
        await fetchCart(token);
      }
    };

    onLoad();
  }, [username, token]);

  // 7. Display products
  const renderProducts = () => (
    <Grid container sx={{ marginTop: 4 }} spacing={2}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={3} key={product.id}>
          <Card sx={{ maxWidth: 345, height: "100%" }}>
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

              <Typography variant="body2">
                ₹ {product.price}
              </Typography>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<ShoppingCartOutlined />}
                onClick={() => addToCart(product)}
              >
                ADD TO CART
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // 8. Main UI
  return (
    <>
      <Header performSearch={list} />

      <Box
        component="img"
        src="https://miro.medium.com/v2/resize:fit:870/1*i-E6kKQ0qSPisgKa0i-JYA.png"
        alt="QKart banner"
        sx={{
          width: "100%",
          height: { xs: "200px", sm: "280px", md: "350px", lg: "400px" },
          objectFit: "fill",
          display: "block",
        }}
      />

      {loading ? (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          Loading...
        </Typography>
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
                sx={{
                  bgcolor: "#E9F5E1",
                  minHeight: "100vh",
                }}
              >
                <Cart
                  products={products}
                  items={cartItems}
                  handleQuantity={handleQuantity}
                />
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
