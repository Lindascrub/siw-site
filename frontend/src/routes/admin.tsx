import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type ReactNode, type ChangeEvent } from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { useAuth } from "../lib/auth";
import {
  deleteDirector,
  deleteFestival,
  deleteHall,
  deleteMovie,
  deleteScreening,
  deleteUser,
  loadAdminData,
  saveDirector,
  saveFestival,
  saveHall,
  saveMovie,
  saveScreening,
  saveUser,
  setFestivalMovie,
  uploadPoster,
  type AdminData,
} from "../lib/admin-data";
import { posterUrl } from "../lib/api";
import { fetchFestivalMovies } from "../lib/data";
import type {
  DirectorForm,
  FestivalForm,
  HallForm,
  MovieForm,
  ScreeningForm,
  UserForm,
} from "../lib/admin-api";
import type { FestivalDTO, MovieDTO } from "../lib/types";
import { formatDate, formatTime } from "../lib/format";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Gestione contenuti — CineFest" },
      {
        name: "description",
        content:
          "Pannello di amministrazione CineFest: crea, modifica ed elimina film, festival, proiezioni, registi e sale.",
      },
      { property: "og:title", content: "Gestione contenuti — CineFest" },
      {
        property: "og:description",
        content: "Pannello di amministrazione per film, festival e proiezioni.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type TabKey = "film" | "festival" | "proiezioni" | "registi" | "sale" | "utenti";

const TABS: { key: TabKey; label: string }[] = [
  { key: "film", label: "Film" },
  { key: "festival", label: "Festival" },
  { key: "proiezioni", label: "Proiezioni" },
  { key: "registi", label: "Registi" },
  { key: "sale", label: "Sale" },
  { key: "utenti", label: "Utenti" },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box>
      <Typography
        variant="overline"
        component="label"
        sx={{ display: "block", color: "text.secondary", mb: 0.5 }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<TabKey>("film");
  const [data, setData] = useState<AdminData | null>(null);
  const [demo, setDemo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const res = await loadAdminData();
    setData(res.data);
    setDemo(res.demo);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const run = useCallback(
    async (action: () => Promise<void>, message: string) => {
      setBusy(true);
      setError(null);
      setNotice(null);
      try {
        await action();
        await reload();
        setNotice(message);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Operazione non riuscita");
      } finally {
        setBusy(false);
      }
    },
    [reload],
  );

  const confirmAndRun = (label: string, action: () => Promise<void>) => {
    if (window.confirm(`Eliminare ${label}? L'operazione non è reversibile.`)) {
      void run(action, "Elemento eliminato.");
    }
  };

  const isAdmin = !!user && user.role.toUpperCase().includes("ADMIN");

  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography color="text.secondary">Caricamento…</Typography>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="overline" sx={{ color: "primary.main" }}>
          Area riservata
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: "2.5rem", sm: "3rem" }, mt: 1 }}>
          Accesso non consentito
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
          {user
            ? "Questa sezione è visibile solo agli account con ruolo ADMIN."
            : "Accedi con un account ADMIN per gestire i contenuti del sito."}
        </Typography>
        {!user && (
          <Button component={Link} to="/login" variant="contained" color="primary" sx={{ mt: 4 }}>
            Vai al login
          </Button>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="overline" sx={{ color: "primary.main" }}>
        Area riservata
      </Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: "3rem", sm: "3.75rem" }, mt: 1 }}>
        Gestione contenuti
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mt: 2, maxWidth: 640 }}>
        Aggiungi, modifica ed elimina film, festival e proiezioni direttamente dal browser.
        {demo
          ? " Il backend non risponde: stai lavorando sui dati dimostrativi (le modifiche restano solo in questa sessione)."
          : " Le modifiche vengono salvate sul backend Spring Boot."}
      </Typography>

      <Box sx={{ mt: 4, borderBottom: 2, borderColor: "text.primary" }}>
        <Tabs
          value={tab}
          onChange={(_e, value: TabKey) => setTab(value)}
          textColor="inherit"
          slotProps={{ indicator: { sx: { backgroundColor: "primary.main", height: 3 } } }}
        >
          {TABS.map((t) => (
            <MuiTab key={t.key} value={t.key} label={t.label} />
          ))}
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: 0 }}>
          {error}
        </Alert>
      )}
      {notice && (
        <Alert severity="success" sx={{ mt: 3, borderRadius: 0 }}>
          {notice}
        </Alert>
      )}

      {!data ? (
        <Typography sx={{ mt: 5, color: "text.secondary" }}>Caricamento…</Typography>
      ) : (
        <Box sx={{ mt: 4 }}>
          {tab === "film" && (
            <MoviesTab data={data} busy={busy} run={run} confirmAndRun={confirmAndRun} demo={demo} />
          )}
          {tab === "festival" && (
            <FestivalsTab data={data} busy={busy} run={run} confirmAndRun={confirmAndRun} demo={demo} />
          )}
          {tab === "proiezioni" && (
            <ScreeningsTab data={data} busy={busy} run={run} confirmAndRun={confirmAndRun} demo={demo} />
          )}
          {tab === "registi" && (
            <DirectorsTab data={data} busy={busy} run={run} confirmAndRun={confirmAndRun} demo={demo} />
          )}
          {tab === "sale" && (
            <HallsTab data={data} busy={busy} run={run} confirmAndRun={confirmAndRun} demo={demo} />
          )}
          {tab === "utenti" && (
            <UsersTab data={data} busy={busy} run={run} confirmAndRun={confirmAndRun} demo={demo} />
          )}
        </Box>
      )}
    </Container>
  );
}

