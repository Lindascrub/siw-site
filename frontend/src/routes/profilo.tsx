import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLink } from "../components/AppLink";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { ApiError } from "../lib/api";
import { useAuth } from "../lib/auth";
import { editReview, fetchMyReviews, removeReview } from "../lib/data";
import { formatDate } from "../lib/format";
import { StarPicker, Stars } from "../components/Stars";
import type { MyReviewDTO } from "../lib/types";

export const Route = createFileRoute("/profilo")({
  head: () => ({
    meta: [
      { title: "Profilo — CineFest" },
      { name: "description", content: "Il tuo profilo CineFest e le recensioni che hai scritto." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfiloPage,
});

function ProfiloPage() {
  const { user, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<MyReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [vote, setVote] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () =>
    fetchMyReviews()
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));

  useEffect(() => {
    if (user) void load();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function startEdit(r: MyReviewDTO) {
    setEditingId(r.id);
    setText(r.text);
    setVote(r.vote);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setText("");
    setVote(0);
  }

  async function handleSave() {
    if (!editingId) return;
    if (!text.trim() || vote < 1) {
      setError("Inserisci un testo e un voto da 1 a 5 stelle.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await editReview(editingId, text.trim(), vote);
      cancelEdit();
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Operazione non riuscita");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Eliminare la recensione? L'operazione non è reversibile.")) return;
    setBusy(true);
    setError(null);
    try {
      await removeReview(id);
      if (editingId === id) cancelEdit();
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Eliminazione non riuscita");
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || loading) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Typography color="text.secondary">Caricamento…</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="overline" color="primary">
          Area riservata
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 40, sm: 56 }, mt: 1 }}>
          Accedi per continuare
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Il profilo, con le tue recensioni, è visibile solo dopo l'accesso.
        </Typography>
        <Button component={Link} to="/login" variant="contained" color="primary" sx={{ mt: 4 }}>
          Vai al login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="overline" color="primary">
        Il tuo account
      </Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: 40, sm: 56 }, borderBottom: 2, borderColor: "text.primary", pb: 3, mb: 4 }}>
        Profilo
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 5 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <Typography variant="h5">
            {user.name} {user.surname}
          </Typography>
          <Chip label={user.role === "ADMIN" ? "Amministratore" : "Utente"} size="small" color="primary" />
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          @{user.username}
        </Typography>
      </Paper>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Le tue recensioni ({reviews.length})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {reviews.length === 0 ? (
        <Typography color="text.secondary">
          Non hai ancora scritto recensioni. Sfoglia il{" "}
          <AppLink to="/film" sx={{ color: "primary.main", fontWeight: 700 }}>
            catalogo film
          </AppLink>{" "}
          per lasciarne una.
        </Typography>
      ) : (
        <Stack spacing={2.5}>
          {reviews.map((r) => (
            <Paper key={r.id} variant="outlined" sx={{ p: 2.5 }}>
              {editingId === r.id ? (
                <Stack spacing={2} sx={{ maxWidth: 480 }}>
                  <StarPicker value={vote} onChange={setVote} />
                  <TextField label="Recensione" multiline rows={3} value={text} onChange={(e) => setText(e.target.value)} />
                  <Stack direction="row" spacing={1.5}>
                    <Button variant="contained" color="primary" disabled={busy} onClick={() => void handleSave()}>
                      Salva modifiche
                    </Button>
                    <Button variant="outlined" onClick={cancelEdit}>
                      Annulla
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <>
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                    <AppLink
                      to="/film/$id"
                      params={{ id: String(r.movieId) }}
                      sx={{ fontWeight: 700, "&:hover": { color: "primary.main" } }}
                    >
                      {r.movieTitle}
                    </AppLink>
                    <Stars vote={r.vote} size="small" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(r.date)}
                    </Typography>
                  </Stack>
                  <Typography sx={{ mt: 1 }}>{r.text}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                    <Button size="small" onClick={() => startEdit(r)} sx={{ minWidth: 0, p: 0 }}>
                      Modifica
                    </Button>
                    <Button size="small" color="error" onClick={() => void handleDelete(r.id)} sx={{ minWidth: 0, p: 0 }}>
                      Elimina
                    </Button>
                  </Stack>
                </>
              )}
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
}
