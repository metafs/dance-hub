"use client";

import React from "react";
import { Box, Typography, Stack, alpha } from "@mui/material";
import {
  Place as MapPinIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { Performance, PerformanceSchedule } from "@/types/database";
import NextLink from "next/link";

interface PerformanceItemProps {
  performance: Performance & {
    organizer_name?: string;
    performance_schedules: PerformanceSchedule[];
  };
}

export const PerformanceItem = ({ performance }: PerformanceItemProps) => {
  // 日時フォーマット用のヘルパー関数
  const formatSchedule = (dateString: string) => {
    const date = new Date(dateString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");

    return `${y}.${m}.${d} ${hh}:${mm}`;
  };

  return (
    <Box
      component={NextLink}
      href={`/performances/${performance.id}`}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 2, md: 8 },
        py: { xs: 4, md: 8 },
        borderBottom: "1.5px solid #000",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        "&:hover": { bgcolor: alpha("#000", 0.02) },
        "&:hover .chevron": { transform: "translateX(10px)" },
      }}
    >
      {/* 左カラム：日時のリスト表示 */}
      <Box sx={{ width: { md: 200 }, flexShrink: 0 }}>
        <Stack spacing={0.5}>
          {performance.performance_schedules.map((sched) => (
            <Typography
              key={sched.id}
              sx={{
                fontWeight: 900,
                fontSize: "1rem",
                lineHeight: 1.2,
                fontFamily: "monospace", // 数字のズレを防ぐため
              }}
            >
              {formatSchedule(sched.start_at)}
            </Typography>
          ))}
        </Stack>
      </Box>

      {/* 中央カラム：メイン情報 */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            mb: 2,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            fontSize: { xs: "1.8rem", md: "2.5rem" },
          }}
        >
          {performance.title}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Box sx={{ border: "1.5px solid black", px: 1, py: 0.2 }}>
            <Typography variant="caption" sx={{ fontWeight: 900 }}>
              {performance.region}
            </Typography>
          </Box>
          {performance.plan_type === "premium" && (
            <Box sx={{ bgcolor: "black", color: "white", px: 1, py: 0.2 }}>
              <Typography variant="caption" sx={{ fontWeight: 900 }}>
                PICK UP
              </Typography>
            </Box>
          )}
        </Stack>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.secondary",
          }}
        >
          <MapPinIcon sx={{ fontSize: 18 }} />
          {performance.venue_name} / {performance.organizer_name}
        </Typography>
      </Box>

      {/* 右カラム：アローアイコン */}
      <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
        <ChevronRightIcon
          className="chevron"
          sx={{ fontSize: 50, transition: "0.4s" }}
        />
      </Box>
    </Box>
  );
};
