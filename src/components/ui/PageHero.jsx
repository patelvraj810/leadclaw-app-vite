export function PageHero({
  eyebrow,
  title,
  subtitle,
  stat,
  className = '',
  children,
}) {
  return (
    <section className={`page-hero ${className}`.trim()}>
      <div>
        {eyebrow ? <div className="page-eyebrow">{eyebrow}</div> : null}
        <h1 className="page-title">{title}</h1>
        {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
      </div>
      {stat ? (
        <div className="page-stat-chip">
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ) : null}
      {children}
    </section>
  );
}
