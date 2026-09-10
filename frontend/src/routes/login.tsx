import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AppLink } from "../components/AppLink";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Accedi — CineFest" },
      { name: "description", content: "Accedi al tuo account CineFest." },
      { property: "og:title", content: "Accedi — CineFest" },
      { property: "og:description", content: "Accedi al tuo account CineFest." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Typography variant="overline" color="primary">
        Bentornato
      </Typography>
      <Typography variant="h1" sx={{ fontSize: 48 }}>
        Accedi
      </Typography>
      <Paper
        component="form"
        variant="outlined"
        sx={{ mt: 4, p: 3 }}
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          setError(null);
          setBusy(true);
          void login(username, password)
            .then(() => router.navigate({ to: "/" }))
            .catch((err) => setError(err instanceof Error ? err.message : "Accesso non riuscito"))
            .finally(() => setBusy(false));
        }}
      >
        <Stack spacing={2.5}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            fullWidth
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" size="large" disabled={busy} fullWidth>
            {busy ? "Accesso…" : "Accedi"}
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            Non hai un account?{" "}
            <AppLink to="/register" sx={{ color: "primary.main", fontWeight: 700 }}>
              Registrati
            </AppLink>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
