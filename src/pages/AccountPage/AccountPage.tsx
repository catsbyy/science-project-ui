import React from "react";
import { useAuth } from "../../auth/AuthWrapper";
import CandidateProfilePage from "../CandidateProfilePage/CandidateProfilePage";
import "./AccountPage.css"; // Create and import a CSS file for AccountPage-specific styles

interface Props {}

const AccountPage: React.FC<Props> = () => {
  const { user, setUser } = useAuth();
  return (
    <CandidateProfilePage user={user} setUser={setUser} />
  );
};

export default AccountPage;
