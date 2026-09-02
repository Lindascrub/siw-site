# Qui va la build di React

Questa cartella deve contenere il risultato di `npm run build` eseguito nel
progetto `siw-movie-frontend` (la cartella `dist/`, non il progetto intero).

Passi:

1. `cd siw-movie-frontend`
2. `npm install`
3. `npm run build`   -> genera la cartella `dist/`
4. Copia **il contenuto** di `dist/` qui dentro (in questa cartella
   `static/react/`), sovrascrivendo questo file. Alla fine dovresti avere:
   ```
   src/main/resources/static/react/
     index.html
     assets/
       index-XXXXXXXX.js
       index-XXXXXXXX.css
   ```
5. `mvn spring-boot:run`
6. Apri http://localhost:8080/react/

Ogni volta che modifichi il frontend, ripeti i passi 3-4 per aggiornare la
versione servita da Spring Boot.
