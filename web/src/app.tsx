import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import { LanguageProvider } from "./contexts/LanguageContext";

import Home from "./pages/Home/Home";
import { ContentDetails } from "./pages/ContentDetails/ContentDetails";

function NotFoundPage() {
  return (
    <main className="content-details">
      <div className="content-details__container">
        <span>404</span>
        <h1>Página não encontrada</h1>
        <p>O endereço acessado não corresponde a uma página disponível.</p>
        <Link to="/">Voltar ao início</Link>
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