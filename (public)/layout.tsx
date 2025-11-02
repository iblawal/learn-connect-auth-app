import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import PageWrapper from "@/components/PageWrapper";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Header />
      <main className="flex-1">
        <PageWrapper>{children}</PageWrapper>
      </main>
    </div>
  );
}