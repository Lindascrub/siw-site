import { Link } from "@tanstack/react-router";
import { AppLink } from "./AppLink";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { posterUrl } from "../lib/api";
import { directorName, formatDuration } from "../lib/format";
import { Stars } from "./Stars";
import type { MovieDTO } from "../lib/types";

/** Card film in stile locandina, con hover zoom come nei siti di festival. */
export function MovieCard({ movie }: { movie: MovieDTO }) {
  const poster = posterUrl(movie.posterFilename);
  return (
    <AppLink
      
      to="/film/$id"
      params={{ id: String(movie.id) }}
      sx={{
        display: "block",
        minWidth: 0, // altrimenti in una grid il titolo segnaposto (senza locandina) forza la colonna ad allargarsi, sbilanciando le altre
        textDecoration: "none",
        color: "inherit",
        "&:hover img": { transform: "scale(1.05)" },
        "&:hover .movie-title": { color: "primary.main" },
      }}
    >
      <Box sx={{ overflow: "hidden", bgcolor: "#111", aspectRatio: "3 / 4" }}>
        {poster ? (
          <Box
            component="img"
            src={poster}
            alt={`Locandina di ${movie.title}`}
            loading="lazy"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform .5s",
            }}
          />
        ) : (
          <Box sx={{ display: "grid", placeItems: "center", height: "100%", p: 2, minWidth: 0 }}>
            <Typography
              variant="h4"
              sx={{ color: "primary.main", textAlign: "center", overflowWrap: "break-word", width: "100%" }}
            >
              {movie.title}
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ mt: 1.5, display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Box>
          <Typography variant="h6" className="movie-title" sx={{ fontSize: 18, lineHeight: 1.1 }}>
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {directorName(movie)}
            {movie.year ? ` · ${movie.year}` : ""}
          </Typography>
        </Box>
        {movie.genre && <Chip label={movie.genre} size="small" variant="outlined" />}
      </Box>
      <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mt: 0.5 }}>
        {movie.reviewCount > 0 && movie.avgRating !== null ? (
          <>
            <Stars vote={movie.avgRating} size="small" />
            <Typography variant="caption" color="text.secondary">
              {movie.avgRating.toFixed(1)} ({movie.reviewCount})
            </Typography>
          </>
        ) : (
          <Typography variant="caption" color="text.disabled" sx={{ fontStyle: "italic" }}>
            Non ancora valutato
          </Typography>
        )}
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {formatDuration(movie.duration)}
      </Typography>
    </AppLink>
  );
}
