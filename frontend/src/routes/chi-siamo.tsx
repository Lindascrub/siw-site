import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "../components/InfoPage";

export const Route = createFileRoute("/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi siamo — CineFest" },
      { name: "description", content: "La Federazione Eventi Cinema e la storia di CineFest." },
    ],
  }),
  component: ChiSiamoPage,
});

function ChiSiamoPage() {
  return (
    <InfoPage kicker="Federazione Eventi Cinema" title="Chi siamo">
      <p>
        CineFest nasce nel 2024 come portale unico della Federazione Eventi Cinema, l'ente che
        raggruppa i principali festival cinematografici italiani, dalle grandi rassegne nelle
        città d'arte alle rassegne di quartiere dedicate ai generi più di nicchia.
      </p>
      <p>
        La nostra missione è semplice: rendere facile scoprire cosa vedere, dove e quando,
        mettendo in un unico catalogo film, proiezioni e recensioni del pubblico, senza dover
        rincorrere decine di siti diversi per ogni festival.
      </p>
      <h2>La squadra</h2>
      <p>
        Dietro CineFest c'è un piccolo gruppo di appassionati di cinema, sviluppatori e
        organizzatori di eventi culturali, distribuiti tra Roma, Torino e Napoli — le città in
        cui è nata l'idea del progetto.
      </p>
      <h2>I numeri</h2>
      <ul>
        <li>Oltre 30 festival partner in tutta Italia</li>
        <li>Centinaia di film catalogati, dai grandi classici alle uscite più recenti</li>
        <li>Migliaia di recensioni lasciate dalla community</li>
      </ul>
      <p>
        Per qualsiasi domanda sulla Federazione o sui festival partner, la pagina{" "}
        <strong>Contatti</strong> è il punto di partenza giusto.
      </p>
    </InfoPage>
  );
}
