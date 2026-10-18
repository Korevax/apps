import { IonIcon } from "@ionic/react";
import { NavLink } from "react-router-dom";
import { compassOutline, flameOutline, pulseOutline, albumsOutline } from "ionicons/icons";
import { useLanguage } from "../../../contexts/useLanguage";
import "./MobileNavigation.css";

interface MobileNavigationProps {
  isOpen: boolean;
  onNavigate: () => void;
}

function MobileNavigation({ isOpen, onNavigate }: MobileNavigationProps) {
  const { translation } = useLanguage();
  const items = [
    { to: "/discover", icon: compassOutline, label: translation.header.navigation.discover },
    { to: "/popular", icon: flameOutline, label: translation.header.navigation.popular },
    { to: "/torrents", icon: pulseOutline, label: translation.header.navigation.recent },
    { to: "/collections", icon: albumsOutline, label: translation.header.navigation.collections },
  ];

  return (
    <nav
      id="mobile-navigation"
      className="mobile-navigation"
      data-open={isOpen}
      aria-label={translation.header.navigation.label}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <ul className="mobile-navigation__list">
        {items.map(item => (
          <li className="mobile-navigation__item" key={item.to}>
            <NavLink
              className={({ isActive }) => `mobile-navigation__link${isActive ? " mobile-navigation__link--active" : ""}`}
              to={item.to}
              end={item.to === "/discover"}
              onClick={onNavigate}
            >
              <IonIcon icon={item.icon} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MobileNavigation;
