import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// This layout wraps all public + main pages: /, /predict, /schedule, /analytics
export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
