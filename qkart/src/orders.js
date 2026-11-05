import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Divider, Button } from "@mui/material";
import Header from "./header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        // ✅ Define username so it fetches the correct user's orders
        const username = localStorage.getItem("username") || "guest";
        const savedOrders = JSON.parse(localStorage.getItem(`orders_${username}`) || "[]");
        setOrders(savedOrders);

        // const getProducts = async () => {
        //     try {
        //         const response = await axios.get("https://fakestoreapi.com/products");
        //         setProducts(response.data);
        //     } catch (error) {
        //         console.error("could not fetch products", error);
        //     }
        // };
        // getProducts();
    }, []);
    
    return (
        <>
            <Header hidden={true} />
            <Box sx={{ p: 4 }}>
                {/* Top header flex container with Title and Back to Home button */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h4" fontWeight="bold">
                        My Orders
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </Button>
                </Box>
            
                {orders.length === 0 ? (
                    <Typography>No orders found</Typography>
                ) : (
                    orders.map((order) => (
                        <Card key={order.id} sx={{ mb: 3, borderRadius: 2 }}>
                            <CardContent>
                                <Typography fontWeight="bold">
                                    Order ID: {order.id}
                                </Typography>

                                <Typography color="text.secondary">
                                    {new Date(order.createdAt).toLocaleString()}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography fontWeight="bold">
                                    Shipping Address
                                </Typography>

                                <Typography>
                                    {order.address?.address}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </>
    );
};

export default MyOrders;