"use client";

import React from "react";
import { Container, Box, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => (
  <Container maxWidth="lg" sx={{ pb: 10 }}>
    <Box sx={{ maxWidth: 800 }}>
      <TextField
        fullWidth
        placeholder="Search by performance, artist or venue"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="standard"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "black", fontSize: "2rem", mr: 1 }} />
            </InputAdornment>
          ),
          sx: {
            fontSize: { xs: "1.2rem", md: "2rem" },
            fontWeight: 800,
            pb: 1,
            "&:before": {
              borderBottomColor: "black",
              borderBottomWidth: "2px",
            },
            "&:after": { borderBottomColor: "black", borderBottomWidth: "3px" },
          },
        }}
      />
    </Box>
  </Container>
);
