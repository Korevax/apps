import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home/Home"));
const Discover = lazy(() => import("./pages/Discover/Discover"));

const ContentDetails = lazy(() =>
  import("./pages/ContentDetails/ContentDetails").then((module) => ({
    default: module.ContentDetails,
  })),
);

import "./pages/ContentDetails/ContentDetails.css";

import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

/* Layout & Pages*/
import AppLayout from "./layouts/AppLayout";

import { LanguageProvider } from "./contexts/LanguageProvider";
import {
   useLanguage,
} from "./contexts/useLanguage";


import { home } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

function NotFoundPage() {

  const {
      translation,
   } = useLanguage();

  return (
    <main className="content-details">
      <div className="content-details__container">
        <span className="noPage">404</span>
        <h1>{translation.NotFoundPage.title}</h1>
        <p className="cd-txt">
          {translation.NotFoundPage.desc}
        </p>
        <Link className="cd-Link" to="/">
          <IonIcon icon={home} aria-hidden="true" />
          {translation.NotFoundPage.link}
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
