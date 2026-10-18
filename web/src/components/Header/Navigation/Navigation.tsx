import { IonIcon } from "@ionic/react";

import {
   compassOutline,
   flameOutline,
   pulseOutline,
   bookOutline,
} from "ionicons/icons";

import {
   useLanguage,
} from "../../../contexts/useLanguage";

import "./Navigation.css";


function Navigation() {

   const {
      translation,
   } = useLanguage();


   return (
      <nav
         className="header-navigation"
         aria-label={
            translation.header.navigation.label
         }
      >
         <ul className="header-navigation__list">

            <li className="header-navigation__item">
               <a
                  className="header-navigation__link"
                  href="/discover"
                  aria-current="page"
               >
                  <IonIcon
                     icon={compassOutline}
                     aria-hidden="true"
                  />

                  <span>
                     {translation.header.navigation.discover}
                  </span>
               </a>
            </li>


            <li className="header-navigation__item">
               <a
                  className="header-navigation__link"
                  href="/popular"
               >
                  <IonIcon
                     icon={flameOutline}
                     aria-hidden="true"
                  />

                  <span>
                     {translation.header.navigation.popular}
                  </span>
               </a>
            </li>


            <li className="header-navigation__item">
               <a
                  className="header-navigation__link"
                  href="/torrents"
               >
                  <IonIcon
                     icon={pulseOutline}
                     aria-hidden="true"
                  />

                  <span>
                     {translation.header.navigation.recent}
                  </span>
               </a>
            </li>


            <li className="header-navigation__item">
               <a
                  className="header-navigation__link"
                  href="/wiki"
               >
                  <IonIcon
                     icon={bookOutline}
                     aria-hidden="true"
                  />

                  <span>
                     {translation.header.navigation.wiki}
                  </span>
               </a>
            </li>

         </ul>
      </nav>
   );
}


export default Navigation;