import React from "react";
import Header from "./header";
import Footer from "@/components/footer/Footer";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className='bg-background/5 px-[3%] py-5 min-h-screen'>
    {children}
        <Footer />
    </div>;
};

export default Layout;
