"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Collapse,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import { Performance, PerformanceSchedule } from "@/types/database";

interface EventCardProps {
  performance: Performance & {
    organizer_name?: string;
    performance_schedules: PerformanceSchedule[];
  };
  selectedDate: Dayjs;
  schedule?: PerformanceSchedule;
}

export const EventCard = ({
  performance,
  selectedDate,
  schedule,
}: EventCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // 選択された日の開演時間を取得（scheduleが渡された場合はそれを使用）
  const todaySchedule =
    schedule ||
    performance.performance_schedules.find(
      (s) =>
        dayjs(s.start_at).format("YYYY-MM-DD") ===
        selectedDate.format("YYYY-MM-DD")
    );

  return (
    <Box sx={{ borderBottom: "1px solid #000", mb: 0 }}>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          py: 3,
          cursor: "pointer",
          "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
          display: "flex",
        }}
      >
        {/* 時間と場所 */}
        <Box sx={{ ml: 2, width: 150, flexShrink: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {todaySchedule
              ? dayjs(todaySchedule.start_at).format("HH.mm")
              : "--.--"}
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", fontWeight: 700 }}
          >
            {performance.venue_name}
          </Typography>
        </Box>

        {/* タイトルと主催者 */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1.2rem",
              textTransform: "uppercase",
            }}
          >
            {performance.title} ›
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, opacity: 0.8 }}>
            {performance.organizer_name}
          </Typography>
        </Box>
      </Box>

      {/* 展開される詳細セクション */}
      <Collapse in={expanded}>
        <Box sx={{ pb: 4, pt: 2, px: 2, position: "relative" }}>
          <IconButton
            onClick={() => setExpanded(false)}
            sx={{ position: "absolute", right: 0, top: 0 }}
          >
            <CloseIcon />
          </IconButton>

          <Grid container spacing={4}>
            {/* 左：会場詳細 */}
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 2, fontWeight: 700 }}>
                {performance.venue_address || "住所情報なし"}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="caption"
                sx={{ display: "block", fontWeight: 900, mb: 1 }}
              >
                WEB: www.example-venue.com
              </Typography>
            </Grid>

            {/* 右：他日程 */}
            <Grid item xs={12} md={8}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 900, display: "block", mb: 2 }}
              >
                その他の公演日程
              </Typography>
              <Stack spacing={0.5}>
                {performance.performance_schedules.map((s) => (
                  <Typography
                    key={s.id}
                    variant="caption"
                    sx={{ fontWeight: 700 }}
                  >
                    • {dayjs(s.start_at).format("dddd YYYY-MM-DD HH.mm")}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};
