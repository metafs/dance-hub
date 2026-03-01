"use client";

import React from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  ButtonBase,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NextLink from "next/link";
import { Hero } from "@/components/home/Hero";
import { PerformanceStats } from "@/components/home/PerformanceStats";

// カードコンポーネント
const NavigationCard = ({
  title,
  desc,
  href,
  dark = false,
}: {
  title: string;
  desc: string;
  href: string;
  dark?: boolean;
}) => (
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <ButtonBase
      component={NextLink}
      href={href}
      sx={{ width: "100%", textAlign: "left", display: "block" }}
    >
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
          bgcolor: dark ? "black" : "white",
          color: dark ? "white" : "black",
          transition: "0.2s",
          "&:hover": { bgcolor: dark ? "#222" : "#f5f5f5" },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, mb: 1.5, letterSpacing: "-0.02em" }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, opacity: 0.8, fontSize: "0.85rem" }}
          >
            {desc}
          </Typography>
        </Box>
        <ArrowForwardIcon sx={{ fontSize: 28 }} />
      </Paper>
    </ButtonBase>
  </Grid>
);

export default function HomePage() {
  return (
    <Box>
      <Hero />
      <Container maxWidth="md" sx={{ pb: 15 }}>
        <Grid container spacing={3}>
          {/* カレンダーへのリンクカード */}
          <NavigationCard
            title="CALENDAR"
            desc="関東で開催される全てのコンテンポラリーダンス公演・ワークショップの日程を確認する。"
            href="/calendar"
            dark
          />

          {/* その他の情報カード */}
          <NavigationCard
            title="ARTISTS"
            desc="地域で活動するアーティストやカンパニーのプロフィールと活動情報を探す。"
            href="/artists"
          />
          <NavigationCard
            title="VENUES"
            desc="ダンス上演が可能な劇場、スタジオ、オルタナティブスペースのリスト。"
            href="/venues"
          />
          <NavigationCard
            title="MAGAZINE"
            desc="インタビュー、批評、コラム。ダンスシーンの今を深く知るためのテキスト。"
            href="/magazine"
          />
          <NavigationCard
            title="ARCHIVE"
            desc="過去に上演された作品の記録データ。"
            href="/archive"
          />
          <NavigationCard
            title="CONTACT"
            desc="DANCE HUBへの掲載依頼やお問い合わせはこちらから。"
            href="/contact"
          />
        </Grid>
      </Container>
    </Box>
  );
}
