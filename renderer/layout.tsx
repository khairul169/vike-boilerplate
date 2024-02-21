import React from "react";
import { PageContextProvider } from "./context";
import type { PageContext } from "vike/types";
import "./global.css";
import "nprogress/nprogress.css";

type LayoutProps = {
  children: React.ReactNode;
  pageContext: PageContext;
};

const Layout = ({ children, pageContext }: LayoutProps) => {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        {children}
      </PageContextProvider>
    </React.StrictMode>
  );
};

export default Layout;
