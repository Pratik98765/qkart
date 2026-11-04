import React, { useEffect, useState } from "react";
import Header from "./header";
import { Grid, Typography, TextField, Box, Button, Stack, Divider } from "@mui/material";
import Cart from "./cart";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "guest";

  const getProducts = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      setProducts(response.data);
    } catch (e) {
      console.error("Could not fetch products", e);
    }
  };

  const fetchCart = async () => {
    if (!token) return;
    const savedCart = localStorage.getItem(`cart_${username}`);
    
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    } else {
      try {
        const response = await axios.get("https://fakestoreapi.com/carts/user/1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedCart = response.data.products.map((p) => ({
          productId: p.productId,
          qty: p.quantity,
        }));
        setItems(formattedCart);
      } catch (e) {
        console.error("Could not fetch cart", e);
      }
    }
  };

  const fetchAddresses = () => {
    const savedAddresses = localStorage.getItem(`addresses_${username}`);

    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      setAddresses([]);
    }
  };

  const addAddress = () => {
    if (!newAddress.trim()) {
      enqueueSnackbar("Please enter a valid address", {
        variant: "warning",
      });
      return;
    }

    const newEntry = {
      _id: Date.now().toString(),
      address: newAddress,
    };

    const updatedAddresses = [...addresses, newEntry];
    setAddresses(updatedAddresses);

    // Save to LocalStorage with user scope
    localStorage.setItem(`addresses_${username}`, JSON.stringify(updatedAddresses));

    // Reset UI (Removed cart deletion and navigation from here)
    setNewAddress("");
    setIsAddingNew(false);
  };

  useEffect(() => {
    getProducts();
    fetchCart();
    fetchAddresses();
  }, []);

  const placeOrder = () => {
    if (!selectedAddress) {
      enqueueSnackbar("Please enter a valid address", {
        variant: "warning",
      });
      return;
    }

    enqueueSnackbar("Order placed Successfully", {
      variant: "success",
    });

    const order = {
      id: Date.now(),
      items: items,
      address: addresses.find((addr) => addr._id === selectedAddress),
      createdAt: new Date().toISOString(),
    };

    // Use user-specific orders storage
    const orders = JSON.parse(
      localStorage.getItem(`orders_${username}`) || "[]"
    );

    orders.push(order);

    localStorage.setItem(`orders_${username}`, JSON.stringify(orders));

    // Erase user-specific cart and clear state
    localStorage.removeItem(`cart_${username}`);
    setItems([]);
    setSelectedAddress("");

    navigate("/orders")
  };

  return (
    <>
      <Header hidden={true} />
      <Grid container>
        {/* --- LEFT SIDE: SHIPPING & ADDRESSES --- */}
        <Grid item xs={12} md={9} sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" textAlign="left">
            Shipping
          </Typography>
          <Typography color="textSecondary" sx={{ mb: 2, textAlign: "left" }}>
            View and manage addresses or add a new one
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Address List */}
          {addresses.length === 0 ? (
            <Typography sx={{ my: 2, textAlign: "left" }}>
              No addresses found. Please add one to proceed.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {addresses.map((addr) => (
                <Box
                  key={addr._id}
                  onClick={() => setSelectedAddress(addr._id)}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: selectedAddress === addr._id ? "#4CAF50" : "#E0E0E0",
                    bgcolor: selectedAddress === addr._id ? "#F9FFF9" : "white",
                  }}
                >
                  <Typography sx={{ textAlign: "left" }}>{addr.address}</Typography>
                </Box>
              ))}
            </Stack>
          )}

          {/* Add New Address Logic */}
          <Box sx={{ mt: 3, textAlign: "left" }}>
            {isAddingNew ? (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter your full address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button variant="contained" color="success" onClick={addAddress}>
                    ADD
                  </Button>
                  <Button variant="outlined" onClick={() => setIsAddingNew(false)}>
                    CANCEL
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Button 
                variant="contained" 
                color="success" 
                onClick={() => setIsAddingNew(true)}
              >
                ADD NEW ADDRESS
              </Button>
            )}
          </Box>
          
          {/* Payment Section */}
          <Box sx={{ textAlign: "left", mt: 4 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Payment
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="textSecondary">
              Wallet Balance: ₹5000 (Example)
            </Typography>
            <Button 
              variant="contained" 
              color="success" 
              sx={{ mt: 2 }} 
              disabled={!selectedAddress || items.length === 0}
              onClick={placeOrder}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>

        {/* --- RIGHT SIDE: CART SUMMARY --- */}
        <Grid item xs={12} md={3} bgcolor="#E9F5E1" sx={{ minHeight: "100vh" }}>
          <Cart isReadonly={true} products={products} items={items} />
        </Grid>
      </Grid>
    </>
  );
};

export default Checkout;