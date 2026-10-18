import { IonIcon } from "@ionic/react";
import { NavLink } from "react-router-dom";
import { compassOutline, flameOutline, pulseOutline, albumsOutline } from "ionicons/icons";
import { useLanguage } from "../../../contexts/useLanguage";
import "./Navigation.css";

function Navigation() {
  const { translation } = useLanguage();
  const items = [
    { to: "/discover", icon: compassOutline, label: translation.header.navigation.discover },
    { to: "/popular", icon: flameOutline, label: translation.header.navigation.popular },
    { to: "/torrents", icon: pulseOutline, label: translation.header.navigation.recent },
    { to: "/collections", icon: albumsOutline, label: translation.header.navigation.collections },
  ];

  return (
    <nav className="header-navigation" aria-label={translation.header.navigation.label}>
      <ul className="header-navigation__list">
        {items.map(item => (
          <li className="header-navigation__item" key={item.to}>
            <NavLink
              className={({ isActive }) => `header-navigation__link${isActive ? " header-navigation__link--active" : ""}`}
              to={item.to}
              end={item.to === "/discover"}
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

export default Navigation;
