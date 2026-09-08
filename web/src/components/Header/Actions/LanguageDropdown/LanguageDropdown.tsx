import { useEffect, useRef, useState } from "react";
import { IonIcon } from "@ionic/react";
import {
   languageOutline,
   chevronDownOutline,
} from "ionicons/icons";

import "./LanguageDropdown.css";

function LanguageDropdown() {
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      function handleOutsideClick(event: MouseEvent) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
         }
      }

      function handleEscape(event: KeyboardEvent) {
         if (event.key === "Escape") {
            setIsOpen(false);
         }
      }

      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEscape);

      return () => {
         document.removeEventListener(
            "mousedown",
            handleOutsideClick,
         );

         document.removeEventListener(
            "keydown",
            handleEscape,
         );
      };
   }, []);

   function toggleDropdown() {
      setIsOpen((currentState) => !currentState);
   }

   function selectLanguage(language: string) {
      console.log(`Idioma selecionado: ${language}`);

      setIsOpen(false);
   }

   return (
      <div
         ref={dropdownRef}
         className="language-dropdown"
         data-open={isOpen}
      >
         <button
            className="language-dropdown__trigger"
            type="button"
            aria-label="Selecionar idioma"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={toggleDropdown}
         >
            <IonIcon
               className="language-dropdown__icon"
               icon={languageOutline}
               aria-hidden="true"
            />

            <span className="language-dropdown__current">
               PT-BR
            </span>

            <IonIcon
               className="language-dropdown__chevron"
               icon={chevronDownOutline}
               aria-hidden="true"
            />
         </button>

         <ul
            className="language-dropdown__menu"
            role="listbox"
            aria-label="Idiomas disponíveis"
         >
            <li>
   <button
      className="language-dropdown__option language-dropdown__option--active"
      type="button"
      role="option"
      aria-selected="true"
      onClick={() => selectLanguage("pt-BR")}
   >
      
      <span
         className="language-dropdown__flag"
         aria-hidden="true"
      >
         🇧🇷
      </span>

      <span className="language-dropdown__name">
         Português
      </span>

      <span className="language-dropdown__code">
         PT
      </span>

   </button>
</li>

<li>
   <button
      className="language-dropdown__option"
      type="button"
      role="option"
      aria-selected="false"
      onClick={() => selectLanguage("en")}
   >

      <span
         className="language-dropdown__flag"
         aria-hidden="true"
      >
         🇺🇸
      </span>

       <span className="language-dropdown__name">
         English
      </span>

      <span className="language-dropdown__code">
         EN
      </span>
     
   </button>
</li>
         </ul>
      </div>
   );
}

export default LanguageDropdown;