import { Link } from "@tanstack/react-router";
import { AppLink } from "./AppLink";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { demoPosters } from "../lib/demo-data";
import { posterUrl } from "../lib/api";
import { directorName, formatDuration } from "../lib/format";
import type { MovieDTO } from "../lib/types";

/** Card film in stile locandina, con hover zoom come nei siti di festival. */
export function MovieCard({ movie }: { movie: MovieDTO }) {
  // priorita' alla locandina vera caricata da admin; il placeholder demo
  // resta solo come fallback decorativo per i film che non ne hanno ancora una
  const poster = posterUrl(movie.posterFilename) ?? demoPosters[movie.id];
  return (
    <AppLink
      
      to="/film/$id"
      params={{ id: String(movie.id) }}
      sx={{
        display: "block",
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
          <Box sx={{ display: "grid", placeItems: "center", height: "100%", p: 2 }}>
            <Typography variant="h4" sx={{ color: "primary.main", textAlign: "center" }}>
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
      <Typography variant="caption" color="text.secondary">
        {formatDuration(movie.duration)}
      </Typography>
    </AppLink>
  );
}
