"use client";

import React, { useState, useEffect, use } from "react";
import {
  Typography,
  Container,
  Box,
  Grid,
  CircularProgress,
  Stack,
  Button,
  Link as MuiLink,
} from "@mui/material";
import {
  ConfirmationNumber as TicketIcon,
  ArrowBack as ArrowBackIcon,
  Language as WebIcon,
} from "@mui/icons-material";
import { supabase } from "@/lib/supabase";
import type {
  Performance,
  Review,
  PerformanceSchedule,
  PerformanceTicketType,
} from "@/types/database";
import NextLink from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/ja";

// 型定義の拡張
interface PerformanceDetail extends Performance {
  organizer_name?: string;
  organizer_profile?: string;
  organizer_website?: string;
  performance_schedules: PerformanceSchedule[];
  performance_ticket_types: PerformanceTicketType[];
  reviews: Review[];
}

interface PerformanceQueryRow extends Performance {
  users?: {
    organizer_name?: string | null;
    organizer_profile?: string | null;
    organizer_website?: string | null;
  } | null;
  performance_schedules?: PerformanceSchedule[] | null;
  performance_ticket_types?: PerformanceTicketType[] | null;
  reviews?: Review[] | null;
}

export default function PerformanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15+ の非同期 params 対応
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [performance, setPerformance] = useState<PerformanceDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPerformanceData();
    }
  }, [id]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("performances")
        .select(
          `
          *,
          users(organizer_name, organizer_profile, organizer_website),
          performance_schedules(*),
          performance_ticket_types(*),
          reviews(*)
        `
        )
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setErrorMessage("Performance not found.");
        return;
      }
      const performanceRow = data as PerformanceQueryRow;

      // データの整理とソート
      const formattedData: PerformanceDetail = {
        ...performanceRow,
        organizer_name: performanceRow.users?.organizer_name || "未設定",
        organizer_profile: performanceRow.users?.organizer_profile || undefined,
        organizer_website: performanceRow.users?.organizer_website || undefined,
        // スケジュールを時間順にソート
        performance_schedules: (performanceRow.performance_schedules || []).sort(
          (a, b) =>
            new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
        ),
        // チケットを並び順通りにソート
        performance_ticket_types: (
          performanceRow.performance_ticket_types || []
        ).sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
        reviews: performanceRow.reviews || [],
      };

      setPerformance(formattedData);
    } catch (error: unknown) {
      console.error("Fetch Error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "不明なエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 30 }}>
        <CircularProgress color="inherit" size={30} thickness={5} />
      </Box>
    );
  }

  if (errorMessage || !performance) {
    return (
      <Container maxWidth="lg" sx={{ py: 20, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 4 }}>
          {errorMessage}
        </Typography>
        <Button
          component={NextLink}
          href="/"
          variant="contained"
          sx={{ bgcolor: "black", borderRadius: 0 }}
        >
          BACK TO LIST
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.paper", color: "text.primary" }}>
      {/* ナビゲーション */}
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Button
          component={NextLink}
          href="/"
          startIcon={<ArrowBackIcon />}
          sx={{ color: "black", fontWeight: 900, fontSize: "0.8rem", mb: 4 }}
        >
          BACK TO LIST
        </Button>
      </Container>

      {/* ヒーローエリア */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 900,
            letterSpacing: "0.2em",
            display: "block",
            mb: 2,
          }}
        >
          {performance.region.toUpperCase()} /{" "}
          {performance.plan_type.toUpperCase()}
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "3rem", md: "5.5rem" },
            lineHeight: 0.9,
            fontWeight: 900,
            mb: 4,
            textTransform: "uppercase",
            letterSpacing: "-0.04em",
          }}
        >
          {performance.title}
        </Typography>

        <Grid container spacing={4} alignItems="flex-end">
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack direction="row" spacing={6}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    fontWeight: 900,
                    color: "text.secondary",
                    mb: 0.5,
                  }}
                >
                  VENUE
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {performance.venue_name}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    fontWeight: 900,
                    color: "text.secondary",
                    mb: 0.5,
                  }}
                >
                  ORGANIZER
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {performance.organizer_name}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* メイン画像 */}
      <Box
        sx={{
          width: "100%",
          height: { xs: "300px", md: "600px" },
          bgcolor: "grey.100",
          mb: 10,
          borderTop: "2px solid black",
          borderBottom: "2px solid black",
        }}
      >
        {performance.image_url ? (
          <Box
            component="img"
            src={performance.image_url}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Typography
              variant="h2"
              sx={{ fontWeight: 900, color: "grey.300" }}
            >
              NO IMAGE
            </Typography>
          </Box>
        )}
      </Box>

      {/* メインコンテンツ */}
      <Container maxWidth="lg" sx={{ pb: 15 }}>
        <Grid container spacing={10}>
          {/* 左カラム：詳細とスケジュール */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ mb: 12 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, mb: 4, letterSpacing: "0.05em" }}
              >
                ABOUT
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.15rem",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {performance.description}
              </Typography>
            </Box>

            {/* スケジュールリスト */}
            <Box sx={{ pt: 8, borderTop: "2px solid black" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, mb: 4, letterSpacing: "0.05em" }}
              >
                SCHEDULE
              </Typography>
              <Stack spacing={0}>
                {performance.performance_schedules.map((sched) => (
                  <Box
                    key={sched.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 3,
                      borderBottom: "1px solid #e0e0e0",
                      "&:last-child": { borderBottom: "2px solid black" },
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                      {dayjs(sched.start_at)
                        .locale("ja")
                        .format("YYYY.MM.DD (ddd)")}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                      {dayjs(sched.start_at).format("HH:mm")}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* 右カラム：サイドバー（チケットと場所） */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={6} sx={{ position: "sticky", top: 100 }}>
              {/* チケットセクション */}
              <Box sx={{ p: 4, border: "2px solid black" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <TicketIcon /> TICKETS
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 4 }}>
                  {performance.performance_ticket_types &&
                  performance.performance_ticket_types.length > 0 ? (
                    performance.performance_ticket_types.map((type) => (
                      <Box
                        key={type.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px dashed #ccc",
                          pb: 1,
                        }}
                      >
                        <Typography sx={{ fontWeight: 700 }}>
                          {type.name}
                        </Typography>
                        <Typography sx={{ fontWeight: 900 }}>
                          {type.price}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>
                      FREE / TBA
                    </Typography>
                  )}
                </Stack>

                {performance.ticket_url && (
                  <Button
                    fullWidth
                    variant="contained"
                    href={performance.ticket_url}
                    target="_blank"
                    sx={{
                      bgcolor: "black",
                      color: "white",
                      borderRadius: 0,
                      py: 2,
                      fontWeight: 900,
                      "&:hover": { bgcolor: "#333" },
                    }}
                  >
                    BOOK NOW
                  </Button>
                )}
              </Box>

              {/* 場所セクション */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 900,
                    color: "text.secondary",
                    display: "block",
                    mb: 1,
                  }}
                >
                  LOCATION
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                  {performance.venue_name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 3 }}>
                  {performance.venue_address}
                </Typography>

                {performance.organizer_website && (
                  <MuiLink
                    href={performance.organizer_website}
                    target="_blank"
                    sx={{
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontWeight: 900,
                      textDecoration: "underline",
                      fontSize: "0.9rem",
                    }}
                  >
                    <WebIcon fontSize="small" /> OFFICIAL WEBSITE
                  </MuiLink>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
