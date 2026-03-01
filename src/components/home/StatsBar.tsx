"use client";

import React from "react";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { Tune as FilterIcon } from "@mui/icons-material";

interface StatsBarProps {
  count: number;
  onFilterClick: () => void;
}

export const StatsBar = ({ count, onFilterClick }: StatsBarProps) => (
  <Box
    sx={{
      borderTop: 2,
      borderBottom: 2,
      borderColor: "black",
      position: "sticky",
      top: 0,
      bgcolor: "background.paper",
      zIndex: 100,
    }}
  >
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1.5,
        }}
      >
        <Stack direction="row" spacing={6}>
          <Box>
            <Typography
              variant="caption"
              sx={{ display: "block", fontWeight: 900, lineHeight: 1 }}
            >
              PROGRAMS
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              {count}
            </Typography>
          </Box>
        </Stack>
        <Button
          startIcon={<FilterIcon />}
          onClick={onFilterClick}
          sx={{
            color: "white",
            bgcolor: "black",
            fontWeight: 900,
            px: 5,
            py: 1.5,
            borderRadius: 0,
            "&:hover": { bgcolor: "#333" },
          }}
        >
          FILTER
        </Button>
      </Box>
    </Container>
  </Box>
);
