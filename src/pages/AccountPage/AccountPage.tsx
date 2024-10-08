import React from "react";
import { useAuth } from "../../auth/AuthWrapper";
import CandidateProfilePage from "../CandidateProfilePage/CandidateProfilePage";
import "./AccountPage.css"; 

interface Props {}

const AccountPage: React.FC<Props> = () => {
  const { user } = useAuth();
  return (
    <CandidateProfilePage user={user} />
  );
};

export default AccountPage;
