import type { RefObject } from "react";

import LanguageDropdown from "./LanguageDropdown/LanguageDropdown";
import MobileMenuButton from "./MobileMenuButton/MobileMenuButton";

import "./Actions.css";


interface ActionsProps {
   isMobileMenuOpen: boolean;
   onMobileMenuToggle: () => void;
   mobileMenuButtonRef: RefObject<HTMLButtonElement | null>;
}


function Actions({
   isMobileMenuOpen,
   onMobileMenuToggle,
   mobileMenuButtonRef,
}: ActionsProps) {
   return (
      <div className="header-actions">

         <LanguageDropdown />

         <MobileMenuButton
            ref={mobileMenuButtonRef}
            isOpen={isMobileMenuOpen}
            onClick={onMobileMenuToggle}
         />

      </div>
   );
}


export default Actions;