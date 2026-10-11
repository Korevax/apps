import AppLayout from "./layouts/AppLayout";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home/Home";

import { ContentDetails } from "./pages/ContentDetails/ContentDetails";

function App() {
   return (
      <LanguageProvider>
         <AppLayout>
            <Home />

            <ContentDetails />
         </AppLayout>
      </LanguageProvider>
   );
}


export default App;