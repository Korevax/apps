import AppLayout from "./layouts/AppLayout";
import { LanguageProvider } from "./contexts/LanguageContext";


function App() {
   return (
      <LanguageProvider>
         <AppLayout>
            <h1>Korevax</h1>
         </AppLayout>
      </LanguageProvider>
   );
}


export default App;