// Renamed local alias to avoid clashing with MUI's Tab component
const MuiTab = Tab;

interface TabProps {
  data: AdminData;
  demo: boolean;
  busy: boolean;
  run: (action: () => Promise<void>, message: string) => Promise<void>;
  confirmAndRun: (label: string, action: () => Promise<void>) => void;
}

function Section({
  title,
  form,
  table,
}: {
  title: string;
  form: ReactNode;
  table: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 5,
        gridTemplateColumns: { xs: "1fr", lg: "360px 1fr" },
      }}
    >
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Stack spacing={2} sx={{ mt: 2.5 }}>
          {form}
        </Stack>
      </Paper>
      <Box sx={{ overflowX: "auto" }}>{table}</Box>
    </Box>
  );
}

function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <TableContainer>
      <MuiTable size="small" sx={{ borderCollapse: "collapse" }}>
        <TableHead>
          <TableRow sx={{ "& th": { borderBottom: "2px solid", borderColor: "text.primary" } }}>
            {headers.map((h) => (
              <TableCell key={h} sx={{ py: 1 }}>
                <Typography variant="overline" sx={{ color: "text.secondary" }}>
                  {h}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </MuiTable>
    </TableContainer>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <TableRow sx={{ "& td": { borderBottom: "1px solid", borderColor: "divider" } }}>{children}</TableRow>;
}

function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Stack direction="row" spacing={2}>
      <Button
        onClick={onEdit}
        size="small"
        sx={{ color: "primary.main", minWidth: 0, p: 0, "&:hover": { textDecoration: "underline", backgroundColor: "transparent" } }}
      >
        Modifica
      </Button>
      <Button
        onClick={onDelete}
        size="small"
        sx={{ color: "text.secondary", minWidth: 0, p: 0, "&:hover": { color: "error.main", backgroundColor: "transparent" } }}
      >
        Elimina
      </Button>
    </Stack>
  );
}

// ---- Film ----

