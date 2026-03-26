export function Tag({ children, color = 'gray', className = '' }) {
  const colorMap = {
    green: 'tag-green',
    blue: 'tag-blue',
    purple: 'tag-purple',
    amber: 'tag-amber',
    red: 'tag-red',
    gray: 'tag-gray',
  };

  return (
    <span className={`tag ${colorMap[color]} ${className}`}>
      {children}
    </span>
  );
}
