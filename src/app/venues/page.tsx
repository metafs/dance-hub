"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  TextField,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  ButtonBase,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { supabase } from "@/lib/supabase";
import NextLink from "next/link";

// Leaflet 関連のインポート（クライアントサイドのみで動作させるための工夫が必要）
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet のデフォルトアイコン設定の修正（Next.js でアイコンが消える問題の対策）
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Venue {
  id: string;
  name: string;
  address: string;
  region: string;
  description: string;
  website_url: string;
  lat: number;
  lng: number;
}

const regions = [
  "東京23区",
  "多摩エリア",
  "神奈川",
  "埼玉",
  "千葉",
  "群馬",
  "栃木",
  "茨城",
];

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      setVenues(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === "all" || v.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 30 }}>
        <CircularProgress color="inherit" />
      </Box>
    );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 10 } }}>
      <Typography
        variant="h1"
        sx={{ fontWeight: 900, mb: 2, fontSize: { xs: "3rem", md: "5rem" } }}
      >
        Venues
      </Typography>

      {/* マップセクション */}
      <Box
        sx={{
          height: "500px",
          width: "100%",
          mb: 8,
          border: "2px solid black",
          zIndex: 1,
          position: "relative",
        }}
      >
        <MapContainer
          center={[35.6895, 139.6917]}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredVenues.map(
            (venue) =>
              venue.lat &&
              venue.lng && (
                <Marker key={venue.id} position={[venue.lat, venue.lng]}>
                  <Tooltip
                    direction="top"
                    offset={[0, -20]}
                    opacity={1}
                    permanent={false}
                  >
                    <Box sx={{ p: 1, maxWidth: 200 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                        {venue.name}
                      </Typography>
                      <Typography variant="caption" sx={{ display: "block" }}>
                        {venue.address}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "primary.main", fontWeight: 700 }}
                      >
                        Click to see website ›
                      </Typography>
                    </Box>
                  </Tooltip>
                </Marker>
              )
          )}
        </MapContainer>
      </Box>

      {/* 検索・フィルタ */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        sx={{ mb: 8 }}
        alignItems="flex-end"
      >
        <TextField
          variant="standard"
          label="SEARCH VENUE"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputLabelProps={{ sx: { fontWeight: 900, color: "black" } }}
        />
        <FormControl variant="standard" sx={{ minWidth: 200 }}>
          <InputLabel sx={{ fontWeight: 900, color: "black" }}>
            LOCATIONS
          </InputLabel>
          <Select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <MenuItem value="all">ALL LOCATIONS</MenuItem>
            {regions.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* グリッド表示 */}
      <Grid container spacing={3}>
        {filteredVenues.map((venue) => (
          <Grid item xs={12} sm={6} md={4} key={venue.id}>
            <ButtonBase
              component={NextLink}
              href={`/venues/${venue.id}`} // ここを変更
              sx={{ width: "100%", textAlign: "left", display: "block" }}
            >
              <Paper
                elevation={0}
                sx={{
                  border: "2px solid black",
                  p: 3,
                  height: "300px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "0.2s",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 900, mb: 1, display: "block" }}
                  >
                    {venue.region.toUpperCase()}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
                    {venue.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {venue.description}
                  </Typography>
                </Box>
                <ArrowForwardIcon />
              </Paper>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