function PosterCell({
  movieId,
  posterFilename,
  onUpload,
}: {
  movieId: number;
  posterFilename: string | null;
  onUpload: (file: File) => Promise<void>;
}) {
  const [uploading, setUploading] = useState(false);
  const poster = posterUrl(posterFilename);

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      e.target.value = ""; // permette di ricaricare lo stesso file una seconda volta
    }
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        sx={{
          width: 40,
          height: 56,
          bgcolor: "action.hover",
          overflow: "hidden",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {poster ? (
          <Box component="img" src={poster} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Typography variant="caption" color="text.disabled">
            —
          </Typography>
        )}
      </Box>
      <IconButton component="label" size="small" disabled={uploading} aria-label={`Carica locandina per film ${movieId}`}>
        {uploading ? <CircularProgress size={16} /> : <UploadFileIcon fontSize="small" />}
        <input type="file" accept="image/*" hidden onChange={handleChange} />
      </IconButton>
    </Stack>
  );
}

const emptyMovie: MovieForm = {
  id: null,
  title: "",
  year: null,
  duration: null,
  genre: "",
  contryProduction: "",
  directorId: null,
};

function MoviesTab({ data, demo, busy, run, confirmAndRun }: TabProps) {
  const [form, setForm] = useState<MovieForm>(emptyMovie);

  const submit = () =>
    void run(async () => {
      await saveMovie(demo, form);
      setForm(emptyMovie);
    }, "Film salvato.");

  return (
    <Section
      title={form.id ? "Modifica film" : "Nuovo film"}
      form={
        <>
          <Field label="Titolo">
            <TextField
              fullWidth
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Stack direction="row" spacing={1.5}>
            <TextField
              label="Anno"
              type="number"
              fullWidth
              value={form.year ?? ""}
              onChange={(e) => setForm({ ...form, year: e.target.value ? Number(e.target.value) : null })}
            />
            <TextField
              label="Durata (min)"
              type="number"
              fullWidth
              value={form.duration ?? ""}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value ? Number(e.target.value) : null })
              }
            />
          </Stack>
          <Field label="Genere">
            <TextField
              fullWidth
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
            />
          </Field>
          <Field label="Paese di produzione">
            <TextField
              fullWidth
              value={form.contryProduction}
              onChange={(e) => setForm({ ...form, contryProduction: e.target.value })}
            />
          </Field>
          <TextField
            select
            label="Regista"
            fullWidth
            value={form.directorId ?? ""}
            onChange={(e) =>
              setForm({ ...form, directorId: e.target.value ? Number(e.target.value) : null })
            }
          >
            <MenuItem value="">— seleziona —</MenuItem>
            {data.directors.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name} {d.surname}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
            <Button onClick={submit} disabled={busy || !form.title} variant="contained" color="primary">
              {form.id ? "Salva modifiche" : "Aggiungi film"}
            </Button>
            {form.id && (
              <Button onClick={() => setForm(emptyMovie)} variant="outlined">
                Annulla
              </Button>
            )}
          </Stack>
        </>
      }
      table={
        <Table headers={["Locandina", "Titolo", "Anno", "Genere", "Regista", ""]}>
          {data.movies.map((m) => (
            <Row key={m.id}>
              <TableCell>
                <PosterCell
                  movieId={m.id}
                  posterFilename={m.posterFilename}
                  onUpload={(file) => run(() => uploadPoster(demo, m.id, file), "Locandina caricata.")}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{m.title}</TableCell>
              <TableCell>{m.year ?? "—"}</TableCell>
              <TableCell>{m.genre ?? "—"}</TableCell>
              <TableCell>{m.director ? `${m.director.name} ${m.director.surname}` : "—"}</TableCell>
              <TableCell>
                <RowActions
                  onEdit={() =>
                    setForm({
                      id: m.id,
                      title: m.title,
                      year: m.year,
                      duration: m.duration,
                      genre: m.genre ?? "",
                      contryProduction: m.contryProduction ?? "",
                      directorId: m.director?.id ?? null,
                    })
                  }
                  onDelete={() => confirmAndRun(`il film “${m.title}”`, () => deleteMovie(demo, m.id))}
                />
              </TableCell>
            </Row>
          ))}
        </Table>
      }
    />
  );
}

// ---- Festival ----

