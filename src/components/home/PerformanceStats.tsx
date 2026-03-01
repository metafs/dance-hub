"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from "@mui/material";
import { supabase } from "@/lib/supabase";

// --- デザイン定数 ---
const BORDER = "2px solid #000";
const MONOSPACE = "'Roboto Mono', 'Courier New', monospace";

const regions = [
  "東京23区",
  "多摩",
  "神奈川",
  "埼玉",
  "千葉",
  "群馬",
  "栃木",
  "茨城",
];
const months = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

export const PerformanceStats = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    monthly: { label: string; value: number }[];
    region: { label: string; value: number }[];
    total: number;
  }>({ monthly: [], region: [], total: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: dbData } = await supabase
        .from("performances")
        .select("region, performance_date")
        .gte("performance_date", `${selectedYear}-01-01`)
        .lt("performance_date", `${selectedYear + 1}-01-01`)
        .eq("status", "active");

      const monthlyCounts = new Array(12).fill(0);
      const regionCounts = new Map<string, number>();

      dbData?.forEach((p) => {
        const month = new Date(p.performance_date).getMonth();
        monthlyCounts[month]++;
        regionCounts.set(p.region, (regionCounts.get(p.region) || 0) + 1);
      });

      setData({
        monthly: months.map((m, i) => ({ label: m, value: monthlyCounts[i] })),
        region: regions.map((r) => ({
          label: r,
          value: regionCounts.get(r) || 0,
        })),
        total: dbData?.length || 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  if (loading)
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress color="inherit" />
      </Box>
    );

  return (
    <Box sx={{ py: 6, bgcolor: "white" }}>
      <Container maxWidth="lg">
        {/* ヘッダー: タイトルと年度切り替え */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ mb: 4, gap: 2 }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            統計データ
          </Typography>
          <ToggleButtonGroup
            value={selectedYear}
            exclusive
            onChange={(_, val) => val && setSelectedYear(val)}
            size="small"
            sx={{ border: BORDER, borderRadius: 0, height: 36 }}
          >
            {[2024, 2025, 2026].map((y) => (
              <ToggleButton
                key={y}
                value={y}
                sx={{
                  borderRadius: 0,
                  border: "none",
                  px: 3,
                  fontWeight: 900,
                  fontFamily: MONOSPACE,
                  "&.Mui-selected": {
                    bgcolor: "black",
                    color: "white",
                    "&:hover": { bgcolor: "#333" },
                  },
                }}
              >
                {y}年
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        {/* 総計カウンターバー */}
        <Box
          sx={{
            border: BORDER,
            p: 2.5,
            mb: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "black",
            color: "white",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 900, letterSpacing: "0.1em" }}
          >
            {selectedYear}年の総公演数
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: 900, fontFamily: MONOSPACE, lineHeight: 1 }}
          >
            {data.total}
          </Typography>
        </Box>

        {/* グラフエリア */}
        <Grid container spacing={5}>
          {/* 月別グラフ */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 900,
                mb: 1.5,
                display: "block",
                borderBottom: "1.5px solid black",
                pb: 0.5,
              }}
            >
              月別公演数
            </Typography>
            <Stack spacing={0.8}>
              {data.monthly.map((d) => (
                <Box
                  key={d.label}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Typography
                    sx={{ width: 40, fontSize: "0.75rem", fontWeight: 900 }}
                  >
                    {d.label}
                  </Typography>
                  <Box
                    sx={{
                      flexGrow: 1,
                      height: 6,
                      bgcolor: "#f0f0f0",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        bgcolor: "black",
                        width: `${
                          (d.value /
                            Math.max(...data.monthly.map((v) => v.value), 1)) *
                          100
                        }%`,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      width: 30,
                      fontSize: "0.75rem",
                      fontWeight: 900,
                      fontFamily: MONOSPACE,
                      textAlign: "right",
                    }}
                  >
                    {d.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* 地域別グラフ */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 900,
                mb: 1.5,
                display: "block",
                borderBottom: "1.5px solid black",
                pb: 0.5,
              }}
            >
              地域別公演数
            </Typography>
            <Stack spacing={0.8}>
              {data.region
                .sort((a, b) => b.value - a.value)
                .map((d) => (
                  <Box
                    key={d.label}
                    sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                  >
                    <Typography
                      sx={{ width: 80, fontSize: "0.75rem", fontWeight: 900 }}
                    >
                      {d.label}
                    </Typography>
                    <Box
                      sx={{
                        flexGrow: 1,
                        height: 6,
                        bgcolor: "#f0f0f0",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          bgcolor: "black",
                          width: `${
                            (d.value /
                              Math.max(...data.region.map((v) => v.value), 1)) *
                            100
                          }%`,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        width: 30,
                        fontSize: "0.75rem",
                        fontWeight: 900,
                        fontFamily: MONOSPACE,
                        textAlign: "right",
                      }}
                    >
                      {d.value}
                    </Typography>
                  </Box>
                ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
