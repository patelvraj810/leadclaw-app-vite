export function Button({ 
  children, 
  variant = 'dark', 
  size = 'md', 
  fullWidth = false, 
  className = '', 
  ...props 
}) {
  const baseClasses = 'btn';
  const variantClasses = variant === 'ghost' ? 'btn-ghost' : 'btn-dark';
  const sizeClasses = size === 'lg' ? 'btn-lg' : '';
  const fullWidthClasses = fullWidth ? 'btn-full' : '';

  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${fullWidthClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
