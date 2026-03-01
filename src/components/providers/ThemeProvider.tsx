"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

export function MUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        {/* CssBaselineはブラウザ間の差異をなくし、背景色などをテーマに合わせる */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
