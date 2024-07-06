import React from 'react';
import { useAuth } from "../../auth/AuthWrapper";
import CandidateProfilePage from "../CandidateProfilePage/CandidateProfilePage";

interface Props {}

const AccountPage: React.FC<Props> = () => {
  const { user } = useAuth();
  return (
    <div>
      <CandidateProfilePage userId={user.id} />
    </div>
  );
};

export default AccountPage;
