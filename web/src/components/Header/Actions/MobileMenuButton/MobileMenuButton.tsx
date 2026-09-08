import { IonIcon } from "@ionic/react";
import {
  closeOutline,
  menuOutline,
} from "ionicons/icons";

import "./MobileMenuButton.css";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

function MobileMenuButton({
  isOpen,
  onClick,
}: MobileMenuButtonProps) {
  return (
    <button
      className="mobile-menu-button"
      type="button"
      aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      aria-controls="mobile-navigation"
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <IonIcon
        icon={isOpen ? closeOutline : menuOutline}
        aria-hidden="true"
      />
    </button>
  );
}

export default MobileMenuButton;