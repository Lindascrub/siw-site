import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { MovieCard } from "../components/MovieCard";
import { fetchMovieGenres, fetchMovies } from "../lib/data";
import type { MovieDTO } from "../lib/types";

const PAGE_SIZE = 20;
const ALL_GENRES = "__all__";
type SortBy = "title" | "year" | "duration";
const SORT_OPTIONS: { value: `${SortBy}-${"asc" | "desc"}`; label: string }[] = [
  { value: "title-asc", label: "Titolo (A-Z)" },
  { value: "title-desc", label: "Titolo (Z-A)" },
  { value: "year-desc", label: "Anno (più recenti)" },
  { value: "year-asc", label: "Anno (meno recenti)" },
  { value: "duration-asc", label: "Durata (crescente)" },
  { value: "duration-desc", label: "Durata (decrescente)" },
];

export const Route = createFileRoute("/film/")({
  head: () => ({
    meta: [
      { title: "Catalogo Film — CineFest" },
      {
        name: "description",
        content: "Sfoglia e cerca tutti i film in programmazione ai festival.",
      },
      { property: "og:title", content: "Catalogo Film — CineFest" },
      {
        property: "og:description",
        content: "Sfoglia e cerca tutti i film in programmazione ai festival.",
      },
    ],
  }),
  component: MovieCatalogPage,
});

function MovieCatalogPage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState(ALL_GENRES);
  const [genres, setGenres] = useState<string[]>([]);
  const [sort, setSort] = useState<`${SortBy}-${"asc" | "desc"}`>("title-asc");
  const [page, setPage] = useState(0); // 0-based, come l'API
  const [movies, setMovies] = useState<MovieDTO[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchMovieGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  // ogni nuova ricerca/filtro/ordinamento riparte dalla prima pagina
  useEffect(() => {
    setPage(0);
  }, [search, genre, sort]);

  useEffect(() => {
    setLoading(true);
    const [sortBy, sortDir] = sort.split("-") as [SortBy, "asc" | "desc"];
    const handle = setTimeout(() => {
      void fetchMovies({
        search: search || undefined,
        genre: genre === ALL_GENRES ? undefined : genre,
        page,
        size: PAGE_SIZE,
        sortBy,
        sortDir,
      })
        .then((p) => {
          setMovies(p.content);
          setTotalPages(p.totalPages);
          setTotalElements(p.totalElements);
        })
        .catch(() => {
          setMovies([]);
          setTotalPages(1);
          setTotalElements(0);
        })
        .finally(() => setLoading(false));
    }, 250); // debounce
    return () => clearTimeout(handle);
  }, [search, genre, sort, page]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{ justifyContent: "space-between", alignItems: { md: "flex-end" }, borderBottom: 2, borderColor: "text.primary", pb: 3 }}
      >
        <Box>
          <Typography variant="overline" color="primary">
            Catalogo
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: 44, sm: 60 } }}>
            Tutti i Film
          </Typography>
        </Box>
        <TextField
          label="Cerca"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Titolo, regista o genere…"
          sx={{ width: { xs: "100%", md: 320 } }}
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel>Genere</InputLabel>
          <Select label="Genere" value={genre} onChange={(e) => setGenre(e.target.value)}>
            <MenuItem value={ALL_GENRES}>Tutti i generi</MenuItem>
            {genres.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel>Ordina per</InputLabel>
          <Select label="Ordina per" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            {SORT_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {loading ? (
        <Typography color="text.secondary" sx={{ mt: 5 }}>
          Caricamento…
        </Typography>
      ) : movies.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 5 }}>
          Nessun film trovato{search ? ` per “${search}”` : ""}.
        </Typography>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            {totalElements} film{totalPages > 1 ? ` · pagina ${page + 1} di ${totalPages}` : ""}
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gap: 3,
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
            }}
          >
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </Box>
          {totalPages > 1 && (
            <Stack sx={{ mt: 6, alignItems: "center" }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(_e, value) => setPage(value - 1)}
                color="primary"
                shape="rounded"
              />
            </Stack>
          )}
        </>
      )}
    </Container>
  );
}
