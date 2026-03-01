"use client";

import React from "react";
import { Box, Typography, Paper, Badge } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ja";

interface CalendarCardProps {
  performanceDates: string[]; // '2026-01-10' 形式の配列
  onDateChange: (date: Dayjs | null) => void;
}

// 公演がある日を黒丸で強調するためのカスタムDayコンポーネント
function ServerDay(props: PickersDayProps & { highlightedDays?: string[] }) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.includes(dayjs(day).format("YYYY-MM-DD"));

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={
        isSelected ? (
          <Box
            sx={{ width: 6, height: 6, bgcolor: "black", borderRadius: "50%" }}
          />
        ) : undefined
      }
      sx={{
        "& .MuiBadge-badge": {
          bottom: 8,
          right: "50%",
          transform: "translateX(50%)",
        },
      }}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          borderRadius: 0,
          "&.Mui-selected": {
            bgcolor: "black",
            color: "white",
            "&:hover": { bgcolor: "#333" },
          },
          "&:focus.Mui-selected": { bgcolor: "black" },
        }}
      />
    </Badge>
  );
}

export const CalendarCard = ({
  performanceDates,
  onDateChange,
}: CalendarCardProps) => {
  const DayWithHighlights = (props: PickersDayProps) => (
    <ServerDay {...props} highlightedDays={performanceDates} />
  );

  return (
    <Paper
      elevation={0}
      sx={{
        border: "2px solid black",
        borderRadius: 0,
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 900,
          mb: 2,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        Calendar
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
        <DateCalendar
          onChange={onDateChange}
          slots={{
            day: DayWithHighlights,
          }}
          sx={{
            width: "100%",
            maxHeight: "none",
            "& .MuiPickersCalendarHeader-label": {
              fontWeight: 900,
              textTransform: "uppercase",
            },
            "& .MuiDayCalendar-weekDayLabel": {
              fontWeight: 900,
              color: "black",
            },
          }}
        />
      </LocalizationProvider>

      <Typography
        variant="caption"
        sx={{ mt: "auto", pt: 2, fontWeight: 700, borderTop: "1px solid #eee" }}
      >
        ● = 公演あり
      </Typography>
    </Paper>
  );
};
