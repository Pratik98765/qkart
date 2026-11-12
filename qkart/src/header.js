
import {
  Button,
  Stack,
  Box,
  Avatar,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import Search from "./search.js";
import { useState } from "react";

const Header = ({
  hasHiddenAuthButtons,
  performSearch,
  hidden = false,
  onOpenCart,
}) => {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const [menuOpen, setMenuOpen] = useState(false);

  const handleClose = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("balance");

    handleClose();
    navigate("/");
  };

  const handleMyOrders = () => {
    handleClose();
    navigate("/orders");
  };

  const handleCart = () => {
    handleClose();

    if (onOpenCart) {
      onOpenCart();
    }
  };

  const logo = (
    <Box
      component="img"
      src="https://yt3.googleusercontent.com/-2RQEuTmsJopVd1Iv4YkODEqQ3JDSQlh5J0Z2mDu90HYWt6MPb47DDKCrqUdaA3eZALWio5o=s900-c-k-c0x00ffffff-no-rj"
      alt="QKart-icon"
      sx={{
        height: { xs: 42, sm: 50 },
        width: { xs: 42, sm: 50 },
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
      }}
    />
  );

  // Header for checkout and other pages
  if (hasHiddenAuthButtons) {
    return (
      <Stack
        direction="row"
        sx={{
          width: "100%",
          px: { xs: 1, sm: 2 },
          height: 58,
          bgcolor: "white",
          boxSizing: "border-box",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        {logo}

        {!hidden && (
          <Box
            sx={{
              width: { xs: "45%", sm: "40%" },
            }}
          >
            <Search performSearch={performSearch} />
          </Box>
        )}

        <Button
          size="small"
          onClick={() => navigate("/")}
          sx={{ whiteSpace: "nowrap" }}
        >
          Back to explore
        </Button>
      </Stack>
    );
  }

  return (
    <>
      {/* Main Header */}
      <Stack
        direction="row"
        sx={{
          width: "100%",
          minHeight: 70,
          px: { xs: 1, sm: 2, md: 3 },
          bgcolor: "white",
          boxSizing: "border-box",
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 1, sm: 2 },
        }}
      >
        {/* Logo */}
        {logo}

        {/* Search Bar */}
        {!hidden && (
          <Box
            sx={{
              width: { xs: "40%", sm: "42%", md: "40%" },
              maxWidth: 550,
            }}
          >
            <Search performSearch={performSearch} />
          </Box>
        )}

        {/* Right Side Controls */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1 }}
          sx={{ flexShrink: 0 }}
        >
          {/* Logged-in user information */}
          {username && token ? (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                display: { xs: "none", sm: "flex" },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#4CAF50",
                  width: 32,
                  height: 32,
                }}
              >
                {username.charAt(0).toUpperCase()}
              </Avatar>

              <Box
                component="span"
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {username}
              </Box>
            </Stack>
          ) : (
            /* Login and Register buttons */
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: { xs: "none", sm: "flex" },
              }}
            >
              <Button
                component={Link}
                to="/login"
                variant="outlined"
              >
                LOGIN
              </Button>

              <Button
                component={Link}
                to="/register"
                variant="contained"
                color="success"
              >
                REGISTER
              </Button>
            </Stack>
          )}

          {/* Hamburger Button */}
          <IconButton
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            sx={{
              color: "#333",
              ml: { xs: 0, sm: 1 },
            }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Right-side Navigation Drawer */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={handleClose}
      >
        <Box sx={{ width: 260, pt: 2 }}>
          {username && token ? (
            <>
              {/* User Details */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ px: 2, py: 2 }}
              >
                <Avatar sx={{ bgcolor: "#4CAF50" }}>
                  {username.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ fontWeight: 600 }}>
                  {username}
                </Box>
              </Stack>

              <List>
                <ListItemButton onClick={handleCart}>
                  <ListItemText primary="Cart" />
                </ListItemButton>

                <ListItemButton onClick={handleMyOrders}>
                  <ListItemText primary="My Orders" />
                </ListItemButton>

                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </List>
            </>
          ) : (
            <List>
              <ListItemButton
                component={Link}
                to="/login"
                onClick={handleClose}
              >
                <ListItemText primary="Login" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/register"
                onClick={handleClose}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
