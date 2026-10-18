/* Mobile Navigation Component */

import { IonIcon } from "@ionic/react";

import {
   compassOutline,
   flameOutline,
   pulseOutline,
   bookOutline,
} from "ionicons/icons";

import { useLanguage, } from "../../../contexts/useLanguage";

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
                  href="/torrents"
                  onClick={onNavigate}
               >
                  <IonIcon
                     icon={pulseOutline}
                     aria-hidden="true"
                  />

                  <span>{translation.header.navigation.recent}</span>
               </a>
            </li>

            <li className="mobile-navigation__item">
               <a
                  className="mobile-navigation__link"
                  href="/wiki"
                  onClick={onNavigate}
               >
                  <IonIcon
                     icon={bookOutline}
                     aria-hidden="true"
                  />

                  <span>{translation.header.navigation.wiki}</span>
               </a>
            </li>

         </ul>
      </nav>
   );
}

export default MobileNavigation;