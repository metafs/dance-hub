"use client";

import React, { useState, useCallback } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  onDelete: () => void;
  currentImageUrl?: string;
}

export const ImageUpload = ({
  onUploadSuccess,
  onDelete,
  currentImageUrl,
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // ファイル選択・ドロップ時のハンドラ
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // バリデーション
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    setIsUploading(true);
    try {
      // 親コンポーネントにファイルを渡し、アップロード処理自体はページ側で行う形も可能ですが、
      // ここではプレビュー用のURL作成を想定（実際の保存はSubmit時）
      const reader = new FileReader();
      reader.onloadend = () => {
        onUploadSuccess(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      setIsUploading(false);
    }
  };

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      sx={{
        width: "100%",
        height: "300px",
        border: "2px dashed",
        borderColor: isDragging ? "primary.main" : "black",
        bgcolor: isDragging ? "rgba(0,0,0,0.02)" : "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        transition: "0.2s",
        overflow: "hidden",
      }}
    >
      {isUploading ? (
        <CircularProgress color="inherit" />
      ) : currentImageUrl ? (
        <>
          <Box
            component="img"
            src={currentImageUrl}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Box
            sx={{ position: "absolute", top: 10, right: 10, bgcolor: "white" }}
          >
            <IconButton onClick={onDelete} size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            style={{
              position: "absolute",
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <UploadIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography sx={{ fontWeight: 900 }}>DRAG & DROP IMAGE</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.5 }}>
            OR CLICK TO BROWSE
          </Typography>
        </>
      )}
    </Box>
  );
};
