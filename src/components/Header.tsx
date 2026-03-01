"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Stack,
  Link,
  Box,
} from "@mui/material";

export const Header = () => {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Link href="/" underline="none" color="text.primary">
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              DANCE HUB
            </Typography>
          </Link>

          <Stack direction="row" spacing={4} alignItems="center">
            {["プログラム", "情報"].map((item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                color="text.primary"
                sx={{ fontSize: "0.875rem", "&:hover": { opacity: 0.6 } }}
              >
                {item}
              </Link>
            ))}
            <Link
              href="#"
              underline="none"
              sx={{
                fontSize: "0.875rem",
                bgcolor: "black",
                color: "white",
                px: 2,
                py: 1,
                "&:hover": { opacity: 0.8 },
              }}
            >
              ログイン
            </Link>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
