import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import { useAuth } from "../../auth/AuthWrapper";
import { nav } from "../../routes/navigation";
import "./Header.css";

// Function to render routes
export const RenderRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {nav.map((r, i) => {
        if (r.isPrivate && user.isAuthenticated) {
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

  const MenuItem = ({ r }: { r: (typeof nav)[0] }) => {
    return (
      <li className="menu-item">
        <NavLink to={r.path}>{r.name}</NavLink>
      </li>
    );
  };

  return (
    <header className="site-header">
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
              } else if (user.isAuthenticated && r.isMenu) {
                return <MenuItem key={i} r={r} />;
              } else return null;
            })}
            {user.isAuthenticated ? (
              <div className="login">
                <NavLink to={"#"} onClick={logout}>
                  Вийти
                </NavLink>
              </div>
            ) : (
              <div className="logout">
                <NavLink to={"login"}>Увійти</NavLink>
              </div>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
