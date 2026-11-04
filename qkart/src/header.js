import { Button, Stack, Box, Menu, MenuItem, Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Search from "./search.js";
import { useState } from "react";

const Header = ({ hasHiddenAuthButtons, performSearch, hidden = false }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [anchor, setAnchor] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("balance");
    navigate("/");
  };

  const handleClickAvatar = (e) => {
    setAnchor(e.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const handleMyOrders = () => {
    handleClose();
    navigate("/orders");
  };

  if (hasHiddenAuthButtons) {
    return (
      <Stack
        direction="row"
        spacing={1}
        sx={{
          width: "100%",
          padding: "0 20px",
          height: "58px",
          bgcolor: "white",
          boxSizing: "border-box",
          justifyContent: "space-between",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <img
          src="https://yt3.googleusercontent.com/-2RQEuTmsJopVd1Iv4YkODEqQ3JDSQlh5J0Z2mDu90HYWt6MPb47DDKCrqUdaA3eZALWio5o=s900-c-k-c0x00ffffff-no-rj"
          alt="QKart-icon"
          style={{ height: "60px", borderRadius: "50%" }}
        />
        {!hidden && (
          <Box sx={{ width: "40%" }}>
            <Search performSearch={performSearch} />
          </Box>
        )}
        <Button onClick={() => navigate("/")}>Back to explore</Button>
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        padding: "0 20px",
        height: "58px",
        bgcolor: "white",
        boxSizing: "border-box",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <img
        src="https://yt3.googleusercontent.com/-2RQEuTmsJopVd1Iv4YkODEqQ3JDSQlh5J0Z2mDu90HYWt6MPb47DDKCrqUdaA3eZALWio5o=s900-c-k-c0x00ffffff-no-rj"
        alt="QKart-icon"
        style={{ height: "50px", borderRadius: "50%" }}
      />

      {/* ✅ Conditionally hide search bar when hidden={true} */}
      {!hidden && (
        <Box sx={{ width: "40%" }}>
          <Search performSearch={performSearch} />
        </Box>
      )}

      <Stack direction="row" spacing={2} alignItems="center">
        {username && token ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar onClick={handleClickAvatar} sx={{ bgcolor: "#4CAF50", cursor: "pointer" }}>
                  {username.charAt(0).toUpperCase()}
                </Avatar>
                <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={handleClose}>
                  <MenuItem onClick={handleMyOrders}>
                    My Orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    LogOut
                  </MenuItem>
                </Menu>
              </div>
              <span>{username}</span>
            </Box>
          </>
        ) : (
          <>
            <Button component={Link} to="/login" variant="outlined">
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
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default Header;