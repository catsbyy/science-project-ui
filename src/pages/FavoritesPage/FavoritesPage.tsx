import React, { ChangeEvent, useState } from "react";
import { MailOutline, PersonCircleOutline, LockClosedOutline } from "react-ionicons";
import "./FavoritesPage.css";
import Button from "@mui/material/Button";
import { useNavigate, createSearchParams } from "react-router-dom";
import { TextField, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from "@mui/material";
import FormControlTextField from "../../components/FormControlTextField/FormControlTextFields";
import { CandidateUser, BusinessUser } from "../../types/UserTypes.ts";
import { useAuth } from "../../auth/AuthWrapper.tsx"; // Import useAuth hook
import confused from "../../assets/confused.gif";

interface Props {}

function FavoritesPage({}: Props) {
  return (
    <main className="page">
      <div className="intro">
        <div className="waves">
          <div className="wave -one"></div>
          <div className="wave -two"></div>
        </div>

        <div className="work-in-progress-section">
          <h2 className="landing-title">Обрані кандидати</h2>
          <div className="work-in-progress">
            <img src={confused} alt="work in progress" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default FavoritesPage;
