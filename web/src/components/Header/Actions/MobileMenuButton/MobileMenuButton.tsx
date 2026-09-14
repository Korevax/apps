import {
   forwardRef,
} from "react";

import { IonIcon } from "@ionic/react";

import {
   closeOutline,
   menuOutline,
} from "ionicons/icons";

import { useLanguage, } from "../../../../contexts/LanguageContext";

import "./MobileMenuButton.css";

interface MobileMenuButtonProps {
   isOpen: boolean;
   onClick: () => void;
}


const MobileMenuButton = forwardRef<
   HTMLButtonElement,
   MobileMenuButtonProps
>(
   function MobileMenuButton(
      {
         isOpen,
         onClick,
      },
      ref
   ) {

      const { translation, } = useLanguage();

      return (
         <button
            ref={ref}
            className="mobile-menu-button"
            type="button"
            aria-label={
               isOpen
                  ? translation.header.mobileMenu.close
                  : translation.header.mobileMenu.open
            }
            aria-controls="mobile-navigation"
            aria-expanded={isOpen}
            onClick={onClick}
         >
            <IonIcon
               icon={
                  isOpen
                     ? closeOutline
                     : menuOutline
               }
               aria-hidden="true"
            />
         </button>
      );
   }
);


MobileMenuButton.displayName =
   "MobileMenuButton";


export default MobileMenuButton;