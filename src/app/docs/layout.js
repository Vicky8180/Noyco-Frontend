import DocsSidebar from '@/components/DocsSidebar';

export default function DocsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full z-10">
          <DocsSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 ml-80">
          {children}
        </div>
      </div>
    </div>
  );
}