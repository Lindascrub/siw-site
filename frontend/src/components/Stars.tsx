import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";

interface StarsProps {
  vote: number;
  size?: "small" | "medium" | "large";
}

/** Fila di 5 stelle (voto 1-5) in sola lettura. */
export function Stars({ vote, size = "small" }: StarsProps) {
  return (
    <Rating
      value={vote}
      max={5}
      readOnly
      size={size}
      sx={{ color: "primary.main", verticalAlign: "middle" }}
      aria-label={`Voto: ${vote} su 5`}
    />
  );
}

interface StarPickerProps {
  value: number;
  onChange: (v: number) => void;
}

/** Selettore interattivo del voto per il form recensione. */
export function StarPicker({ value, onChange }: StarPickerProps) {
  return (
    <Box>
      <Rating
        value={value}
        max={5}
        size="large"
        onChange={(_, v) => onChange(v ?? 0)}
        sx={{ color: "primary.main" }}
        aria-label="Voto"
      />
    </Box>
  );
}
