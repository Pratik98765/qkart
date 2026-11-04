import { Box, Button, Stack, Typography, Divider } from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import React from "react";


const Cart = ({ products, items = [], handleQuantity, isReadonly = false }) => {
  const navigate = useNavigate();

  const totalValue = items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    return total + (product ? product.price * item.qty : 0);
  }, 0);

  if (!items.length) {
    return (
      <Box className="cart empty" sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
        <ShoppingCartOutlined sx={{ fontSize: 40, color: "gray" }} />
        <Typography color="gray" variant="h6">Cart is empty</Typography>
      </Box>
    );
  }

  return (
    <Box className="cart" sx={{ p: 2, display: "flex", flexDirection: "column", bgcolor: "white" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>Your Cart</Typography>

      <Stack spacing={2}>
        {items.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return product ? (
            <Box key={item.productId} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box component="img" src={product.image} alt={product.title} sx={{ width: 50, height: 50, objectFit: "contain", borderRadius: "4px", border: "1px solid #ebebeb" }} />

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold", lineHeight: "1.2rem" }}>{product.title}</Typography>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  {/* --- CONDITIONAL BUTTONS --- */}
                  {!isReadonly ? (
                    <>
                      <Button size="small" variant="outlined" sx={{ minWidth: "30px", height: "30px", borderRadius: "50%" }} onClick={() => handleQuantity(item.productId, item.qty - 1)}>-</Button>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>{item.qty}</Typography>
                      <Button size="small" variant="outlined" sx={{ minWidth: "30px", height: "30px", borderRadius: "50%" }} onClick={() => handleQuantity(item.productId, item.qty + 1)}>+</Button>
                    </>
                  ) : (
                    // Show simple text if Readonly (Checkout Page)
                    <Typography variant="body2">Qty: {item.qty}</Typography>
                  )}
                </Stack>
              </Box>

              <Typography variant="body2" sx={{ fontWeight: "bold" }}>₹{item.qty * product.price}</Typography>
            </Box>
          ) : null;
        })}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3C3C3C" }}>₹{totalValue}</Typography>
      </Box>

      {/* --- HIDE CHECKOUT BUTTON IF READONLY --- */}
      {!isReadonly && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, borderRadius: "4px", fontWeight: "bold" }}
          onClick={() => navigate("/checkout")}
        >
          CHECKOUT
        </Button>
      )}
    </Box>
  );
};

export default Cart;