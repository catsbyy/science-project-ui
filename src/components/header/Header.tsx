import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import { useAuth } from "../../auth/AuthWrapper";
import { nav } from "../../routes/navigation";

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

  const MenuItem = ({ r }: { r: typeof nav[0] }) => {
    return (
      <li className="menuItem">
        <NavLink to={r.path}>{r.name}</NavLink>
      </li>
    );
  };

  return (
    <nav className="nav-wrapper">
      <div className="container-wide">
        <div className="row space-between align-center">
          <NavLink to="/" className="logo">
            SyncSkill
          </NavLink>

          <div className="nav">
            <ul>
              {nav.map((r, i) => {
                if (!r.isPrivate && r.isMenu) {
                  return <MenuItem key={i} r={r} />;
                } else if (user.isAuthenticated && r.isMenu) {
                  return <MenuItem key={i} r={r} />;
                } else return null;
              })}
            </ul>
          </div>

          {user.isAuthenticated ? (
            <div className="menuItem">
              <NavLink to={"#"} onClick={logout}>
                Вийти
              </NavLink>
            </div>
          ) : (
            <div className="menuItem">
              <NavLink to={"login"}>Увійти</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};