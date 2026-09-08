import {
   IonIcon,
} from "@ionic/react";

import {
   compassOutline,
   flameOutline,
   timeOutline,
   gridOutline,
   languageOutline,
   menuOutline,
} from "ionicons/icons";

import "./Header.css";

function Header() {
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

            <div className="header__actions">

               <button
                  className="header__language"
                  type="button"
                  aria-label="Selecionar idioma"
                  aria-haspopup="listbox"
                  aria-expanded="false"
               >
                  <IonIcon
                     icon={languageOutline}
                     aria-hidden="true"
                  />

                  <span>PT-BR</span>
               </button>

               <button
                  className="header__menu"
                  type="button"
                  aria-label="Abrir menu"
                  aria-controls="mobile-navigation"
                  aria-expanded="false"
               >
                  <IonIcon
                     icon={menuOutline}
                     aria-hidden="true"
                  />
               </button>

            </div>

         </div>
      </header>
   );
}

export default Header;