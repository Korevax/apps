import { IonIcon } from "@ionic/react";

import {
   compassOutline,
   flameOutline,
   timeOutline,
   gridOutline,
} from "ionicons/icons";

import "./MobileNavigation.css";

interface MobileNavigationProps {
   isOpen: boolean;
}

function MobileNavigation({
   isOpen,
}: MobileNavigationProps) {
   return (
      <nav
         id="mobile-navigation"
         className="mobile-navigation"
         data-open={isOpen}
         aria-label="Navegação mobile"
         aria-hidden={!isOpen}
      >
         <ul className="mobile-navigation__list">

            <li className="mobile-navigation__item">
               <a
                  className="mobile-navigation__link mobile-navigation__link--active"
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

            <li className="mobile-navigation__item">
               <a
                  className="mobile-navigation__link"
                  href="/popular"
               >
                  <IonIcon
                     icon={flameOutline}
                     aria-hidden="true"
                  />

                  <span>Popular</span>
               </a>
            </li>

            <li className="mobile-navigation__item">
               <a
                  className="mobile-navigation__link"
                  href="/recent"
               >
                  <IonIcon
                     icon={timeOutline}
                     aria-hidden="true"
                  />

                  <span>Recentes</span>
               </a>
            </li>

            <li className="mobile-navigation__item">
               <a
                  className="mobile-navigation__link"
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
   );
}

export default MobileNavigation;