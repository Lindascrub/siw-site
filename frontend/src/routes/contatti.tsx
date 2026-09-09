import { createFileRoute } from "@tanstack/react-router";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { InfoPage } from "../components/InfoPage";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — CineFest" },
      { name: "description", content: "Come contattare la Federazione Eventi Cinema." },
    ],
  }),
  component: ContattiPage,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.25, sm: 2 }}>
      <Typography sx={{ minWidth: 160, fontWeight: 700, color: "text.primary" }}>{label}</Typography>
      <Typography color="text.secondary">{value}</Typography>
    </Stack>
  );
}

function ContattiPage() {
  return (
    <InfoPage kicker="Federazione Eventi Cinema" title="Contatti">
      <p>
        Per informazioni su festival, biglietti o collaborazioni, il modo più veloce per
        raggiungerci è scriverci: rispondiamo entro 2-3 giorni lavorativi.
      </p>
      <Stack spacing={2} sx={{ mt: 3, mb: 3 }}>
        <Row label="Uffici operativi" value="Piazzale Never Gonna Give 67, 00111 You" />
        <Row label="Telefono" value="+39 676 676 6767" />
        <Row label="Email" value="info@nevergonnagiveyou.uo" />
        <Row label="Sede legale" value="Viale P. De Give Up, 67" />
      </Stack>
      <h2>Orari</h2>
      <p>Dal lunedì al venerdì, 9:00 – 18:00. Chiuso nei giorni festivi e ad agosto.</p>
      <h2>Ufficio stampa</h2>
      <p>
        Per richieste di accredito stampa o materiali promozionali dei festival partner, scrivi
        indicando festival, testata e data dell'evento a cui sei interessato.
      </p>
    </InfoPage>
  );
}
