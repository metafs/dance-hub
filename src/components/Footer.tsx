"use client";

import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Link,
  Divider,
} from "@mui/material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: "divider",
        mt: "auto",
        py: 10,
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
              DANCE HUB
            </Typography>
            <Typography variant="body2" color="text.secondary">
              関東のコンテンポラリーダンス情報プラットフォーム
            </Typography>
          </Grid>
          {[
            { title: "プログラム", items: ["公演カレンダー", "アーティスト"] },
            { title: "情報", items: ["私たちについて", "お問い合わせ"] },
            { title: "主催者向け", items: ["公演を掲載する", "ログイン"] },
          ].map((section) => (
            <Grid size={{ xs: 6, md: 3 }} key={section.title}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                {section.title}
              </Typography>
              <Stack spacing={1}>
                {section.items.map((item) => (
                  <Link
                    key={item}
                    href="#"
                    underline="none"
                    color="text.secondary"
                    sx={{
                      fontSize: "0.875rem",
                      "&:hover": { color: "text.primary" },
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 6 }} />
        <Typography variant="caption" color="text.disabled">
          &copy; 2026 DANCE HUB. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};
