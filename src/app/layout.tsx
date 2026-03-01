import { MUIProvider } from "@/components/MUIProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Box } from "@mui/material";

export const metadata = {
  title: "DANCE HUB",
  description: "関東のコンテンポラリーダンス情報プラットフォーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <MUIProvider>
          {/* Flexboxを使ってFooterを常に最下部に固定する構造 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </MUIProvider>
      </body>
    </html>
  );
}
