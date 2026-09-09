import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

/** Layout comune per le pagine informative statiche (chi siamo, contatti, ecc.). */
export function InfoPage({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="overline" color="primary">
        {kicker}
      </Typography>
      <Typography
        variant="h1"
        sx={{ fontSize: { xs: 40, sm: 56 }, borderBottom: 2, borderColor: "text.primary", pb: 3, mb: 4 }}
      >
        {title}
      </Typography>
      <Typography
        component="div"
        sx={{
          color: "text.secondary",
          lineHeight: 1.8,
          "& p": { mt: 0, mb: 2.5 },
          "& h2": { color: "text.primary", fontSize: 22, fontWeight: 700, mt: 4, mb: 1.5 },
          "& ul": { pl: 3, mb: 2.5 },
          "& li": { mb: 0.75 },
        }}
      >
        {children}
      </Typography>
    </Container>
  );
}
