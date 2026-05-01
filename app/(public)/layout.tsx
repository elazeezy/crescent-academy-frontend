import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow min-h-[60vh]">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
