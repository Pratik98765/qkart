import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import "./register.css";
import axios from "axios";
import { config } from "./App";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import Header from "./header.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const register = async () => {
    if (validateInput(formData)) {
      try {
        setLoading(true);
        let res = await axios.post(`${config.endpoint}/auth/register`, {
          // Fixed template literal
          username: formData.username,
          password: formData.password,
        });
        enqueueSnackbar("Registered Successfully", { variant: "success" });
        // Redirect to login after successful registration
        
        navigate("/login");
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
    if (data.username.length < 6) {
      enqueueSnackbar("username at least 6 characters", { variant: "warning" });
      return false;
    }
    if (!data.password) {
      enqueueSnackbar("password is required field", { variant: "warning" });
      return false;
    }
    if (data.password.length < 6) {
      enqueueSnackbar("password at least 6 characters", { variant: "warning" });
      return false;
    }
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar("password do not match", { variant: "warning" });
      return false;
    }
    return true;
  };

  return (
    <>
      <Header />
      <Box className="main-content">
        <div className="form-card">
          <Typography className="form-title" variant="h4">
            Register
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
          <TextField
            fullWidth
            margin="normal"
            id="outlined-basic"
            label="Confirm Password"
            placeholder="Confirm Password"
            variant="outlined"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
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
              onClick={register}
              fullWidth
              sx={{ mt: 2 }}
            >
              REGISTER NOW
            </Button>
          )}
          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </div>
      </Box>
    </>
  );
};

export default Register;
