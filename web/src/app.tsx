import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import { LanguageProvider } from "./contexts/LanguageContext";

import Home from "./pages/Home/Home";
import { ContentDetails } from "./pages/ContentDetails/ContentDetails";

import { home } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

function NotFoundPage() {
  return (
    <main className="content-details">
      <div className="content-details__container">
        <span>404</span>
        <h1>Página não encontrada</h1>
        <p className="cd-txt">O endereço acessado não corresponde a uma página disponível.</p>
        <Link className="cd-Link" to="/"><IonIcon icon={home} aria-hidden="true" />Voltar ao início</Link>
      </div>
    </main>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Home />} />
            <Route path="/content/:slug" element={<ContentDetails />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;