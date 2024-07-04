import React, { useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import { useAuth } from "../../auth/AuthWrapper";
import { nav } from "../../routes/navigation";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Header.css";

// Function to render routes
export const RenderRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {nav.map((r, i) => {
        if (r.isPrivate && user.isAuthenticated && r.roles?.includes(user.role)) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else if (!r.isPrivate) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else return null;
      })}
    </Routes>
  );
};

// Function to render menu
export const RenderMenu = () => {
  const { user, logout } = useAuth();

  const { pathname } = useLocation();

  const [color, setColor] = useState<Boolean>(false);
  const changeColor = () => {
    if (window.scrollY >= 90) {
      setColor(true);
    } else {
      setColor(false);
    }
  };

  window.addEventListener("scroll", changeColor);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const MenuItem = ({ r }: { r: (typeof nav)[0] }) => {
    return (
      <li className="menu-item">
      <NavLink to={r.path}>
        {r.name === "Профіль" ? `${user.name} ${user.surname?.charAt(0)}.` : r.name}
      </NavLink>
    </li>
    );
  };

  return (
    <header className={color ? "site-header-bg" : "site-header"}>
      <div className="site-branding">
        <NavLink to="/" className="logo">
          <span>T</span>
          <span>e</span>
          <span>c</span>
          <span>h</span>
          <span>W</span>
          <span>a</span>
          <span>v</span>
          <span>e</span>
        </NavLink>
      </div>

      <div className="nav-wrapper">
        <nav className="header-menu">
          <ul className="menu">
            {nav.map((r, i) => {
              if (!r.isPrivate && r.isMenu) {
                return <MenuItem key={i} r={r} />;
              } else if (user.isAuthenticated && r.isMenu && r.roles?.includes(user.role)) {
                return <MenuItem key={i} r={r} />;
              } else return null;
            })}
            {user.isAuthenticated ? (
              <div className="logout">
                <NavLink to={"#"} onClick={logout}>
                  Вийти
                </NavLink>
              </div>
            ) : (
              <div className="login">
                <NavLink to={"login"}>Увійти</NavLink>
              </div>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
