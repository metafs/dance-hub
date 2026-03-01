"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Divider,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ja";
import isBetween from "dayjs/plugin/isBetween";
import { supabase } from "@/lib/supabase";
import type {
  Performance,
  PerformanceSchedule,
  Region,
} from "@/types/database";
import { DateStrip } from "@/app/calendar/DateStrip";
import { EventCard } from "@/app/calendar/EventCard";

dayjs.extend(isBetween);
dayjs.locale("ja");

interface PerformanceWithSchedules extends Performance {
  organizer_name?: string;
  performance_schedules: PerformanceSchedule[];
}

interface PerformanceQueryRow extends Performance {
  users?: { organizer_name?: string | null } | null;
  performance_schedules?: PerformanceSchedule[] | null;
}

const regions: Region[] = [
  "東京23区",
  "多摩エリア",
  "神奈川",
  "埼玉",
  "千葉",
  "群馬",
  "栃木",
  "茨城",
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [performances, setPerformances] = useState<PerformanceWithSchedules[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // フィルター状態
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("performances")
        .select(`*, users(organizer_name), performance_schedules(*)`)
        .eq("status", "active");
      if (error) throw error;
      const performanceRows = (data || []) as PerformanceQueryRow[];
      const formattedData = performanceRows.map((performance) => {
        const { users, performance_schedules, ...rest } = performance;
        return {
          ...rest,
          organizer_name: users?.organizer_name || undefined,
          performance_schedules: (performance_schedules || []).sort(
            (a, b) =>
              new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
          ),
        } satisfies PerformanceWithSchedules;
      });
      setPerformances(formattedData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- 表示する日付のリストを作成 ---
  const displayDates = useMemo(() => {
    if (fromDate && toDate) {
      const dates = [];
      let current = fromDate.startOf("day");
      const end = toDate.startOf("day");
      while (current.isBefore(end) || current.isSame(end)) {
        dates.push(current);
        current = current.add(1, "day");
      }
      return dates;
    }
    return [selectedDate.startOf("day")];
  }, [selectedDate, fromDate, toDate]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 30 }}>
        <CircularProgress color="inherit" />
      </Box>
    );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 10 } }}>
        <Typography
          variant="h1"
          sx={{ fontWeight: 900, mb: 2, fontSize: { xs: "3rem", md: "5rem" } }}
        >
          CALENDAR
        </Typography>

        {/* 横並びカレンダー */}
        <DateStrip
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            setSelectedDate(date);
            setFromDate(null);
            setToDate(null);
          }}
        />

        {/* フィルタエリア */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ my: 4, px: 1 }}
          alignItems="flex-end"
        >
          <FormControl variant="standard" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ fontWeight: 900, color: "black" }}>
              地域
            </InputLabel>
            <Select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <MenuItem value="all">すべての地域</MenuItem>
              {regions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2} alignItems="flex-end">
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 900, display: "block" }}
              >
                開始日:
              </Typography>
              <DatePicker
                value={fromDate}
                onChange={setFromDate}
                format="YYYY/MM/DD"
                slotProps={{
                  textField: { variant: "standard", sx: { width: 160 } },
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 900, display: "block" }}
              >
                終了日:
              </Typography>
              <DatePicker
                value={toDate}
                onChange={setToDate}
                format="YYYY/MM/DD"
                minDate={fromDate ?? undefined}
                slotProps={{
                  textField: { variant: "standard", sx: { width: 160 } },
                }}
              />
            </Box>
          </Stack>
        </Stack>

        {/* 日付ごとのグループ表示エリア */}
        <Box sx={{ mt: 10 }}>
          {displayDates.map((date) => {
            // その日に上演があるイベントを抽出（スケジュール単位でソート）
            const eventsOnThisDay = performances
              .filter(
                (p) => regionFilter === "all" || p.region === regionFilter
              )
              .filter((p) =>
                p.performance_schedules.some(
                  (s) =>
                    dayjs(s.start_at).format("YYYY-MM-DD") ===
                    date.format("YYYY-MM-DD")
                )
              );

            // スケジュール単位でソートするため、flatMapで展開してからソート
            const schedulesOnThisDay = eventsOnThisDay
              .flatMap((performance) => {
                const todaySchedules = performance.performance_schedules.filter(
                  (s) =>
                    dayjs(s.start_at).format("YYYY-MM-DD") ===
                    date.format("YYYY-MM-DD")
                );
                return todaySchedules.map((schedule) => ({
                  performance,
                  schedule,
                }));
              })
              .sort((a, b) => {
                return (
                  dayjs(a.schedule.start_at).unix() -
                  dayjs(b.schedule.start_at).unix()
                );
              });

            // イベントがない日は表示をスキップ（または「予定なし」と出すかはお好み）
            if (schedulesOnThisDay.length === 0 && fromDate && toDate)
              return null;

            return (
              <Box key={date.format("YYYY-MM-DD")} sx={{ mb: 10 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    mb: 2,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {date.format("YYYY年MM月DD日 (ddd)").toUpperCase()}
                </Typography>
                <Divider
                  sx={{ borderColor: "black", borderBottomWidth: 2, mb: 0 }}
                />

                {schedulesOnThisDay.length > 0 ? (
                  schedulesOnThisDay.map(({ performance, schedule }) => (
                    <EventCard
                      key={`${performance.id}-${schedule.id}`}
                      performance={performance}
                      selectedDate={date}
                      schedule={schedule}
                    />
                  ))
                ) : (
                  <Box
                    sx={{
                      py: 10,
                      borderBottom: "1px solid black",
                      textAlign: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, opacity: 0.3 }}>
                      イベントなし
                    </Typography>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Container>
    </LocalizationProvider>
  );
}
