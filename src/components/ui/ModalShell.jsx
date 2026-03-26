export function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  className = '',
  maxWidth = 720,
}) {
  return (
    <div className="modal-shell">
      <div className={`modal-card ${className}`.trim()} style={{ maxWidth }}>
        <div className="modal-head">
          <div>
            <div className="modal-title">{title}</div>
            {subtitle ? <p className="modal-subtitle">{subtitle}</p> : null}
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
