import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AppLink } from "../components/AppLink";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Registrati — CineFest" },
      { name: "description", content: "Crea il tuo account CineFest per recensire i film." },
      { property: "og:title", content: "Registrati — CineFest" },
      { property: "og:description", content: "Crea il tuo account CineFest per recensire i film." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register, demo } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    surname: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="overline" color="primary">
        Nuovo account
      </Typography>
      <Typography variant="h1" sx={{ fontSize: 48 }}>
        Registrati
      </Typography>
      <Paper
        component="form"
        variant="outlined"
        sx={{ mt: 4, p: 3 }}
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          setError(null);
          setBusy(true);
          void register(form)
            .then(() => router.navigate({ to: demo ? "/" : "/login" }))
            .catch((err) =>
              setError(err instanceof Error ? err.message : "Registrazione non riuscita"),
            )
            .finally(() => setBusy(false));
        }}
      >
        <Stack spacing={2.5}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
            <TextField label="Nome" required fullWidth {...field("name")} />
            <TextField label="Cognome" required fullWidth {...field("surname")} />
          </Stack>
          <TextField label="Email" type="email" required fullWidth {...field("email")} />
          <TextField label="Username" required fullWidth autoComplete="username" {...field("username")} />
          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            autoComplete="new-password"
            {...field("password")}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" size="large" disabled={busy} fullWidth>
            {busy ? "Creazione…" : "Crea account"}
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            Hai già un account?{" "}
            <AppLink to="/login" sx={{ color: "primary.main", fontWeight: 700 }}>
              Accedi
            </AppLink>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
