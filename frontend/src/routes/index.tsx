import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLink } from "../components/AppLink";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { MovieCard } from "../components/MovieCard";
import { fetchFestivals, fetchMovies } from "../lib/data";
import { formatDate } from "../lib/format";
import type { FestivalDTO, MovieDTO } from "../lib/types";
import heroImage from "../assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CineFest — Festival del Cinema" },
      {
        name: "description",
        content:
          "Scopri i festival cinematografici, sfoglia il catalogo dei film e leggi le recensioni del pubblico.",
      },
      { property: "og:title", content: "CineFest — Festival del Cinema" },
      {
        property: "og:description",
        content: "Festival, film in concorso, proiezioni e recensioni.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [festivals, setFestivals] = useState<FestivalDTO[]>([]);
  const [movies, setMovies] = useState<MovieDTO[]>([]);

  useEffect(() => {
    void fetchFestivals().then(setFestivals).catch(() => setFestivals([]));
    void fetchMovies(undefined, 0, 4).then((p) => setMovies(p.content)).catch(() => setMovies([]));
  }, []);

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={heroImage}
          alt="Folla davanti all'insegna luminosa di un cinema durante il festival"
          sx={{ height: { xs: 420, md: "70vh" }, width: "100%", objectFit: "cover", display: "block" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(17,17,17,.85), rgba(17,17,17,0) 60%)",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "absolute", inset: "auto 0 0 0", pb: 5, color: "#fff" }}>
          <Typography variant="overline" sx={{ color: "rgba(255,255,255,.8)" }}>
            Festival · Anteprime · Retrospettive
          </Typography>
          <Typography variant="h1" sx={{ mt: 1, fontSize: { xs: 56, sm: 96 } }}>
            Cine<Box component="span" sx={{ color: "primary.main" }}>Fest</Box>
          </Typography>
          <Typography sx={{ mt: 2, maxWidth: 520, color: "rgba(255,255,255,.85)" }}>
            I festival cinematografici italiani in un unico posto: catalogo dei film, programma
            delle proiezioni e recensioni del pubblico.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap" }}>
            <Button component={Link} to="/film" variant="contained" size="large">
              Sfoglia i film
            </Button>
            <Button component={Link} to="/festival" variant="outlined" color="inherit" size="large">
              I festival
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Festival */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "flex-end", borderBottom: 2, borderColor: "text.primary", pb: 1.5 }}
        >
          <Typography variant="h2" sx={{ fontSize: { xs: 36, sm: 48 } }}>
            I Festival
          </Typography>
          <Button component={Link} to="/festival" color="primary">
            Tutti →
          </Button>
        </Stack>
        <Box sx={{ mt: 4, display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
          {festivals.map((f) => (
            <AppLink
              key={f.id}
              to="/festival/$id"
              params={{ id: String(f.id) }}
              sx={{
                p: 3,
                border: 1,
                borderColor: "divider",
                textDecoration: "none",
                color: "inherit",
                transition: "border-color .2s",
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Typography variant="overline" color="primary">
                {f.city ?? ""}
              </Typography>
              <Typography variant="h5" sx={{ mt: 0.5 }}>
                {f.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {formatDate(f.startDate)} — {formatDate(f.endDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                {f.description}
              </Typography>
            </AppLink>
          ))}
          {festivals.length === 0 && (
            <Typography color="text.secondary">Nessun festival disponibile al momento.</Typography>
          )}
        </Box>
      </Container>

      {/* Film */}
      <Box sx={{ bgcolor: "grey.100" }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "flex-end", borderBottom: 2, borderColor: "text.primary", pb: 1.5 }}
          >
            <Typography variant="h2" sx={{ fontSize: { xs: 32, sm: 48 } }}>
              In Programmazione
            </Typography>
            <Button component={Link} to="/film" color="primary">
              Catalogo →
            </Button>
          </Stack>
          <Box
            sx={{
              mt: 4,
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
            }}
          >
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
