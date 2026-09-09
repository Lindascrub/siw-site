import { useState } from "react";

/**
 * Paginazione lato client per le tabelle del pannello admin: i dati sono
 * gia' interamente caricati (necessari anche per i menu a tendina di
 * riferimento, es. "Regista" nel form Film), quindi qui si pagina solo la
 * porzione visualizzata nella tabella - niente chiamate aggiuntive al backend.
 * La pagina viene "agganciata" (clamp) all'ultima valida: se un filtro
 * riduce il risultato, non serve resettare manualmente la pagina altrove.
 */
export function usePagedTable<T>(items: T[], pageSize = 20) {
  const [page, setPage] = useState(0); // 0-based

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = items.slice(safePage * pageSize, safePage * pageSize + pageSize);

  return { page: safePage, setPage, totalPages, pageItems, totalElements: items.length };
}
