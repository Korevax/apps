import Header from "../components/Header/Header";
import type { ReactNode } from "react";

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

         <footer className="app__footer">
            {/* Footer futuramente */}
         </footer>
      </div>
   );
}

export default AppLayout;