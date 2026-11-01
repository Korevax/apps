import "./LoadingIndicator.css";

interface LoadingIndicatorProps {
  label?: string;
  className?: string;
}

export function LoadingIndicator({
  label = "Atualizando conteúdo",
  className = "",
}: LoadingIndicatorProps) {
  const classes = ["loading-indicator", className].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={label}
    >
      <span className="loading-indicator__spinner" aria-hidden="true" />
    </div>
  );
}
