import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home/Home"));
const Discover = lazy(() => import("./pages/Discover/Discover"));

const ContentDetails = lazy(() =>
  import("./pages/ContentDetails/ContentDetails").then((module) => ({
    default: module.ContentDetails,
  })),
);

import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

/* Layout & Pages*/
import AppLayout from "./layouts/AppLayout";

import { LanguageProvider } from "./contexts/LanguageProvider";

import { home } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

function NotFoundPage() {
  return (
    <main className="content-details">
      <div className="content-details__container">
        <span className="noPage">404</span>
        <h1>Página não encontrada</h1>
        <p className="cd-txt">
          O endereço acessado não corresponde a uma página disponível.
        </p>
        <Link className="cd-Link" to="/">
          <IonIcon icon={home} aria-hidden="true" />
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}

function App() {
  return (
    <Suspense fallback={<div role="status">Carregando página...</div>}>
      <LanguageProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/content/:slug" element={<ContentDetails />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </LanguageProvider>
    </Suspense>
  );
}

export default App;
