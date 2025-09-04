import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}


