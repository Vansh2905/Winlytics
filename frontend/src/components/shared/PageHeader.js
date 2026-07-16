export default function PageHeader({ title, description, children }) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-3 text-muted-foreground max-w-2xl">{description}</p>
      )}
      {children}
    </div>
  );
}
