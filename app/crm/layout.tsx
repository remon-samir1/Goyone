import React from "react";
import Header from "./header";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className='bg-background/5 px-[3%] py-5 min-h-screen'>
    <Header/>
    {children}</div>;
};

export default Layout;
