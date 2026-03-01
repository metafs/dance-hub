"use client";

import React from "react";
import { Box, Typography, Stack, ButtonBase } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

interface DateStripProps {
  selectedDate: Dayjs;
  onDateSelect: (date: Dayjs) => void;
}

export const DateStrip = ({ selectedDate, onDateSelect }: DateStripProps) => {
  // 表示する日付の範囲を作成（前後15日など）
  const dates = Array.from({ length: 31 }, (_, i) => dayjs().date(i + 1));

  return (
    <Box
      sx={{
        bgcolor: "#C4C4C4",
        display: "flex",
        alignItems: "center",
        py: 1,
        overflowX: "auto",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Typography
        sx={{ px: 4, fontWeight: 900, color: "white", fontSize: "1.2rem" }}
      >
        {selectedDate.format("MMM").toUpperCase()}
      </Typography>

      <Stack direction="row" spacing={0}>
        {dates.map((date) => {
          const isSelected =
            date.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD");
          const dayOfWeek = date.day(); // 0: Sunday, 6: Saturday
          const isSaturday = dayOfWeek === 6;
          const isSunday = dayOfWeek === 0;

          // 曜日に応じた色を決定
          let dayColor = isSelected ? "white" : "#666";
          if (!isSelected) {
            if (isSaturday) dayColor = "#1976d2"; // 青色
            if (isSunday) dayColor = "#d32f2f"; // 赤色
          }

          return (
            <ButtonBase
              key={date.toString()}
              onClick={() => onDateSelect(date)}
              sx={{
                width: 45,
                height: 60,
                display: "flex",
                flexDirection: "column",
                bgcolor: isSelected ? "black" : "transparent",
                color: dayColor,
                borderRadius: 1,
                transition: "all 0.2s ease-in-out",
                boxShadow: isSelected ? "0 4px 8px rgba(0,0,0,0.3)" : "none",
                "&:hover": {
                  bgcolor: isSelected ? "black" : "rgba(255,255,255,0.8)",
                  transform: "translateY(-2px)",
                  boxShadow: isSelected
                    ? "0 6px 12px rgba(0,0,0,0.4)"
                    : "0 4px 8px rgba(0,0,0,0.15)",
                  color: isSelected ? "white" : "black",
                },
                "&:active": {
                  transform: "translateY(0px)",
                  boxShadow: isSelected
                    ? "0 2px 4px rgba(0,0,0,0.3)"
                    : "0 2px 4px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Typography sx={{ fontWeight: 900, fontSize: "0.9rem" }}>
                {date.format("DD")}
              </Typography>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 900 }}>
                {date.format("ddd").toUpperCase()}
              </Typography>
            </ButtonBase>
          );
        })}
      </Stack>
    </Box>
  );
};
