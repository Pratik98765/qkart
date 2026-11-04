import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import "./register.css"; // You might want to create a separate login.css
import axios from "axios";
import { config } from "./App";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom"; // Added for navigation
import Header from "./header.js";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const login = async () => {
    if (validateInput(formData)) {
      try {
        setLoading(true);
        let res = await axios.post(`${config.endpoint}/auth/login`, {
          // Fixed template literal
          username: formData.username,
          password: formData.password,
        });
        persistLogin(res.data.token, res.data.username, res.data.balance);
        enqueueSnackbar("Logged in Successfully", { variant: "success" });
        navigate("/"); // Redirect to home page
      } catch (err) {
        console.log(err.response, "err");
        if (err.response?.status === 400) {
          enqueueSnackbar(err.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON",
            { variant: "error" }
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar("username is required field", { variant: "warning" });
      return false;
    }
    if (!data.password) {
      enqueueSnackbar("password is required field", { variant: "warning" });
      return false;
    }
    return true;
  };

  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token); // Fixed: Use string keys
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <>
      <Header />
      <Box className="main-content">
        <div className="form-card">
          <Typography className="form-title" variant="h4">
            Login
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            id="username"
            label="Username"
            placeholder="Enter Username"
            variant="outlined"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            id="outlined-basic"
            label="Enter Password"
            placeholder="Enter Password"
            variant="outlined"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={login}
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          )}
          {/* <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography> */}
        </div>
      </Box>
    </>
  );
};

export default Login;
