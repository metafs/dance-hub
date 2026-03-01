"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  // パレットの設定：白・黒・グレーのみに絞り、洗練された印象に
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#666666",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#666666",
    },
    divider: "#e0e0e0",
  },

  // タイポグラフィ：太字を強調し、レタースペーシングを調整
  typography: {
    fontFamily: '"Inter", "Noto Sans JP", sans-serif',
    h1: { fontWeight: 900, letterSpacing: "-0.05em" },
    h2: { fontWeight: 800, letterSpacing: "-0.03em" },
    h3: { fontWeight: 800, letterSpacing: "-0.02em" },
    h5: { fontWeight: 800, letterSpacing: "-0.01em" },
    h6: { fontWeight: 800 },
    subtitle1: { fontWeight: 700 },
    body1: { lineHeight: 1.8 },
    button: {
      textTransform: "none", // ボタンを大文字に強制しない
      fontWeight: 600,
    },
  },

  // コンポーネントごとのデフォルトスタイル（Overrides）
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // 角を直角に
          padding: "12px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            opacity: 0.7,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0, // フィルタのチップも直角
          fontWeight: 500,
          transition: "all 0.2s ease",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0, // 入力欄も直角
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#000000",
          borderBottom: "1px solid #e0e0e0",
        },
      },
    },
  },
});

// レスポンシブフォント（画面サイズに合わせて自動で文字サイズを調整）
theme = responsiveFontSizes(theme);

export default theme;
