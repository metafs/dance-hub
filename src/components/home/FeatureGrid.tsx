"use client";

import React from "react";
import { Grid, Box, Typography, Paper, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface FeatureGridProps {
  calendarNode: React.ReactNode;
}

export const FeatureGrid = ({ calendarNode }: FeatureGridProps) => {
  return (
    <Box sx={{ py: 8 }}>
      <Grid container spacing={3}>
        {/* カレンダーカード (左側) */}
        <Grid item xs={12} md={6}>
          {calendarNode}
        </Grid>

        {/* 右側の情報カード群 */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3} sx={{ height: "100%" }}>
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  border: "2px solid black",
                  borderRadius: 0,
                  p: 3,
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": { bgcolor: "#f5f5f5" },
                  cursor: "pointer",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  ARTISTS
                </Typography>
                <ArrowForwardIcon />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  border: "2px solid black",
                  borderRadius: 0,
                  p: 3,
                  height: "200px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": { bgcolor: "#f5f5f5" },
                  cursor: "pointer",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  VENUES
                </Typography>
                <ArrowForwardIcon />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "black",
                  color: "white",
                  borderRadius: 0,
                  p: 4,
                  height: "230px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
                  DANCE HUB MAGAZINE
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  最新のインタビューや批評をチェック。
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "white",
                    alignSelf: "flex-start",
                    borderRadius: 0,
                  }}
                >
                  READ MORE
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
