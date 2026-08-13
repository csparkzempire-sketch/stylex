import { CSPARKZ_BRAND } from "../config/brand";

// Parent-company brand credit. variant: "full" | "compact" | "mark" | "text".
// theme: "dark" | "light" (Stylex is dark-only today; "light" is here for
// forward-compat if a light theme is ever added).
export default function CSparkzEmpireBrand({ variant = "full", compact = false, theme = "dark" }) {
  const isCompact = compact || variant === "compact";
  const useMark = variant === "mark" || isCompact;
  const showImage = variant !== "text";
  const showText = variant !== "mark";
  const textColor = theme === "light" ? "#6B6B78" : "#888898";

  const body = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: isCompact ? "8px 0" : "16px 0" }}>
      {showImage && (
        <img
          src={useMark ? CSPARKZ_BRAND.logoMark : CSPARKZ_BRAND.logo}
          alt={CSPARKZ_BRAND.name}
          style={{ height: isCompact ? 16 : 22, width: "auto", objectFit: "contain", opacity: 0.92 }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}
      {showText && (
        <span style={{ fontSize: isCompact ? 11 : 12, color: textColor, letterSpacing: 0.3, fontWeight: 500 }}>
          {CSPARKZ_BRAND.poweredBy}
        </span>
      )}
    </div>
  );

  if (!CSPARKZ_BRAND.url) return body;

  return (
    <a
      href={CSPARKZ_BRAND.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={CSPARKZ_BRAND.name}
      style={{ textDecoration: "none", display: "block" }}
    >
      {body}
    </a>
  );
}