const emptyFestival: FestivalForm = {
  id: null,
  name: "",
  year: null,
  city: "",
  startDate: "",
  endDate: "",
  description: "",
};

function FestivalsTab({ data, demo, busy, run, confirmAndRun }: TabProps) {
  const [form, setForm] = useState<FestivalForm>(emptyFestival);
  const [moviesPanelFor, setMoviesPanelFor] = useState<number | null>(null);

  const submit = () =>
    void run(async () => {
      await saveFestival(demo, form);
      setForm(emptyFestival);
    }, "Festival salvato.");

  return (
    <>
    <Section
      title={form.id ? "Modifica festival" : "Nuovo festival"}
      form={
        <>
          <Field label="Nome">
            <TextField
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Stack direction="row" spacing={1.5}>
            <TextField
              label="Anno"
              type="number"
              fullWidth
              value={form.year ?? ""}
              onChange={(e) => setForm({ ...form, year: e.target.value ? Number(e.target.value) : null })}
            />
            <TextField
              label="Città"
              fullWidth
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <TextField
              label="Inizio"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            <TextField
              label="Fine"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </Stack>
          <Field label="Descrizione">
            <TextField
              fullWidth
              multiline
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
            <Button onClick={submit} disabled={busy || !form.name} variant="contained" color="primary">
              {form.id ? "Salva modifiche" : "Aggiungi festival"}
            </Button>
            {form.id && (
              <Button onClick={() => setForm(emptyFestival)} variant="outlined">
                Annulla
              </Button>
            )}
          </Stack>
        </>
      }
      table={
        <Table headers={["Nome", "Città", "Anno", "Periodo", "", ""]}>
          {data.festivals.map((f) => (
            <Row key={f.id}>
              <TableCell sx={{ fontWeight: 600 }}>{f.name}</TableCell>
              <TableCell>{f.city ?? "—"}</TableCell>
              <TableCell>{f.year ?? "—"}</TableCell>
              <TableCell>
                {formatDate(f.startDate)} — {formatDate(f.endDate)}
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => setMoviesPanelFor(moviesPanelFor === f.id ? null : f.id)}
                  sx={{ minWidth: 0, p: 0, color: moviesPanelFor === f.id ? "primary.main" : "text.secondary" }}
                >
                  Film
                </Button>
              </TableCell>
              <TableCell>
                <RowActions
                  onEdit={() =>
                    setForm({
                      id: f.id,
                      name: f.name,
                      year: f.year,
                      city: f.city ?? "",
                      startDate: f.startDate ?? "",
                      endDate: f.endDate ?? "",
                      description: f.description ?? "",
                    })
                  }
                  onDelete={() =>
                    confirmAndRun(`il festival “${f.name}”`, () => deleteFestival(demo, f.id))
                  }
                />
              </TableCell>
            </Row>
          ))}
        </Table>
      }
    />
    {moviesPanelFor !== null && (
      <FestivalMoviesPanel
        festival={data.festivals.find((f) => f.id === moviesPanelFor)!}
        allMovies={data.movies}
        demo={demo}
        onClose={() => setMoviesPanelFor(null)}
      />
    )}
    </>
  );
}

