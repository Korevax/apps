import AppLayout from "./layouts/AppLayout";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home/Home";

function App() {
   return (
      <LanguageProvider>
         <AppLayout>
            <Home />
         </AppLayout>
      </LanguageProvider>
   );
}


export default App;