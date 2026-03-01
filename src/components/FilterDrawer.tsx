"use client";

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  alpha,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Region } from "@/types/database";

// 日付フィルターの型定義
export type DateFilterType = "all" | "today" | "weekend" | "month";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedRegions: Region[];
  onRegionChange: (region: Region) => void;
  onClearFilters: () => void;
  // 日付フィルター用のProps
  selectedDateFilter: DateFilterType;
  onDateFilterChange: (filter: DateFilterType) => void;
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

export const FilterDrawer = ({
  open,
  onClose,
  selectedRegions,
  onRegionChange,
  onClearFilters,
  selectedDateFilter,
  onDateFilterChange,
}: FilterDrawerProps) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: alpha("#000", 0.1) },
        },
      }}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          borderRadius: 0,
          p: 4,
          boxShadow: "none",
          borderLeft: "1px solid black",
        },
      }}
    >
      {/* ヘッダー */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 6,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}
        >
          FILTER
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "black" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Stack spacing={6}>
        {/* 地域フィルター */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 900,
              mb: 3,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Region / 地域
          </Typography>
          <FormGroup>
            {regions.map((region) => (
              <FormControlLabel
                key={region}
                control={
                  <Checkbox
                    checked={selectedRegions.includes(region)}
                    onChange={() => onRegionChange(region)}
                    sx={{
                      color: "black",
                      "&.Mui-checked": { color: "black" },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: selectedRegions.includes(region) ? 700 : 400,
                    }}
                  >
                    {region}
                  </Typography>
                }
                sx={{ mb: 0.5 }}
              />
            ))}
          </FormGroup>
        </Box>

        {/* 日付フィルター */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 900,
              mb: 3,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Date / 日程
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {[
              { label: "すべて", value: "all" },
              { label: "今日", value: "today" },
              { label: "今週末", value: "weekend" },
              { label: "今月", value: "month" },
            ].map((item) => (
              <Button
                key={item.value}
                variant="outlined"
                onClick={() => onDateFilterChange(item.value as DateFilterType)}
                sx={{
                  borderRadius: 0,
                  flexGrow: 1,
                  minWidth: "80px",
                  mb: 1,
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: selectedDateFilter === item.value ? "white" : "black",
                  bgcolor:
                    selectedDateFilter === item.value ? "black" : "transparent",
                  borderColor: "black",
                  borderWidth: "1px",
                  "&:hover": {
                    bgcolor:
                      selectedDateFilter === item.value
                        ? "#333"
                        : alpha("#000", 0.05),
                    borderColor: "black",
                    borderWidth: "1px",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Box>
      </Stack>

      {/* 下部アクションボタン */}
      <Box sx={{ mt: "auto", pt: 4 }}>
        <Divider sx={{ mb: 3, borderColor: "black" }} />
        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            onClick={onClearFilters}
            sx={{
              color: "black",
              fontWeight: 700,
              textDecoration: "underline",
              "&:hover": {
                textDecoration: "underline",
                bgcolor: "transparent",
                opacity: 0.6,
              },
            }}
          >
            Clear All
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={onClose}
            sx={{
              borderRadius: 0,
              bgcolor: "black",
              color: "white",
              fontWeight: 700,
              py: 1.5,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Apply
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};
