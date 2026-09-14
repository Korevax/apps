/* Mobile Navigation Component */

import { IonIcon } from "@ionic/react";

import {
   compassOutline,
   flameOutline,
   timeOutline,
   gridOutline,
} from "ionicons/icons";

import { useLanguage, } from "../../../contexts/LanguageContext";

import "./MobileNavigation.css";

interface MobileNavigationProps {
   isOpen: boolean;
   onNavigate: () => void;
}

function MobileNavigation({
   isOpen,
   onNavigate,
}: MobileNavigationProps) {

   const { translation, } = useLanguage();

   return (
      <nav
         id="mobile-navigation"
         className="mobile-navigation"
         data-open={isOpen}
         aria-label={ translation.header.navigation.label }
         aria-hidden={!isOpen}
         inert={!isOpen}
      >
         <ul className="mobile-navigation__list">

            <li className="mobile-navigation__item">
               <a
                  className="mobile-navigation__link mobile-navigation__link--active"
                  href="/discover"
                  aria-current="page"
                  onClick={onNavigate}
               >
                  <IonIcon
                     icon={compassOutline}
                     aria-hidden="true"
                  />

                  <span>{translation.header.navigation.discover}</span>
               </a>
            </li>

            <li className="mobile-navigation__item">
               <a
                  className="mobile-navigation__link"
                  href="/popular"
                  onClick={onNavigate}
               >
                  <IonIcon
                     icon={flameOutline}
                     aria-hidden="true"
                  />

                  <span>{translation.header.navigation.popular}</span>
               </a>
            </li>

            <li className="mobile-navigation__item">
               <a
                  className="mobile-navigation__link"
                  href="/recent"
                  onClick={onNavigate}
               >
                  <IonIcon
                     icon={timeOutline}
                     aria-hidden="true"
                  />

                  <span>{translation.header.navigation.recent}</span>
               </a>
            </li>

            <li className="mobile-navigation__item">
               <a
                  className="mobile-navigation__link"
                  href="/collections"
                  onClick={onNavigate}
               >
                  <IonIcon
                     icon={gridOutline}
                     aria-hidden="true"
                  />

                  <span>{translation.header.navigation.collections}</span>
               </a>
            </li>

         </ul>
      </nav>
   );
}

export default MobileNavigation;