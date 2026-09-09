import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { posterUrl } from "../lib/api";

interface FestivalCarouselProps {
  filenames: string[];
}

/**
 * Galleria immagini del festival: striscia orizzontale di foto che scorre
 * con una transizione CSS (transform + transition), niente librerie
 * esterne. Le frecce compaiono solo se c'e' piu' di una foto - con una
 * sola foto (o zero) non avrebbe senso mostrarle.
 */
export function FestivalCarousel({ filenames }: FestivalCarouselProps) {
  const [index, setIndex] = useState(0);

  if (filenames.length === 0) return null;

  function prev() {
    setIndex((i) => (i - 1 + filenames.length) % filenames.length);
  }
  function next() {
    setIndex((i) => (i + 1) % filenames.length);
  }

  return (
    <Box sx={{ position: "relative", overflow: "hidden", borderRadius: 1, bgcolor: "#111" }}>
      <Box
        sx={{
          display: "flex",
          width: `${filenames.length * 100}%`,
          transform: `translateX(-${(index * 100) / filenames.length}%)`,
          transition: "transform 0.5s ease",
        }}
      >
        {filenames.map((f, i) => (
          <Box
            key={i}
            component="img"
            src={posterUrl(f) ?? ""}
            alt={`Foto ${i + 1} del festival`}
            sx={{
              width: `${100 / filenames.length}%`,
              aspectRatio: "16 / 9",
              objectFit: "cover",
              flexShrink: 0,
              display: "block",
            }}
          />
        ))}
      </Box>

      {filenames.length > 1 && (
        <>
          <IconButton
            onClick={prev}
            aria-label="Foto precedente"
            sx={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={next}
            aria-label="Foto successiva"
            sx={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>

          <Box sx={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 0.5 }}>
            {filenames.map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: i === index ? "#fff" : "rgba(255,255,255,0.4)",
                  transition: "background-color 0.3s",
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
