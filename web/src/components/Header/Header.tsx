import { useEffect, useRef, useState } from "react";

import korevaxLogo from "../../assets/Korevax.svg";

import Navigation from "./Navigation/Navigation";

import Actions from "./Actions/Actions";
import MobileNavigation from "./MobileNavigation/MobileNavigation";

import { useLanguage } from "../../contexts/LanguageContext";

import "./Header.css";


function Header() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] =
      useState(false);

   const mobileMenuButtonRef =
      useRef<HTMLButtonElement>(null);

   const { translation } =
      useLanguage();


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


   return (
      <header className="header">

         <div className="header__container">

            {/* Logo */}

            <a
               className="header__logo"
               href="/"
               aria-label={translation.header.home}
            >

               <img
   className="header__logo-icon"
   src={korevaxLogo}
   alt=""
   aria-hidden="true"
/>
               <span className="header__logo-text">
                  Korevax
               </span>
            </a>


            {/* Desktop Navigation */}
<Navigation />


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