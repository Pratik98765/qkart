import React, { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Search = ({ performSearch }) => {
  const [input, setInput] = useState("");
  const [debouncetimer, setDebounceTimer] = useState(null);

  const handleChange = (e) => {
    const change = e.target.value;
    setInput(change);

    if (debouncetimer) {
      clearTimeout(debouncetimer);
    }
    const newTimer = setTimeout(() => {
      if (performSearch) {
        performSearch(change);
      }
    }, 2000);
    setDebounceTimer(newTimer);
  };
  return (
    <TextField
      size="small" // Keeps the header height consistent
      fullWidth // Allows the Box in your Header to control the size
      variant="outlined"
      placeholder="Search for items/categories"
      onChange={handleChange}
      value={input}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon color="primary" />
          </InputAdornment>
        ),
      }}
      sx={{
        bgcolor: "white",
        borderRadius: "4px",
      }}
    />
  );
};
export default Search;
