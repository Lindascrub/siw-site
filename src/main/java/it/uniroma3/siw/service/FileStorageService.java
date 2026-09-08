package it.uniroma3.siw.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Salva i file caricati (locandine dei film) su disco, in una cartella
 * esterna al progetto (non dentro src/main/resources/static, che una volta
 * impacchettato in .jar non e' piu' scrivibile a runtime). Il nome del
 * file salvato su disco e' generato in automatico (UUID), non e' mai il
 * nome originale del file caricato dall'utente - evita sia collisioni di
 * nome sia problemi di sicurezza legati a nomi di file malformati.
 */
@Service
public class FileStorageService {

    private final Path uploadDir;

    public FileStorageService(@Value("${app.upload.dir:./uploads}") String uploadDirPath) {
        this.uploadDir = Paths.get(uploadDirPath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Impossibile creare la cartella di upload: " + this.uploadDir, e);
        }
    }

    /** Salva il file, restituisce il nome (univoco) con cui e' stato salvato su disco. */
    public String store(MultipartFile file) {
        String original = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        String extension = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) {
            extension = original.substring(dot);
        }
        String filename = UUID.randomUUID() + extension;
        try {
            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Errore nel salvataggio del file", e);
        }
        return filename;
    }

    /** Elimina un file precedentemente salvato (es. quando si sostituisce una locandina). */
    public void delete(String filename) {
        if (filename == null) {
            return;
        }
        try {
            Files.deleteIfExists(uploadDir.resolve(filename));
        } catch (IOException ignored) {
            // non blocchiamo l'operazione principale (es. update del film) se la
            // cancellazione del vecchio file fallisce - resta solo un file orfano
        }
    }
}