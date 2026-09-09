import { createLink } from "@tanstack/react-router";
import { styled } from "@mui/material/styles";

/** Ancora stilizzata con MUI (supporta `sx`) collegata al router. */
const StyledAnchor = styled("a")({
  textDecoration: "none",
  color: "inherit",
});

export const AppLink = createLink(StyledAnchor);
