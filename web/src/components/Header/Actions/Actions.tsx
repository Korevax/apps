import LanguageDropdown from "./LanguageDropdown/LanguageDropdown";
import MobileMenuButton from "./MobileMenuButton/MobileMenuButton";

import "./Actions.css";

interface ActionsProps {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

function Actions({
  isMobileMenuOpen,
  onMobileMenuToggle,
}: ActionsProps) {
  return (
    <div className="header-actions">
      <LanguageDropdown />

      <MobileMenuButton
        isOpen={isMobileMenuOpen}
        onClick={onMobileMenuToggle}
      />
    </div>
  );
}

export default Actions;