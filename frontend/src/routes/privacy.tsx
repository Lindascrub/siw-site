import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "../components/InfoPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — CineFest" },
      { name: "description", content: "Informativa sulla privacy di CineFest." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <InfoPage kicker="Federazione Eventi Cinema" title="Informativa sulla privacy">
      <p>
        Questa pagina descrive, in modo semplice, quali dati raccogliamo su CineFest e come li
        utilizziamo. Il progetto è a scopo dimostrativo/didattico: nessun dato viene condiviso con
        terze parti o utilizzato a fini commerciali.
      </p>
      <h2>Dati raccolti in fase di registrazione</h2>
      <p>
        Per creare un account (necessario solo per lasciare recensioni) chiediamo nome, cognome,
        username, email e password. La password viene salvata in forma cifrata, non è mai
        leggibile in chiaro nemmeno dagli amministratori.
      </p>
      <h2>Recensioni</h2>
      <p>
        Le recensioni che pubblichi sono visibili a chiunque visiti la scheda del film, insieme al
        tuo username. Puoi modificarle o eliminarle in qualsiasi momento dalla scheda del film
        stesso.
      </p>
      <h2>Newsletter</h2>
      <p>
        L'indirizzo email inserito nel modulo "Rimani aggiornato" viene utilizzato esclusivamente
        per l'invio di comunicazioni relative ai festival della Federazione. Puoi richiederne la
        cancellazione in qualsiasi momento scrivendo alla nostra email di contatto.
      </p>
      <h2>Cookie</h2>
      <p>
        Utilizziamo solo un cookie tecnico di sessione, necessario per mantenere l'accesso
        effettuato. Non utilizziamo cookie di profilazione o di tracciamento pubblicitario.
      </p>
      <h2>I tuoi diritti</h2>
      <p>
        Puoi richiedere in qualsiasi momento l'accesso, la modifica o la cancellazione dei tuoi
        dati personali scrivendoci tramite la pagina <strong>Contatti</strong>.
      </p>
    </InfoPage>
  );
}