/** Gestisce l'associazione/rimozione dei film di un festival (relazione molti-a-molti). */
function FestivalMoviesPanel({
  festival,
  allMovies,
  demo,
  onClose,
}: {
  festival: FestivalDTO;
  allMovies: MovieDTO[];
  demo: boolean;
  onClose: () => void;
}) {
  const [memberIds, setMemberIds] = useState<Set<number> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<number | null>(null);
  const festivalId = festival.id as number;

  const reload = useCallback(() => {
    void fetchFestivalMovies(festivalId).then((movies) => setMemberIds(new Set(movies.map((m) => m.id))));
  }, [festivalId]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function toggle(movieId: number, checked: boolean) {
    setPending(movieId);
    setError(null);
    try {
      await setFestivalMovie(demo, festivalId, movieId, checked);
      reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Operazione non riuscita");
    } finally {
      setPending(null);
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Film di “{festival.name}”</Typography>
        <Button size="small" onClick={onClose}>
          Chiudi
        </Button>
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {memberIds === null ? (
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Caricamento…
        </Typography>
      ) : (
        <Stack sx={{ mt: 2 }}>
          {allMovies.map((m) => (
            <Stack
              key={m.id}
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", py: 0.75, borderBottom: 1, borderColor: "divider" }}
            >
              <Checkbox
                checked={memberIds.has(m.id)}
                disabled={pending === m.id}
                onChange={(e) => void toggle(m.id, e.target.checked)}
              />
              <Typography>{m.title}</Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Paper>
  );
}

// ---- Proiezioni ----

const emptyScreening: ScreeningForm = {
  id: null,
  festivalId: null,
  movieId: null,
  hallId: null,
  date: "",
  time: "",
};

function ScreeningsTab({ data, demo, busy, run, confirmAndRun }: TabProps) {
  const [form, setForm] = useState<ScreeningForm>(emptyScreening);

  const submit = () =>
    void run(async () => {
      await saveScreening(demo, form);
      setForm(emptyScreening);
    }, "Proiezione salvata.");

  const valid = form.festivalId && form.movieId && form.hallId && form.date && form.time;

  return (
    <Section
      title={form.id ? "Modifica proiezione" : "Nuova proiezione"}
      form={
        <>
          <TextField
            select
            label="Festival"
            fullWidth
            value={form.festivalId ?? ""}
            onChange={(e) =>
              setForm({ ...form, festivalId: e.target.value ? Number(e.target.value) : null })
            }
          >
            <MenuItem value="">— seleziona —</MenuItem>
            {data.festivals.map((f) => (
              <MenuItem key={f.id} value={f.id}>
                {f.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Film"
            fullWidth
            value={form.movieId ?? ""}
            onChange={(e) =>
              setForm({ ...form, movieId: e.target.value ? Number(e.target.value) : null })
            }
          >
            <MenuItem value="">— seleziona —</MenuItem>
            {data.movies.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Sala"
            fullWidth
            value={form.hallId ?? ""}
            onChange={(e) =>
              setForm({ ...form, hallId: e.target.value ? Number(e.target.value) : null })
            }
          >
            <MenuItem value="">— seleziona —</MenuItem>
            {data.halls.map((h) => (
              <MenuItem key={h.id} value={h.id}>
                {h.name}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={1.5}>
            <TextField
              label="Data"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <TextField
              label="Ora"
              type="time"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
            <Button onClick={submit} disabled={busy || !valid} variant="contained" color="primary">
              {form.id ? "Salva modifiche" : "Aggiungi proiezione"}
            </Button>
            {form.id && (
              <Button onClick={() => setForm(emptyScreening)} variant="outlined">
                Annulla
              </Button>
            )}
          </Stack>
        </>
      }
      table={
        <Table headers={["Data", "Ora", "Film", "Sala", "Festival", ""]}>
          {data.screenings.map((s) => (
            <Row key={s.id}>
              <TableCell>{formatDate(s.date)}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{formatTime(s.time)}</TableCell>
              <TableCell>{s.movie.title}</TableCell>
              <TableCell>{s.hall.name}</TableCell>
              <TableCell>
                {data.festivals.find((f) => f.id === s.festivalId)?.name ?? s.festivalId}
              </TableCell>
              <TableCell>
                <RowActions
                  onEdit={() =>
                    setForm({
                      id: s.id,
                      festivalId: s.festivalId,
                      movieId: s.movie.id,
                      hallId: s.hall.id,
                      date: s.date,
                      time: s.time.slice(0, 5),
                    })
                  }
                  onDelete={() =>
                    confirmAndRun(`la proiezione di “${s.movie.title}”`, () =>
                      deleteScreening(demo, s.id),
                    )
                  }
                />
              </TableCell>
            </Row>
          ))}
        </Table>
      }
    />
  );
}

// ---- Registi ----

const emptyDirector: DirectorForm = {
  id: null,
  name: "",
  surname: "",
  birthDate: "",
  nationality: "",
};

function DirectorsTab({ data, demo, busy, run, confirmAndRun }: TabProps) {
  const [form, setForm] = useState<DirectorForm>(emptyDirector);

  const submit = () =>
    void run(async () => {
      await saveDirector(demo, form);
      setForm(emptyDirector);
    }, "Regista salvato.");

  return (
    <Section
      title={form.id ? "Modifica regista" : "Nuovo regista"}
      form={
        <>
          <Field label="Nome">
            <TextField
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Cognome">
            <TextField
              fullWidth
              value={form.surname}
              onChange={(e) => setForm({ ...form, surname: e.target.value })}
            />
          </Field>
          <TextField
            label="Data di nascita"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={form.birthDate ?? ""}
            onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
          />
          <Field label="Nazionalità">
            <TextField
              fullWidth
              value={form.nationality}
              onChange={(e) => setForm({ ...form, nationality: e.target.value })}
            />
          </Field>
          <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
            <Button
              onClick={submit}
              disabled={busy || !form.name || !form.surname}
              variant="contained"
              color="primary"
            >
              {form.id ? "Salva modifiche" : "Aggiungi regista"}
            </Button>
            {form.id && (
              <Button onClick={() => setForm(emptyDirector)} variant="outlined">
                Annulla
              </Button>
            )}
          </Stack>
        </>
      }
      table={
        <Table headers={["Nome", "Nascita", "Nazionalità", ""]}>
          {data.directors.map((d) => (
            <Row key={d.id}>
              <TableCell sx={{ fontWeight: 600 }}>
                {d.name} {d.surname}
              </TableCell>
              <TableCell>{formatDate(d.birthDate)}</TableCell>
              <TableCell>{d.nationality ?? "—"}</TableCell>
              <TableCell>
                <RowActions
                  onEdit={() =>
                    setForm({
                      id: d.id,
                      name: d.name,
                      surname: d.surname,
                      birthDate: d.birthDate ?? "",
                      nationality: d.nationality ?? "",
                    })
                  }
                  onDelete={() =>
                    confirmAndRun(`il regista ${d.name} ${d.surname}`, () => deleteDirector(demo, d.id))
                  }
                />
              </TableCell>
            </Row>
          ))}
        </Table>
      }
    />
  );
}

// ---- Sale ----

const emptyHall: HallForm = { id: null, name: "", address: "", capacity: null };

function HallsTab({ data, demo, busy, run, confirmAndRun }: TabProps) {
  const [form, setForm] = useState<HallForm>(emptyHall);

  const submit = () =>
    void run(async () => {
      await saveHall(demo, form);
      setForm(emptyHall);
    }, "Sala salvata.");

  return (
    <Section
      title={form.id ? "Modifica sala" : "Nuova sala"}
      form={
        <>
          <Field label="Nome">
            <TextField
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Indirizzo">
            <TextField
              fullWidth
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Field>
          <Field label="Capienza">
            <TextField
              fullWidth
              type="number"
              value={form.capacity ?? ""}
              onChange={(e) =>
                setForm({ ...form, capacity: e.target.value ? Number(e.target.value) : null })
              }
            />
          </Field>
          <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
            <Button onClick={submit} disabled={busy || !form.name} variant="contained" color="primary">
              {form.id ? "Salva modifiche" : "Aggiungi sala"}
            </Button>
            {form.id && (
              <Button onClick={() => setForm(emptyHall)} variant="outlined">
                Annulla
              </Button>
            )}
          </Stack>
        </>
      }
      table={
        <Table headers={["Nome", "Indirizzo", "Capienza", ""]}>
          {data.halls.map((h) => (
            <Row key={h.id}>
              <TableCell sx={{ fontWeight: 600 }}>{h.name}</TableCell>
              <TableCell>{h.address ?? "—"}</TableCell>
              <TableCell>{h.capacity ?? "—"}</TableCell>
              <TableCell>
                <RowActions
                  onEdit={() =>
                    setForm({
                      id: h.id,
                      name: h.name,
                      address: h.address ?? "",
                      capacity: h.capacity,
                    })
                  }
                  onDelete={() => confirmAndRun(`la sala “${h.name}”`, () => deleteHall(demo, h.id))}
                />
              </TableCell>
            </Row>
          ))}
        </Table>
      }
    />
  );
}

// ---- Utenti ----

const emptyUser: UserForm = {
  id: null,
  username: "",
  password: "",
  name: "",
  surname: "",
  email: "",
  role: "USER",
};

function UsersTab({ data, demo, busy, run, confirmAndRun }: TabProps) {
  const { user: current } = useAuth();
  const [form, setForm] = useState<UserForm>(emptyUser);

  const submit = () =>
    void run(async () => {
      await saveUser(demo, form);
      setForm(emptyUser);
    }, "Utente salvato.");

  return (
    <Section
      title={form.id ? "Modifica utente" : "Nuovo utente"}
      form={
        <>
          <Field label="Username">
            <TextField
              fullWidth
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </Field>
          <Field label={form.id ? "Nuova password (lascia vuoto per non cambiarla)" : "Password"}>
            <TextField
              fullWidth
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
          <Stack direction="row" spacing={1.5}>
            <TextField
              label="Nome"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Cognome"
              fullWidth
              value={form.surname}
              onChange={(e) => setForm({ ...form, surname: e.target.value })}
            />
          </Stack>
          <Field label="Email">
            <TextField
              fullWidth
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <TextField
            select
            label="Ruolo"
            fullWidth
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as UserForm["role"] })}
          >
            <MenuItem value="USER">Utente</MenuItem>
            <MenuItem value="ADMIN">Amministratore</MenuItem>
          </TextField>
          <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
            <Button
              onClick={submit}
              disabled={busy || !form.username || (!form.id && !form.password)}
              variant="contained"
              color="primary"
            >
              {form.id ? "Salva modifiche" : "Crea account"}
            </Button>
            {form.id && (
              <Button onClick={() => setForm(emptyUser)} variant="outlined">
                Annulla
              </Button>
            )}
          </Stack>
        </>
      }
      table={
        <Table headers={["Username", "Nome", "Email", "Ruolo", ""]}>
          {data.users.map((u) => {
            const isAdminRole = u.role.toUpperCase().includes("ADMIN");
            return (
              <Row key={u.id}>
                <TableCell sx={{ fontWeight: 600 }}>{u.username}</TableCell>
                <TableCell>
                  {u.name} {u.surname}
                </TableCell>
                <TableCell>{u.email ?? "—"}</TableCell>
                <TableCell>
                  <Chip
                    label={isAdminRole ? "Admin" : "Utente"}
                    size="small"
                    sx={
                      isAdminRole
                        ? { bgcolor: "primary.main", color: "primary.contrastText", borderRadius: 0 }
                        : { borderRadius: 0, borderColor: "divider" }
                    }
                    variant={isAdminRole ? "filled" : "outlined"}
                  />
                </TableCell>
                <TableCell>
                  <RowActions
                    onEdit={() =>
                      setForm({
                        id: u.id,
                        username: u.username,
                        password: "",
                        name: u.name,
                        surname: u.surname,
                        email: u.email ?? "",
                        role: isAdminRole ? "ADMIN" : "USER",
                      })
                    }
                    onDelete={() => {
                      if (current && current.username === u.username) {
                        window.alert("Non puoi eliminare l'account con cui hai effettuato l'accesso.");
                        return;
                      }
                      confirmAndRun(`l'utente “${u.username}”`, () => deleteUser(demo, u.id));
                    }}
                  />
                </TableCell>
              </Row>
            );
          })}
        </Table>
      }
    />
  );
}
