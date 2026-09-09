import { createTheme } from "@mui/material/styles";

// Tema MUI ispirato ai festival del cinema: nero, rosso acceso, tipografia
// editoriale condensata (Archivo).
export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: "#E1112C", contrastText: "#FFFFFF" },
    secondary: { main: "#111111", contrastText: "#FFFFFF" },
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
    text: { primary: "#111111", secondary: "#5B5B5B" },
    divider: "#E2E2E2",
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: '"Archivo", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 0.95 },
    h2: { fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 0.95 },
    h3: { fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em" },
    h4: { fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em" },
    h5: { fontWeight: 800, textTransform: "uppercase" },
    h6: { fontWeight: 800, textTransform: "uppercase" },
    overline: { fontWeight: 700, letterSpacing: "0.18em", fontSize: 12 },
    button: { fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { backgroundImage: "none" } } },
    MuiAppBar: { defaultProps: { elevation: 0, color: "transparent" } },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiSelect: { defaultProps: { size: "small" } },
  },
});

export default theme;
