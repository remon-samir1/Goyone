import React from "react";
import Header from "./header";
import Footer from "@/components/footer/Footer";
import Container from "@/components/ui/Container";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header Links={true} />
      <main className="flex-1 pb-12">
        <Container>{children}</Container>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
