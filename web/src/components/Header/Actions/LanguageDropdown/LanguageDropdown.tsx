import {
   useEffect,
   useRef,
   useState,
} from "react";

import { IonIcon } from "@ionic/react";

import {
   languageOutline,
   chevronDownOutline,
} from "ionicons/icons";

import {
   languages,
   type Language,
} from "../../../../config/languages";

import {
   defaultLocale,
} from "../../../../services/i18n";

import "./LanguageDropdown.css";

function LanguageDropdown() {

   const [isOpen, setIsOpen] = useState(false);

   const [selectedLanguage, setSelectedLanguage] =
   useState<Language>(
      languages.find(
         (language) =>
            language.code === defaultLocale
      ) ?? languages[0]
   );

   const dropdownRef =
      useRef<HTMLDivElement>(null);

   const triggerRef =
      useRef<HTMLButtonElement>(null);

   const optionRefs =
      useRef<Array<HTMLButtonElement | null>>([]);


   /*
    * Fecha o dropdown quando o usuário
    * clica fora do componente.
    */
   useEffect(() => {

      function handleOutsideClick(
         event: MouseEvent
      ) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(
               event.target as Node
            )
         ) {
            setIsOpen(false);
         }
      }


      document.addEventListener(
         "mousedown",
         handleOutsideClick
      );


      return () => {
         document.removeEventListener(
            "mousedown",
            handleOutsideClick
         );
      };

   }, []);


   /*
    * Fecha o dropdown com Escape
    * e devolve o foco ao botão.
    */
   useEffect(() => {

      function handleEscape(
         event: globalThis.KeyboardEvent
      ) {
         if (
            event.key === "Escape" &&
            isOpen
         ) {
            event.preventDefault();

            setIsOpen(false);

            requestAnimationFrame(() => {
               triggerRef.current?.focus();
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

   }, [isOpen]);


   function toggleDropdown() {
      setIsOpen(
         (currentState) => !currentState
      );
   }


   function openDropdown() {
      setIsOpen(true);

      requestAnimationFrame(() => {
         const selectedIndex =
            languages.findIndex(
               (language) =>
                  language.code ===
                  selectedLanguage.code
            );

         optionRefs.current[
            selectedIndex >= 0
               ? selectedIndex
               : 0
         ]?.focus();
      });
   }


   function closeDropdown() {
      setIsOpen(false);
   }


   function selectLanguage(
      language: Language
   ) {
      setSelectedLanguage(language);
      setIsOpen(false);

      requestAnimationFrame(() => {
         triggerRef.current?.focus();
      });
   }


   function handleTriggerKeyDown(
      event: React.KeyboardEvent<HTMLButtonElement>
   ) {
      switch (event.key) {

         case "ArrowDown":
         case "Enter":
         case " ":
            event.preventDefault();
            openDropdown();
            break;

         case "Escape":
            if (isOpen) {
               event.preventDefault();
               closeDropdown();
            }
            break;

         default:
            break;
      }
   }


   function handleOptionKeyDown(
      event: React.KeyboardEvent<HTMLButtonElement>,
      index: number
   ) {
      switch (event.key) {

         case "ArrowDown": {
            event.preventDefault();

            const nextIndex =
               (index + 1) % languages.length;

            optionRefs.current[
               nextIndex
            ]?.focus();

            break;
         }


         case "ArrowUp": {
            event.preventDefault();

            const previousIndex =
               (index - 1 + languages.length) %
               languages.length;

            optionRefs.current[
               previousIndex
            ]?.focus();

            break;
         }


         case "Home":
            event.preventDefault();

            optionRefs.current[0]?.focus();

            break;


         case "End":
            event.preventDefault();

            optionRefs.current[
               languages.length - 1
            ]?.focus();

            break;


         case "Enter":
         case " ": {
            event.preventDefault();

            selectLanguage(
               languages[index]
            );

            break;
         }


         case "Escape":
            event.preventDefault();

            closeDropdown();

            requestAnimationFrame(() => {
               triggerRef.current?.focus();
            });

            break;


         default:
            break;
      }
   }


   return (
      <div
         ref={dropdownRef}
         className="language-dropdown"
         data-open={isOpen}
      >

         <button
            ref={triggerRef}
            className="language-dropdown__trigger"
            type="button"
            aria-label="Selecionar idioma"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls="language-dropdown-menu"
            onClick={toggleDropdown}
            onKeyDown={handleTriggerKeyDown}
         >
            <IonIcon
               className="language-dropdown__icon"
               icon={languageOutline}
               aria-hidden="true"
            />

            <span className="language-dropdown__current">
               {selectedLanguage.shortCode}
            </span>

            <IonIcon
               className="language-dropdown__chevron"
               icon={chevronDownOutline}
               aria-hidden="true"
            />
         </button>


         <ul
            id="language-dropdown-menu"
            className="language-dropdown__menu"
            role="listbox"
            aria-label="Idiomas disponíveis"
            aria-hidden={!isOpen}
            inert={!isOpen}
         >

            {languages.map(
               (language, index) => {

                  const isSelected =
                     language.code ===
                     selectedLanguage.code;


                  return (
                     <li
                        key={language.code}
                     >
                        <button
                           ref={(element) => {
                              optionRefs.current[index] =
                                 element;
                           }}
                           className={[
                              "language-dropdown__option",
                              isSelected
                                 ? "language-dropdown__option--active"
                                 : "",
                           ]
                              .filter(Boolean)
                              .join(" ")}
                           type="button"
                           role="option"
                           aria-selected={isSelected}
                           onClick={() =>
                              selectLanguage(
                                 language
                              )
                           }
                           onKeyDown={(event) =>
                              handleOptionKeyDown(
                                 event,
                                 index
                              )
                           }
                        >

                           <span
                              className="language-dropdown__flag"
                              aria-hidden="true"
                           >
                              {language.flag}
                           </span>


                           <span className="language-dropdown__name">
                              {language.name}
                           </span>


                           <span className="language-dropdown__code">
                              {language.shortCode}
                           </span>

                        </button>
                     </li>
                  );
               }
            )}

         </ul>

      </div>
   );
}


export default LanguageDropdown;