import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { MovieCard } from "../components/MovieCard";
import { fetchMovies } from "../lib/data";
import type { MovieDTO } from "../lib/types";

const PAGE_SIZE = 12;

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
  const [page, setPage] = useState(0); // 0-based, come l'API
  const [movies, setMovies] = useState<MovieDTO[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // ogni nuova ricerca riparte dalla prima pagina
  useEffect(() => {
    setPage(0);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const handle = setTimeout(() => {
      void fetchMovies(search || undefined, page, PAGE_SIZE)
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
  }, [search, page]);

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
            {totalElements} {totalElements === 1 ? "film" : "film"}
            {totalPages > 1 ? ` · pagina ${page + 1} di ${totalPages}` : ""}
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
