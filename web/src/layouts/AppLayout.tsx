import Header from "../components/Header/Header";
import type { ReactNode } from "react";
import Footer from "../components/Footer/Footer";
import "../styles/layout.css";

interface AppLayoutProps {
   children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
   return (
      <div className="app">
         <header className="app__header">
            <Header />
         </header>

         <main className="app__main">
            {children}
         </main>

         <Footer />
      </div>
   );
}

export default AppLayout;