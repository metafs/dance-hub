"use client";

import React from "react";
import { Container, Typography, Grid } from "@mui/material";

export const Hero = () => (
  <Container maxWidth="md" sx={{ pt: { xs: 8, md: 15 }, pb: { xs: 4, md: 6 } }}>
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Typography
          variant="h1"
          sx={{
            mb: 3,
            fontSize: { xs: "2.8rem", md: "5rem" },
            lineHeight: 0.85,
            fontWeight: 900,
            letterSpacing: "-0.05em",
          }}
        >
          DANCE HUB
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            maxWidth: 800,
            fontSize: "0.95rem",
          }}
        >
          関東圏のコンテンポラリーダンス情報を集約。
          複数の上演スケジュール、会場、アーティストから探す。
        </Typography>
      </Grid>
    </Grid>
  </Container>
);
