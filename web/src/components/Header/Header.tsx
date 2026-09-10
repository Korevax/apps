import { useEffect, useRef, useState } from "react";

import { IonIcon } from "@ionic/react";

import {
   compassOutline,
   flameOutline,
   timeOutline,
   gridOutline,
} from "ionicons/icons";

import Actions from "./Actions/Actions";
import MobileNavigation from "./MobileNavigation/MobileNavigation";

import {
   defaultLocale,
   getTranslation,
} from "../../services/i18n";

import "./Header.css";


function Header() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);


   /*
    * Fecha o menu quando a tecla Escape é pressionada
    * e devolve o foco ao botão do menu.
    */
   useEffect(() => {
      function handleEscape(event: KeyboardEvent) {
         if (
            event.key === "Escape" &&
            isMobileMenuOpen
         ) {
            setIsMobileMenuOpen(false);

            requestAnimationFrame(() => {
               mobileMenuButtonRef.current?.focus();
            });
         }
      }


      document.addEventListener(
         "keydown",
         handleEscape
      );


      return () => {
         document.removeEventListener(
            "keydown",
            handleEscape
         );
      };
   }, [isMobileMenuOpen]);


   /*
    * Fecha o menu quando o viewport deixa
    * de estar na resolução mobile.
    */
   useEffect(() => {
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


      mediaQuery.addEventListener(
         "change",
         handleViewportChange
      );


      return () => {
         mediaQuery.removeEventListener(
            "change",
            handleViewportChange
         );
      };
   }, []);


   function toggleMobileMenu() {
      setIsMobileMenuOpen(
         (currentState) => !currentState
      );
   }


   function closeMobileMenu() {
      setIsMobileMenuOpen(false);
   }

   const translation = getTranslation(defaultLocale);


   return (
      <header className="header">

         <div className="header__container">

            {/* Logo */}

            <a
               className="header__logo"
               href="/"
               aria-label={translation.header.home}
            >
               <span className="header__logo-text">
                  Korevax
               </span>
            </a>


            {/* Desktop Navigation */}

            <nav
               className="header__nav"
               aria-label={translation.header.navigation.label}
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

                        <span>
                           translation.header.navigation.discover
                        </span>
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

                        <span>
                           translation.header.navigation.popular
                        </span>
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

                        <span>
                           translation.header.navigation.recent
                        </span>
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

                        <span>
                           translation.header.navigation.collections
                        </span>
                     </a>
                  </li>

               </ul>
            </nav>


            {/* Header Actions */}

            <Actions
               isMobileMenuOpen={isMobileMenuOpen}
               onMobileMenuToggle={toggleMobileMenu}
               mobileMenuButtonRef={mobileMenuButtonRef}
            />

         </div>


         {/* Mobile Navigation */}

         <MobileNavigation
            isOpen={isMobileMenuOpen}
            onNavigate={closeMobileMenu}
         />

      </header>
   );
}


export default Header;