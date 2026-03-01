"use client";

import React, { useState, useEffect, use } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Link as MuiLink,
} from "@mui/material";
import { supabase } from "@/lib/supabase";
import { EventCard } from "@/app/calendar/EventCard";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { Place as PlaceIcon } from "@mui/icons-material"; // マップアイコンを追加
import type { Performance, PerformanceSchedule, Region } from "@/types/database";

interface VenueDetail {
  id: string;
  name: string;
  address: string;
  region: Region;
  description: string;
  website_url?: string | null;
}

interface PerformanceWithSchedules extends Performance {
  organizer_name?: string;
  performance_schedules: PerformanceSchedule[];
}

interface PerformanceQueryRow extends Performance {
  users?: { organizer_name?: string | null } | null;
  performance_schedules?: PerformanceSchedule[] | null;
}

export default function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [venue, setVenue] = useState<VenueDetail | null>(null);
  const [upcomingPerformances, setUpcomingPerformances] = useState<
    PerformanceWithSchedules[]
  >([]);
  const [pastPerformances, setPastPerformances] = useState<
    PerformanceWithSchedules[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchVenueAndPerformances();
  }, [id]);

  const fetchVenueAndPerformances = async () => {
    try {
      setLoading(true);

      // 1. 会場情報の取得
      const { data: venueData } = await supabase
        .from("venues")
        .select("*")
        .eq("id", id)
        .single();
      const venueRecord = (venueData as VenueDetail | null) ?? null;
      setVenue(venueRecord);

      if (venueRecord) {
        // 2. 会場名に紐づく公演を取得
        const { data: perfData } = await supabase
          .from("performances")
          .select(
            `
            *,
            users(organizer_name),
            performance_schedules(*)
          `
          )
          .eq("venue_name", venueRecord.name)
          .eq("status", "active");

        const now = dayjs();
        const upcoming: PerformanceWithSchedules[] = [];
        const past: PerformanceWithSchedules[] = [];
        const performanceRows = (perfData || []) as PerformanceQueryRow[];

        performanceRows.forEach((perf) => {
          const schedules = (perf.performance_schedules || []).sort(
            (a, b) =>
              dayjs(a.start_at).unix() - dayjs(b.start_at).unix()
          );

          if (schedules.length === 0) return;

          const formattedPerf = {
            ...perf,
            organizer_name: perf.users?.organizer_name || "主催者不明",
            performance_schedules: schedules,
          } as PerformanceWithSchedules;

          const lastDate = dayjs(schedules[schedules.length - 1].start_at);
          if (lastDate.isAfter(now)) {
            upcoming.push(formattedPerf);
          } else {
            past.push(formattedPerf);
          }
        });

        setUpcomingPerformances(upcoming);
        setPastPerformances(past);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 30 }}>
        <CircularProgress color="inherit" />
      </Box>
    );

  if (!venue)
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography>会場が見つかりませんでした。</Typography>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      {/* 会場基本情報 */}
      <Box sx={{ mb: 10 }}>
        <Typography
          variant="caption"
          sx={{ fontWeight: 900, letterSpacing: "0.2em" }}
        >
          {venue.region?.toUpperCase()}
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            mb: 4,
            fontSize: { xs: "3rem", md: "5rem" },
            letterSpacing: "-0.04em",
          }}
        >
          {venue.name}
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: 800, mb: 4, lineHeight: 1.8 }}
        >
          {venue.description}
        </Typography>

        <Stack direction="row" spacing={6}>
          <Box>
            <Typography
              variant="caption"
              sx={{ fontWeight: 900, color: "grey.500", display: "block" }}
            >
              住所
            </Typography>
            <MuiLink
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                venue.address
              )}`}
              target="_blank"
              rel="noopener"
              sx={{
                color: "black",
                fontWeight: 700,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <PlaceIcon sx={{ fontSize: 18 }} /> {/* マップアイコン */}
              {venue.address}
            </MuiLink>
          </Box>
          {venue.website_url && (
            <Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 900, color: "grey.500", display: "block" }}
              >
                ウェブサイト
              </Typography>
              <MuiLink
                href={venue.website_url}
                target="_blank"
                rel="noopener"
                sx={{
                  color: "black",
                  fontWeight: 700,
                  textDecoration: "underline",
                }}
              >
                公式サイトを開く ›
              </MuiLink>
            </Box>
          )}
        </Stack>
      </Box>

      {/* 公演セクション */}
      <Box sx={{ borderTop: "2px solid black" }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            "& .MuiTab-root": { fontWeight: 900, fontSize: "1.2rem", py: 3 },
            "& .Mui-selected": { color: "black !important" },
            "& .MuiTabs-indicator": { bgcolor: "black", height: 4 },
          }}
        >
          <Tab label={`今後の公演 (${upcomingPerformances.length})`} />
          <Tab label={`過去の公演 (${pastPerformances.length})`} />
        </Tabs>

        <Box sx={{ py: 4 }}>
          {tabValue === 0 ? (
            <Stack spacing={0}>
              {upcomingPerformances.length > 0 ? (
                upcomingPerformances.map((perf) => (
                  <EventCard
                    key={perf.id}
                    performance={perf}
                    selectedDate={dayjs(perf.performance_schedules[0].start_at)}
                  />
                ))
              ) : (
                <Typography sx={{ py: 10, opacity: 0.5, fontWeight: 700 }}>
                  今後の公演予定はありません。
                </Typography>
              )}
            </Stack>
          ) : (
            <Stack spacing={0}>
              {pastPerformances.length > 0 ? (
                pastPerformances.map((perf) => (
                  <EventCard
                    key={perf.id}
                    performance={perf}
                    selectedDate={dayjs(
                      perf.performance_schedules[
                        perf.performance_schedules.length - 1
                      ].start_at
                    )}
                  />
                ))
              ) : (
                <Typography sx={{ py: 10, opacity: 0.5, fontWeight: 700 }}>
                  過去の公演記録はありません。
                </Typography>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </Container>
  );
}
