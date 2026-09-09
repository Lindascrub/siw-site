import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "../components/InfoPage";

export const Route = createFileRoute("/partnership")({
  head: () => ({
    meta: [
      { title: "Partnership — CineFest" },
      { name: "description", content: "Diventa festival partner o sponsor di CineFest." },
    ],
  }),
  component: PartnershipPage,
});

function PartnershipPage() {
  return (
    <InfoPage kicker="Federazione Eventi Cinema" title="Partnership">
      <p>
        Organizzi un festival cinematografico e vuoi raggiungere un pubblico più ampio? CineFest
        offre visibilità gratuita a tutti i festival della Federazione: catalogo film condiviso,
        programma delle proiezioni sempre aggiornato e uno spazio dedicato alle recensioni del
        pubblico.
      </p>
      <h2>Cosa offriamo ai festival partner</h2>
      <ul>
        <li>Pagina dedicata con descrizione, date e città dell'evento</li>
        <li>Programma delle proiezioni consultabile online, con filtro per data</li>
        <li>Statistiche aggregate sulle recensioni dei film in cartellone</li>
        <li>Nessun costo di adesione per i festival no-profit</li>
      </ul>
      <h2>Sponsorship e collaborazioni commerciali</h2>
      <p>
        Per aziende e brand interessati a sponsorizzare un festival o una rassegna, valutiamo
        caso per caso il tipo di collaborazione più adatto: dal semplice supporto economico alla
        co-organizzazione di eventi speciali.
      </p>
      <h2>Come proporsi</h2>
      <p>
        Scrivici tramite la pagina <strong>Contatti</strong> indicando il nome del festival (o
        dell'azienda), la città e una breve descrizione del progetto: ti risponderemo con tutti i
        dettagli per procedere.
      </p>
    </InfoPage>
  );
}
