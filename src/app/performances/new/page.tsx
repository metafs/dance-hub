"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  IconButton,
  Grid,
  CircularProgress,
  Alert,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ja";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewPerformancePage() {
  const router = useRouter();

  // 1. 状態管理（すべて関数冒頭に配置）
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [venues, setVenues] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");

  // 会場新規作成の状態
  const [isCreatingVenue, setIsCreatingVenue] = useState(false);
  const [newVenueName, setNewVenueName] = useState("");
  const [newVenueAddress, setNewVenueAddress] = useState("");
  const [newVenueRegion, setNewVenueRegion] = useState("");

  // 動的リストの状態
  const [schedules, setSchedules] = useState<Dayjs[]>([
    dayjs().add(1, "day").hour(19).minute(0),
  ]);
  const [ticketTypes, setTicketTypes] = useState([{ name: "一般", price: "" }]);

  // 地域の選択肢
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

  // 会場新規作成のハンドラー
  const handleCreateVenue = async () => {
    if (!newVenueName.trim() || !newVenueAddress.trim() || !newVenueRegion) {
      setError("会場名、住所、地域をすべて入力してください");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("venues")
        .insert({
          name: newVenueName.trim(),
          address: newVenueAddress.trim(),
          region: newVenueRegion,
        })
        .select()
        .single();

      if (error) throw error;

      // 新しい会場をリストに追加
      setVenues([...venues, data]);
      setSelectedVenueId(data.id);

      // フォームをリセット
      setNewVenueName("");
      setNewVenueAddress("");
      setNewVenueRegion("");
      setIsCreatingVenue(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 会場データの取得
  useEffect(() => {
    const fetchVenues = async () => {
      const { data } = await supabase
        .from("venues")
        .select("id, name, region")
        .order("name");
      if (data) setVenues(data);
    };
    fetchVenues();
  }, []);

  // 2. 統合された送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // --- バリデーション ---
      if (!title.trim()) throw new Error("タイトルを入力してください");
      if (!selectedVenueId) throw new Error("会場を選択してください");
      const selectedVenue = venues.find((v) => v.id === selectedVenueId);
      if (!selectedVenue) throw new Error("選択された会場が見つかりません");

      // --- A. 公演基本情報の保存 ---
      const { data: perfData, error: perfError } = await supabase
        .from("performances")
        .insert({
          title,
          description,
          organizer_id: "00000000-0000-0000-0000-000000000001", // テスト用
          performance_date: schedules[0].format("YYYY-MM-DD"),
          performance_time: schedules[0].format("HH:mm"),
          venue_name: selectedVenue.name,
          region: selectedVenue.region,
          ticket_url: ticketUrl || null,
          plan_type: "basic",
          status: "active",
          view_count: 0,
        })
        .select()
        .single();

      if (perfError) throw perfError;

      // --- C. スケジュールの保存 ---
      const schedInserts = schedules.map((date) => ({
        performance_id: perfData.id,
        start_at: date.toISOString(),
      }));
      const { error: schedErr } = await supabase
        .from("performance_schedules")
        .insert(schedInserts);
      if (schedErr) throw schedErr;

      // --- D. チケット価格の保存 ---
      const ticketInserts = ticketTypes
        .filter((t) => t.name && t.price)
        .map((t, index) => ({
          performance_id: perfData.id,
          name: t.name,
          price: t.price,
          display_order: index,
        }));

      if (ticketInserts.length > 0) {
        const { error: ticketErr } = await supabase
          .from("performance_ticket_types")
          .insert(ticketInserts);
        if (ticketErr) throw ticketErr;
      }

      router.push(`/performances/${perfData.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Typography variant="h2" sx={{ fontWeight: 900, mb: 6 }}>
          公演を作成
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 4, borderRadius: 0, fontWeight: 700 }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
                基本情報
              </Typography>
              <TextField
                fullWidth
                label="タイトル"
                variant="standard"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                InputLabelProps={{ sx: { fontWeight: 900, color: "black" } }}
                sx={{ mb: 4 }}
              />
              <TextField
                fullWidth
                label="説明"
                variant="standard"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                InputLabelProps={{ sx: { fontWeight: 900, color: "black" } }}
              />
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <FormControl variant="standard" fullWidth required>
                  <InputLabel sx={{ fontWeight: 900, color: "black" }}>
                    会場
                  </InputLabel>
                  <Select
                    value={selectedVenueId}
                    onChange={(e) => setSelectedVenueId(e.target.value)}
                  >
                    {venues.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.name} ({v.region})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="チケット / 申込URL"
                  variant="standard"
                  placeholder="https://..."
                  value={ticketUrl}
                  onChange={(e) => setTicketUrl(e.target.value)}
                  InputLabelProps={{ sx: { fontWeight: 900, color: "black" } }}
                />
              </Grid>
            </Grid>

            {/* チケット価格 */}
            <Box sx={{ p: 4, border: "2px solid black" }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>
                チケット種別
              </Typography>
              <Stack spacing={2}>
                {ticketTypes.map((type, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="flex-end"
                  >
                    <TextField
                      label="種別名"
                      variant="standard"
                      value={type.name}
                      onChange={(e) => {
                        const nt = [...ticketTypes];
                        nt[index].name = e.target.value;
                        setTicketTypes(nt);
                      }}
                      InputLabelProps={{
                        sx: { fontWeight: 900, color: "black" },
                      }}
                      sx={{ flexGrow: 2 }}
                    />
                    <TextField
                      label="料金"
                      variant="standard"
                      placeholder="¥3,000"
                      value={type.price}
                      onChange={(e) => {
                        const nt = [...ticketTypes];
                        nt[index].price = e.target.value;
                        setTicketTypes(nt);
                      }}
                      InputLabelProps={{
                        sx: { fontWeight: 900, color: "black" },
                      }}
                      sx={{ flexGrow: 1 }}
                    />
                    <IconButton
                      onClick={() =>
                        setTicketTypes(
                          ticketTypes.filter((_, i) => i !== index)
                        )
                      }
                      disabled={ticketTypes.length === 1}
                      sx={{ color: "black" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
              <Button
                startIcon={<AddIcon />}
                onClick={() =>
                  setTicketTypes([...ticketTypes, { name: "", price: "" }])
                }
                sx={{
                  mt: 3,
                  fontWeight: 900,
                  color: "black",
                  border: "1.5px solid black",
                  borderRadius: 0,
                }}
              >
                種別を追加
              </Button>
            </Box>

            {/* スケジュール */}
            <Box sx={{ p: 4, border: "2px solid black", bgcolor: "#f9f9f9" }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>
                スケジュール
              </Typography>
              <Stack spacing={3}>
                {schedules.map((date, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <DateTimePicker
                      label={`公演 #${index + 1}`}
                      value={date}
                      onChange={(val) => {
                        const ns = [...schedules];
                        if (val) ns[index] = val;
                        setSchedules(ns);
                      }}
                      slotProps={{
                        textField: { variant: "standard", fullWidth: true },
                      }}
                    />
                    <IconButton
                      onClick={() =>
                        setSchedules(schedules.filter((_, i) => i !== index))
                      }
                      disabled={schedules.length === 1}
                      sx={{ color: "black" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
              <Button
                startIcon={<AddIcon />}
                onClick={() =>
                  setSchedules([
                    ...schedules,
                    dayjs().add(1, "day").hour(19).minute(0),
                  ])
                }
                sx={{
                  mt: 3,
                  fontWeight: 900,
                  color: "black",
                  border: "1.5px solid black",
                  borderRadius: 0,
                }}
              >
                日程を追加
              </Button>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
              sx={{
                bgcolor: "black",
                color: "white",
                py: 2,
                fontWeight: 900,
                borderRadius: 0,
                fontSize: "1.2rem",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              {loading ? "保存中..." : "公演を公開"}
            </Button>
          </Stack>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}
