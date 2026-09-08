import {
   IonIcon,
} from "@ionic/react";

import {
   compassOutline,
   flameOutline,
   timeOutline,
   gridOutline,
} from "ionicons/icons";

import "./Header.css";
import { useEffect, useState } from "react";
import Actions from "./Actions/Actions";
import MobileNavigation from "./MobileNavigation/MobileNavigation";


function Header() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   useEffect(() => {
   function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
         setIsMobileMenuOpen(false);
      }
   }

   const mediaQuery = window.matchMedia(
      "(max-width: 768px)"
   );

   function handleViewportChange(
      event: MediaQueryListEvent
   ) {
      if (!event.matches) {
         setIsMobileMenuOpen(false);
      }
   }

   document.addEventListener("keydown", handleEscape);
   mediaQuery.addEventListener(
      "change",
      handleViewportChange
   );

   return () => {
      document.removeEventListener(
         "keydown",
         handleEscape
      );

      mediaQuery.removeEventListener(
         "change",
         handleViewportChange
      );
   };
}, []);

   function toggleMobileMenu() {
      setIsMobileMenuOpen((currentState) => !currentState);
   }

   function closeMobileMenu() {
   setIsMobileMenuOpen(false);
}

   return (
      
      <header className="header">
         <div className="header__container">

            <a
               className="header__logo"
               href="/"
               aria-label="Korevax - Página inicial"
            >
               <span className="header__logo-text">
                  Korevax
               </span>
            </a>

            <nav
               className="header__nav"
               aria-label="Navegação principal"
            >
               <ul className="header__nav-list">

                  <li className="header__nav-item">
                     <a
                        className="header__nav-link header__nav-link--active"
                        href="/discover"
                        aria-current="page"
                     >
                        <IonIcon
                           icon={compassOutline}
                           aria-hidden="true"
                        />

                        <span>Descobrir</span>
                     </a>
                  </li>

                  <li className="header__nav-item">
                     <a
                        className="header__nav-link"
                        href="/popular"
                     >
                        <IonIcon
                           icon={flameOutline}
                           aria-hidden="true"
                        />

                        <span>Popular</span>
                     </a>
                  </li>

                  <li className="header__nav-item">
                     <a
                        className="header__nav-link"
                        href="/recent"
                     >
                        <IonIcon
                           icon={timeOutline}
                           aria-hidden="true"
                        />

                        <span>Recentes</span>
                     </a>
                  </li>

                  <li className="header__nav-item">
                     <a
                        className="header__nav-link"
                        href="/collections"
                     >
                        <IonIcon
                           icon={gridOutline}
                           aria-hidden="true"
                        />

                        <span>Coleções</span>
                     </a>
                  </li>

               </ul>
            </nav>

            <Actions
               isMobileMenuOpen={isMobileMenuOpen}
               onMobileMenuToggle={toggleMobileMenu}
            />

         </div>

         <MobileNavigation
   isOpen={isMobileMenuOpen}
   onNavigate={closeMobileMenu}
/>
      </header>
   );
}

export default Header;