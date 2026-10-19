import "./LoadingIndicator.css";

interface LoadingIndicatorProps {
  label: string;
  className?: string;
}

export function LoadingIndicator({ label, className = "" }: LoadingIndicatorProps) {
  const classes = ["loading-indicator", className].filter(Boolean).join(" ");

  return (
    <div className={classes} role="status" aria-live="polite">
      <span className="loading-indicator__spinner" aria-hidden="true" />
      <span className="loading-indicator__label">{label}</span>
    </div>
  );
}
