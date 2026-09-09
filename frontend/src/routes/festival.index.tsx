import { createFileRoute } from "@tanstack/react-router";
import { AppLink } from "../components/AppLink";
import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import { fetchFestivals } from "../lib/data";
import { formatDate } from "../lib/format";
import type { FestivalDTO } from "../lib/types";

const ALL = "__all__";

export const Route = createFileRoute("/festival/")({
  head: () => ({
    meta: [
      { title: "I Festival — CineFest" },
      {
        name: "description",
        content: "Tutti i festival cinematografici: date, città e programma delle proiezioni.",
      },
      { property: "og:title", content: "I Festival — CineFest" },
      {
        property: "og:description",
        content: "Tutti i festival cinematografici: date, città e programma delle proiezioni.",
      },
    ],
  }),
  component: FestivalsPage,
});

function FestivalsPage() {
  const [allFestivals, setAllFestivals] = useState<FestivalDTO[] | null>(null);
  const [city, setCity] = useState(ALL);
  const [year, setYear] = useState(ALL);

  useEffect(() => {
    void fetchFestivals()
      .then(setAllFestivals)
      .catch(() => setAllFestivals([]));
  }, []);

  const cities = useMemo(
    () => Array.from(new Set((allFestivals ?? []).map((f) => f.city).filter((c): c is string => !!c))).sort(),
    [allFestivals],
  );

  const years = useMemo(
    () =>
      Array.from(new Set((allFestivals ?? []).map((f) => f.year).filter((y): y is number => y !== null))).sort(
        (a, b) => b - a,
      ),
    [allFestivals],
  );

  const festivals = useMemo(() => {
    return (allFestivals ?? []).filter((f) => {
      if (city !== ALL && f.city !== city) return false;
      if (year !== ALL && String(f.year) !== year) return false;
      return true;
    });
  }, [allFestivals, city, year]);

  const hasActiveFilters = city !== ALL || year !== ALL;

  function clearFilters() {
    setCity(ALL);
    setYear(ALL);
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="overline" color="primary">
        Edizioni
      </Typography>
      <Typography
        variant="h1"
        sx={{ fontSize: { xs: 44, sm: 60 }, borderBottom: 2, borderColor: "text.primary", pb: 3 }}
      >
        I Festival
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Città</InputLabel>
          <Select label="Città" value={city} onChange={(e) => setCity(e.target.value)}>
            <MenuItem value={ALL}>Tutte le città</MenuItem>
            {cities.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Anno</InputLabel>
          <Select label="Anno" value={year} onChange={(e) => setYear(e.target.value)}>
            <MenuItem value={ALL}>Tutti gli anni</MenuItem>
            {years.map((y) => (
              <MenuItem key={y} value={String(y)}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {hasActiveFilters && (
          <Button variant="text" onClick={clearFilters}>
            Azzera filtri
          </Button>
        )}
      </Stack>

      {!allFestivals ? (
        <Typography color="text.secondary" sx={{ mt: 5 }}>
          Caricamento…
        </Typography>
      ) : festivals.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 5 }}>
          Nessun festival trovato.
        </Typography>
      ) : (
        <Box
          sx={{
            mt: 5,
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
          }}
        >
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
                "&:hover": { borderColor: "primary.main" },
              }}
            >
              <Typography variant="overline" color="primary">
                {f.city ?? ""}
                {f.year ? ` · ${f.year}` : ""}
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
        </Box>
      )}
    </Container>
  );
}
