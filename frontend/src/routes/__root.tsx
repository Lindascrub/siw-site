import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AppLink } from "../components/AppLink";
import { useEffect, type ReactNode } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import { ThemeProvider } from "@mui/material/styles";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider, useAuth } from "../lib/auth";
import { theme } from "../theme";

function NotFoundComponent() {
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
      <Typography variant="h1" sx={{ fontSize: 96, color: "primary.main" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mt: 2 }}>
        Pagina non trovata
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        La pagina che cerchi non esiste o è stata spostata.
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 4 }}>
        Torna alla home
      </Button>
    </Container>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
      <Typography variant="h5">Qualcosa non ha funzionato</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Puoi riprovare oppure tornare alla home.
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Riprova
        </Button>
        <Button variant="outlined" color="inherit" href="/">
          Home
        </Button>
      </Stack>
    </Container>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CineFest — Festival del Cinema" },
      {
        name: "description",
        content:
          "CineFest: festival cinematografici, catalogo film, programmazione delle proiezioni e recensioni del pubblico.",
      },
      { property: "og:title", content: "CineFest — Festival del Cinema" },
      {
        property: "og:description",
        content: "Festival cinematografici, catalogo film, proiezioni e recensioni.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const navSx = {
  color: "rgba(255,255,255,0.75)",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  "&:hover": { color: "primary.main" },
};

function SiteHeader() {
  const { user, demo, logout } = useAuth();
  const router = useRouter();
  const isAdmin = !!user && user.role.toUpperCase().includes("ADMIN");

  const links = [
    { to: "/", label: "Home", exact: true },
    { to: "/festival", label: "Festival" },
    { to: "/film", label: "Film" },
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ] as const;

  return (
    <AppBar position="static" sx={{ bgcolor: "#111", color: "#fff" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 3, flexWrap: "wrap", py: 1 }}>
          <AppLink to="/" sx={{ display: "flex", alignItems: "center", gap: 1.5, textDecoration: "none", color: "inherit" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
                color: "#fff",
                fontWeight: 900,
                fontSize: 20,
              }}
            >
              CF
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Cine<Box component="span" sx={{ color: "primary.main" }}>Fest</Box>
            </Typography>
          </AppLink>

          <Stack direction="row" spacing={3} sx={{ ml: "auto", display: { xs: "none", md: "flex" } }}>
            {links.map((l) => (
              <AppLink
                key={l.to}
                to={l.to}
                activeOptions={{ exact: "exact" in l && l.exact === true }}
                activeProps={{ style: { color: theme.palette.primary.main } }}
                sx={navSx}
              >
                {l.label}
              </AppLink>
            ))}
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", ml: { xs: "auto", md: 3 } }}>
            {demo && <Chip label="Demo" size="small" variant="outlined" color="primary" />}
            {user ? (
              <>
                <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, color: "rgba(255,255,255,0.7)" }}>
                  Ciao, <strong style={{ color: "#fff" }}>{user.name}</strong>
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    void logout().then(() => router.navigate({ to: "/" }));
                  }}
                >
                  Esci
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" color="inherit" size="small">
                  Accedi
                </Button>
                <Button component={Link} to="/register" variant="contained" size="small">
                  Registrati
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>

        <Stack
          direction="row"
          spacing={3}
          sx={{ display: { xs: "flex", md: "none" }, py: 1, borderTop: "1px solid rgba(255,255,255,0.12)" }}
        >
          {links.map((l) => (
            <AppLink key={l.to} to={l.to} sx={navSx}>
              {l.label}
            </AppLink>
          ))}
        </Stack>
      </Container>
    </AppBar>
  );
}

function DemoBanner() {
  const { demo } = useAuth();
  if (!demo) return null;
  return (
    <Alert severity="warning" variant="filled" sx={{ borderRadius: 0, justifyContent: "center" }}>
      <strong>Modalità demo attiva:</strong> il backend Spring Boot non è raggiungibile in questo
      momento — i dati mostrati sono di esempio, non reali. Verifica che il backend sia avviato su{" "}
      <code>localhost:8080</code>.
    </Alert>
  );
}

function SiteFooter() {
  return (
    <Box component="footer" sx={{ bgcolor: "#111", color: "rgba(255,255,255,0.6)", mt: "auto" }}>
      <Container maxWidth="lg" sx={{ py: 5, display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900 }}>
          Cine<Box component="span" sx={{ color: "primary.main" }}>Fest</Box>
        </Typography>
        <Typography variant="body2">
          Frontend React + TypeScript + MUI · API Spring Boot su{" "}
          <Box component="code" sx={{ color: "primary.main" }}>localhost:8080</Box>
        </Typography>
      </Container>
    </Box>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <SiteHeader />
            <DemoBanner />
            <Box component="main" sx={{ flex: 1 }}>
              <Outlet />
            </Box>
            <SiteFooter />
          </Box>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
