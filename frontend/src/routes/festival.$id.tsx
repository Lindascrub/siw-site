import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLink } from "../components/AppLink";
import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { MovieCard } from "../components/MovieCard";
import { ApiError } from "../lib/api";
import { fetchFestival, fetchFestivalMovies, fetchFestivalScreenings } from "../lib/data";
import { formatDate, formatDateShort, formatTime } from "../lib/format";
import type { FestivalDTO, MovieDTO, ScreeningDTO } from "../lib/types";

export const Route = createFileRoute("/festival/$id")({
  head: () => ({
    meta: [
      { title: "Festival — CineFest" },
      { name: "description", content: "Dettagli del festival e programma delle proiezioni." },
      { property: "og:title", content: "Festival — CineFest" },
      { property: "og:description", content: "Dettagli del festival e programma delle proiezioni." },
    ],
  }),
  component: FestivalDetailPage,
});

function FestivalDetailPage() {
  const { id } = Route.useParams();
  const festivalId = Number(id);

  const [festival, setFestival] = useState<FestivalDTO | null>(null);
  const [movies, setMovies] = useState<MovieDTO[]>([]);
  const [screenings, setScreenings] = useState<ScreeningDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("");

  const screeningDates = useMemo(
    () => Array.from(new Set(screenings.map((s) => s.date))).sort(),
    [screenings],
  );
  const filteredScreenings = useMemo(
    () => (dateFilter ? screenings.filter((s) => s.date === dateFilter) : screenings),
    [screenings, dateFilter],
  );

  useEffect(() => {
    void fetchFestival(festivalId)
      .then(setFestival)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Festival non trovato"));
    void fetchFestivalMovies(festivalId).then(setMovies).catch(() => setMovies([]));
    void fetchFestivalScreenings(festivalId)
      .then((s) =>
        setScreenings(
          [...s].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)),
        ),
      )
      .catch(() => setScreenings([]));
  }, [festivalId]);

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h3">Festival non trovato</Typography>
        <Button component={Link} to="/festival" sx={{ mt: 3 }}>
          ← Tutti i festival
        </Button>
      </Container>
    );
  }
  if (!festival) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography color="text.secondary">Caricamento…</Typography>
      </Container>
    );
  }

  return (
    <Box>
      <Box sx={{ bgcolor: "#111", color: "#fff" }}>
        <Container maxWidth="lg" sx={{ py: 7 }}>
          <Button component={Link} to="/festival" color="inherit" sx={{ opacity: 0.7 }}>
            ← Festival
          </Button>
          <Typography variant="overline" color="primary" sx={{ display: "block", mt: 3 }}>
            {festival.city ?? ""}
            {festival.year ? ` · Edizione ${festival.year}` : ""}
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: 44, sm: 80 } }}>
            {festival.name}
          </Typography>
          <Typography sx={{ mt: 2, fontWeight: 700, color: "primary.main" }}>
            {formatDate(festival.startDate)} — {formatDate(festival.endDate)}
          </Typography>
          {festival.description && (
            <Typography sx={{ mt: 2, maxWidth: 640, color: "rgba(255,255,255,.7)" }}>
              {festival.description}
            </Typography>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 7 }}>
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: 28, sm: 36 }, borderBottom: 2, borderColor: "text.primary", pb: 1.5 }}
        >
          Programma Proiezioni
        </Typography>
        {screenings.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 4 }}>
            Il programma sarà pubblicato a breve.
          </Typography>
        ) : (
          <>
            <Stack direction="row" spacing={2} sx={{ mt: 3, alignItems: "center", flexWrap: "wrap" }}>
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel>Data</InputLabel>
                <Select label="Data" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                  <MenuItem value="">Tutte le date</MenuItem>
                  {screeningDates.map((d) => (
                    <MenuItem key={d} value={d}>
                      {formatDateShort(d)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {dateFilter && (
                <Button size="small" onClick={() => setDateFilter("")}>
                  Azzera filtro
                </Button>
              )}
            </Stack>
            {filteredScreenings.length === 0 ? (
              <Typography color="text.secondary" sx={{ mt: 3 }}>
                Nessuna proiezione in questa data.
              </Typography>
            ) : (
          <TableContainer sx={{ mt: 3 }}>
            <Table sx={{ minWidth: 640 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Ora</TableCell>
                  <TableCell>Film</TableCell>
                  <TableCell>Sala</TableCell>
                  <TableCell>Stato</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredScreenings.map((s) => (
                  <TableRow key={s.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{formatDateShort(s.date)}</TableCell>
                    <TableCell sx={{ color: "primary.main", fontWeight: 800, fontSize: 18 }}>
                      {formatTime(s.time)}
                    </TableCell>
                    <TableCell>
                      <AppLink
                        
                        to="/film/$id"
                        params={{ id: String(s.movie.id) }}
                        sx={{ fontWeight: 700, color: "inherit", textDecoration: "none", "&:hover": { color: "primary.main" } }}
                      >
                        {s.movie.title}
                      </AppLink>
                      {s.movie.director && (
                        <Box component="span" sx={{ color: "text.secondary" }}>
                          {" "}· {s.movie.director.name} {s.movie.director.surname}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{s.hall.name}</TableCell>
                    <TableCell>
                      <Chip label={s.status} size="small" variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
            )}
          </>
        )}
      </Container>

      <Box sx={{ bgcolor: "grey.100" }}>
        <Container maxWidth="lg" sx={{ py: 7 }}>
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: 28, sm: 36 }, borderBottom: 2, borderColor: "text.primary", pb: 1.5 }}
          >
            I Film del Festival
          </Typography>
          {movies.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 4 }}>
              Nessun film associato a questo festival.
            </Typography>
          ) : (
            <Box
              sx={{
                mt: 4,
                display: "grid",
                gap: 3,
                gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
              }}
            >
              {movies.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
}
