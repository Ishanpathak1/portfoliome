export default function NavigationPadding({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-12 sm:pt-16">
      {children}
    </div>
  );
} 