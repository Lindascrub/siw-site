import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLink } from "../components/AppLink";
import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { ApiError, posterUrl } from "../lib/api";
import { useAuth } from "../lib/auth";
import { editReview, fetchMovie, fetchMovieReviews, removeReview, submitReview } from "../lib/data";
import { formatDate, formatDuration, formatTime } from "../lib/format";
import { Stars, StarPicker } from "../components/Stars";
import type { MovieDTO, ReviewDTO } from "../lib/types";

export const Route = createFileRoute("/film/$id")({
  head: () => ({
    meta: [
      { title: "Film — CineFest" },
      { name: "description", content: "Dettagli del film, il regista, i festival e le recensioni." },
      { property: "og:title", content: "Film — CineFest" },
      { property: "og:description", content: "Dettagli del film, il regista, i festival e le recensioni." },
    ],
  }),
  component: MovieDetailPage,
});

function MovieDetailPage() {
  const { id } = Route.useParams();
  const movieId = Number(id);
  const { user } = useAuth();

  const [movie, setMovie] = useState<MovieDTO | null>(null);
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [reviewText, setReviewText] = useState("");
  const [reviewVote, setReviewVote] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadReviews = () => fetchMovieReviews(movieId).then(setReviews).catch(() => setReviews([]));

  useEffect(() => {
    void fetchMovie(movieId)
      .then(setMovie)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Film non trovato"));
    void loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  const [reviewSort, setReviewSort] = useState<"recent" | "oldest" | "positive" | "negative">("recent");

  const canReview = !!user && user.role.toUpperCase() === "USER";
  const myReview = user ? reviews.find((r) => r.userId === user.id) : undefined;

  const otherReviews = useMemo(() => {
    const list = reviews.filter((r) => r.id !== myReview?.id);
    switch (reviewSort) {
      case "oldest":
        return [...list].sort((a, b) => a.date.localeCompare(b.date));
      case "positive":
        return [...list].sort((a, b) => b.vote - a.vote);
      case "negative":
        return [...list].sort((a, b) => a.vote - b.vote);
      case "recent":
      default:
        return [...list].sort((a, b) => b.date.localeCompare(a.date));
    }
  }, [reviews, myReview, reviewSort]);

  function startEdit(r: ReviewDTO) {
    setEditingId(r.id);
    setReviewText(r.text);
    setReviewVote(r.vote);
  }

  function resetForm() {
    setEditingId(null);
    setReviewText("");
    setReviewVote(0);
  }

  async function handleSubmit() {
    if (!reviewText.trim() || reviewVote < 1) {
      setFormError("Inserisci un testo e un voto da 1 a 5 stelle.");
      return;
    }
    setBusy(true);
    setFormError(null);
    setNotice(null);
    try {
      const wasEditing = !!editingId;
      if (editingId) {
        await editReview(editingId, reviewText.trim(), reviewVote);
      } else if (user) {
        await submitReview(movieId, reviewText.trim(), reviewVote);
      }
      resetForm();
      await loadReviews();
      setNotice(wasEditing ? "Recensione aggiornata." : "Recensione inviata, grazie!");
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : "Operazione non riuscita");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(reviewId: number) {
    if (!window.confirm("Eliminare la recensione? L'operazione non è reversibile.")) return;
    setBusy(true);
    setNotice(null);
    try {
      await removeReview(reviewId);
      if (editingId === reviewId) resetForm();
      await loadReviews();
      setNotice("Recensione eliminata.");
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : "Eliminazione non riuscita");
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h3">Film non trovato</Typography>
        <Button component={Link} to="/film" sx={{ mt: 3 }}>
          ← Tutti i film
        </Button>
      </Container>
    );
  }
  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography color="text.secondary">Caricamento…</Typography>
      </Container>
    );
  }

  const poster = posterUrl(movie.posterFilename);

  return (
    <Box>
      <Box sx={{ bgcolor: "#111", color: "#fff" }}>
        <Container maxWidth="lg" sx={{ py: 7, display: "grid", gap: 5, gridTemplateColumns: { xs: "1fr", sm: "240px 1fr" } }}>
          <Box sx={{ overflow: "hidden", bgcolor: "#000", aspectRatio: "3 / 4" }}>
            {poster ? (
              <Box component="img" src={poster} alt={`Locandina di ${movie.title}`} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <Box sx={{ display: "grid", placeItems: "center", height: "100%", p: 2 }}>
                <Typography variant="h5" sx={{ color: "primary.main", textAlign: "center" }}>
                  {movie.title}
                </Typography>
              </Box>
            )}
          </Box>
          <Box>
            <Button component={Link} to="/film" color="inherit" sx={{ opacity: 0.7 }}>
              ← Film
            </Button>
            <Typography variant="h1" sx={{ fontSize: { xs: 36, sm: 56 }, mt: 2 }}>
              {movie.title}
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ mt: 2, flexWrap: "wrap" }}>
              {movie.genre && <Chip label={movie.genre} size="small" color="primary" />}
              {movie.year && <Chip label={movie.year} size="small" variant="outlined" sx={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }} />}
              {movie.duration && <Chip label={formatDuration(movie.duration)} size="small" variant="outlined" sx={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }} />}
              {movie.contryProduction && <Chip label={movie.contryProduction} size="small" variant="outlined" sx={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }} />}
            </Stack>

            {movie.director && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="overline" color="primary">
                  Regista
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5 }}>
                  {movie.director.name} {movie.director.surname}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,.7)" }}>
                  {movie.director.nationality ?? "—"}
                  {movie.director.birthDate ? ` · nato il ${formatDate(movie.director.birthDate)}` : ""}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 7 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: 28, sm: 36 }, borderBottom: 2, borderColor: "text.primary", pb: 1.5 }}>
          Festival
        </Typography>
        {movie.festivals.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 4 }}>
            Questo film non partecipa ancora a nessun festival.
          </Typography>
        ) : (
          <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap" }}>
            {movie.festivals.map((f) => (
              <AppLink
                key={f.id}
                to="/festival/$id"
                params={{ id: String(f.id) }}
                sx={{ border: "1px solid", borderColor: "divider", px: 2, py: 1, display: "block", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
              >
                <Typography sx={{ fontWeight: 700 }}>{f.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {f.city} · {f.year}
                </Typography>
              </AppLink>
            ))}
          </Stack>
        )}
      </Container>

      <Box sx={{ bgcolor: "grey.100" }}>
        <Container maxWidth="lg" sx={{ py: 7 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 28, sm: 36 }, borderBottom: 2, borderColor: "text.primary", pb: 1.5 }}>
            Proiezioni
          </Typography>
          {movie.screenings.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 4 }}>
              Nessuna proiezione programmata.
            </Typography>
          ) : (
            <Stack spacing={1.5} sx={{ mt: 3 }}>
              {movie.screenings.map((s) => (
                <Box key={s.id} sx={{ bgcolor: "background.paper", p: 2, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {formatDate(s.date)} · {formatTime(s.time)}
                  </Typography>
                  <Typography color="text.secondary">
                    {s.hall.name} · {s.festivalName}
                  </Typography>
                  <Chip label={s.status} size="small" variant="outlined" />
                </Box>
              ))}
            </Stack>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 7 }}>
        <Typography variant="h2" sx={{ fontSize: { xs: 28, sm: 36 }, borderBottom: 2, borderColor: "text.primary", pb: 1.5 }}>
          Recensioni
        </Typography>

        {notice && (
          <Alert severity="success" sx={{ mt: 3 }} onClose={() => setNotice(null)}>
            {notice}
          </Alert>
        )}

        {reviews.length > 0 && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", mt: 3, flexWrap: "wrap" }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Stars vote={Math.round((reviews.reduce((sum, r) => sum + r.vote, 0) / reviews.length) * 10) / 10} />
              <Typography sx={{ fontWeight: 700 }}>
                {(reviews.reduce((sum, r) => sum + r.vote, 0) / reviews.length).toFixed(1)} / 5
              </Typography>
              <Typography color="text.secondary">
                ({reviews.length} {reviews.length === 1 ? "recensione" : "recensioni"})
              </Typography>
            </Stack>
            {otherReviews.length > 1 && (
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Ordina per</InputLabel>
                <Select
                  label="Ordina per"
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value as typeof reviewSort)}
                >
                  <MenuItem value="recent">Più recenti</MenuItem>
                  <MenuItem value="oldest">Più vecchie</MenuItem>
                  <MenuItem value="positive">Più positive</MenuItem>
                  <MenuItem value="negative">Più negative</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>
        )}

        {myReview && !editingId && (
          <Paper variant="outlined" sx={{ mt: 4, p: 2.5, borderColor: "primary.main", borderWidth: 2 }}>
            <Typography variant="overline" color="primary">
              La tua recensione
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mt: 0.5 }}>
              <Stars vote={myReview.vote} />
              <Typography variant="body2" color="text.secondary">
                {formatDate(myReview.date)}
              </Typography>
            </Stack>
            <Typography sx={{ mt: 1 }}>{myReview.text}</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
              <Button size="small" onClick={() => startEdit(myReview)} sx={{ minWidth: 0, p: 0 }}>
                Modifica
              </Button>
              <Button size="small" color="error" onClick={() => void handleDelete(myReview.id)} sx={{ minWidth: 0, p: 0 }}>
                Elimina
              </Button>
            </Stack>
          </Paper>
        )}

        {reviews.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 4 }}>
            Nessuna recensione, per ora.
          </Typography>
        ) : otherReviews.length === 0 ? null : (
          <Stack spacing={3} sx={{ mt: 4 }}>
            {otherReviews.map((r) => (
              <Box key={r.id} sx={{ borderBottom: 1, borderColor: "divider", pb: 3 }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                  <Typography sx={{ fontWeight: 700 }}>{r.username}</Typography>
                  <Stars vote={r.vote} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(r.date)}
                  </Typography>
                </Stack>
                <Typography sx={{ mt: 1 }}>{r.text}</Typography>
              </Box>
            ))}
          </Stack>
        )}

        {canReview && (!myReview || editingId) && (
          <Box sx={{ mt: 5, p: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6">{editingId ? "Modifica la tua recensione" : "Lascia una recensione"}</Typography>
            <Stack spacing={2} sx={{ mt: 2, maxWidth: 480 }}>
              <StarPicker value={reviewVote} onChange={setReviewVote} />
              <TextField
                label="Recensione"
                multiline
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              {formError && <Alert severity="error">{formError}</Alert>}
              <Stack direction="row" spacing={1.5}>
                <Button variant="contained" color="primary" disabled={busy} onClick={() => void handleSubmit()}>
                  {editingId ? "Salva modifiche" : "Invia recensione"}
                </Button>
                {editingId && (
                  <Button variant="outlined" onClick={resetForm}>
                    Annulla
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        )}

        {!user && (
          <Typography sx={{ mt: 5 }} color="text.secondary">
            <Link to="/login">Accedi</Link> per lasciare una recensione.
          </Typography>
        )}
      </Container>
    </Box>
  );
}
