export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-white/80 rounded-full animate-spin mb-6" />
        <p className="text-white/60">Loading portfolio…</p>
      </div>
    </div>
  );
}
