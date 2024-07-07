import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import moment from "moment/moment";
import {
  LogoLinkedin,
  LogoGithub,
  LocationOutline,
  MailOutline,
  PhonePortraitOutline,
  CalendarOutline,
} from "react-ionicons";

import { TextField, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from "@mui/material";
import FormControlTextField from "../../components/FormControlTextField/FormControlTextFields";
import "./CandidateProfilePage.css";
/* types */
import { Response } from "../../types/Response";
import { Candidate } from "../../types/Candidate.ts";
import { mapApiResponseToCandidate } from "../../helpers/mapApiResponseToCandidate.tsx";
import {
  getMetaDataValue,
  getEnglishLevel,
  getWorkArea,
  getPosition,
  getEducationLevel,
  getWorkplace,
  getSalary,
  getBirthday,
  getRegion,
  getWorkExperience,
  getTechAndToolsNames,
} from "../../helpers/getMetaDataValue.tsx";

import { CandidateUser, BusinessUser } from "../../types/UserTypes.ts";

interface CandidateProfilePageProps {
  user?: CandidateUser | BusinessUser | null | undefined;
}

const CandidateProfilePage: React.FC<CandidateProfilePageProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [response, setResponse] = useState<Response>({
    regions: [],
    techAndTools: [],
    english: [],
    education: [],
    position: [],
    salary: [],
    workArea: [],
    workExp: [],
    workplace: [],
  });

  const [isProfileTab, setIsProfileTab] = useState<boolean>(true);

  let isBusinessUser = user?.role === "business";

  useEffect(() => {
    if (!isBusinessUser) {
      const fetchCandidateDetails = async () => {
        try {
          const response = await fetch(
            `/api/business/get-candidate-details/${user?.id || id}${user?.id ? "/true" : ""}`
          );
          const data = await response.json();
          setCandidate(mapApiResponseToCandidate(data.candidate[0]));
        } catch (error) {
          console.error("Failed to fetch candidate details:", error);
        }
      };

      const fetchMetaData = async () => {
        try {
          const response = await fetch("/api/get-meta-data");
          const data = await response.json();
          setResponse(data);
        } catch (error) {
          console.error("Failed to fetch metadata:", error);
        }
      };

      fetchCandidateDetails();
      fetchMetaData();
    }
  }, [user?.id, id]);

  let englishLevel = "";
  let position = "";
  let workExperience = "";
  let workArea = "";
  let educationLevel = "";
  let workplace = "";
  let salary = "";
  let birthday = "";
  let region = "";
  let techAndToolsNames = [];

  if (!isBusinessUser && candidate) {
    englishLevel = getEnglishLevel(candidate, response);
    position = getPosition(candidate, response);
    workExperience = getWorkExperience(candidate, response);
    workArea = getWorkArea(candidate, response);
    educationLevel = getEducationLevel(candidate, response);
    workplace = getWorkplace(candidate, response);
    salary = getSalary(candidate, response);
    birthday = getBirthday(candidate);
    region = getRegion(candidate, response);

    techAndToolsNames = getTechAndToolsNames(candidate, response);
  }

  const handleUserChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
    const value = event.target.value;
    // Assuming 'user' is mutable, you can update it directly
    if (user) {
      // Use spread operator to maintain immutability
      const updatedUser = { ...user, [fieldName]: value };
      // Update state with the new user object
      // Replace 'user' with 'updatedUser' in the useState setter if needed
    }
  };

  return (
    <main className="page">
      <div className="intro">
        <div className="waves">
          <div className="wave -one"></div>
          <div className="wave -two"></div>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-section-wrapper">
          {user?.id && (
            <ul className="small-menu">
              <li className={isProfileTab ? "selected-item" : ""} onClick={() => setIsProfileTab(true)}>
                Мій профіль
              </li>
              <li className={!isProfileTab ? "selected-item" : ""} onClick={() => setIsProfileTab(false)}>
                Редагувати дані
              </li>
            </ul>
          )}
          {isProfileTab && !isBusinessUser && candidate && (
            <>
              <div className="profile-contacts">
                <div className="profile-contacts-bg"></div>

                <div className="profile-picture-wrapper">
                  <img className="profile-picture" alt="" src={candidate.candidateProfilePic} />
                </div>

                <div className="profile-name">{candidate.candidateName + " " + candidate.candidateSurname}</div>

                <div className="profile-contacts-details-wrapper">
                  <div className="profile-contacts-details-div">
                    <CalendarOutline color={"#fff"} title={"birthday"} height="24px" width="24px" />
                    <p className="profile-contacts-details">{birthday}</p>
                  </div>

                  <div className="profile-contacts-details-div">
                    <LocationOutline color={"#fff"} title={"location"} height="24px" width="24px" />
                    <div>
                      <p className="profile-contacts-details">{candidate.candidateCity},</p>
                      <p className="profile-contacts-details">{region}</p>
                    </div>
                  </div>

                  <div className="profile-contacts-details-div">
                    <MailOutline color={"#fff"} title={"mail"} height="24px" width="24px" />
                    <p className="profile-contacts-details">{candidate.candidateEmail}</p>
                  </div>

                  <div className="profile-contacts-details-div">
                    <PhonePortraitOutline color={"#fff"} title={"phone"} height="24px" width="24px" />
                    <p className="profile-contacts-details">{candidate.candidateMobNumber}</p>
                  </div>

                  <div className="profile-contacts-details-buttons">
                    {candidate.candidateLinkedin && (
                      <a href={candidate.candidateLinkedin}>
                        <LogoLinkedin height="30px" width="30px" color={"#fff"}></LogoLinkedin>
                      </a>
                    )}
                    {candidate.candidateGithub && (
                      <a href={candidate.candidateGithub}>
                        <LogoGithub height="30px" width="30px" color={"#fff"}></LogoGithub>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-first-section">
                <div className="profile-summary">
                  <b className="profile-title">Про себе:</b>
                  <div className="profile-details">{candidate.candidateSummary}</div>
                </div>
                <div className="profile-education">
                  <b className="profile-title">Освіта: </b>
                  <b className="profile-details">{educationLevel}</b>
                </div>
                <div className="profile-unversity">
                  <b className="profile-title">Заклад освіти:</b>
                  <div className="profile-details">{candidate.candidateUniversity}</div>
                </div>
                <div className="profile-specialty">
                  <b className="profile-title">Спеціальність: </b>
                  <div className="profile-details">{candidate.candidateSpecialty}</div>
                </div>
                <div className="profile-english">
                  <b className="profile-title">Рівень англійської: </b>
                  <div className="profile-details">{englishLevel}</div>
                </div>
              </div>

              <div className="profile-second-section">
                <div className="profile-position">
                  <b className="profile-title">Посада: </b>
                  <b className="profile-details">{position}</b>
                </div>
                <div className="profile-exp">
                  <b className="profile-title">Досвід роботи: </b>
                  <b className="profile-details">{workExperience}</b>
                </div>
                <div className="profile-workarea">
                  <b className="profile-title">Область роботи: </b>
                  <b className="profile-details">{workArea}</b>
                </div>
                <div className="profile-workplace">
                  <b className="profile-title">Бажане місце роботи: </b>
                  <b className="profile-details">{workplace}</b>
                </div>
                <div className="profile-salary">
                  <b className="profile-title">Бажана заробітня плата: </b>
                  <b className="profile-details">$ {salary}</b>
                </div>
                <div className="profile-skills">
                  <b className="profile-title">Технології та інструменти:</b>
                  <ul className="skills-section-profile">
                    {techAndToolsNames.map((techAndTool) => (
                      <li key={techAndTool.id}>{techAndTool.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
          {!isProfileTab && (
            <>
              <div className="inputs">
                <FormControl required={true}>
                  <FormLabel id="demo-radio-buttons-group-label" color="secondary">
                    Моя роль
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-required
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={user?.role}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel value="candidate" control={<Radio color="secondary" />} label="Кандидат" />
                    <FormControlLabel value="business" control={<Radio color="secondary" />} label="Роботодавець" />
                  </RadioGroup>
                </FormControl>
                {
                  <FormControlTextField
                    id="name"
                    label="Ім'я"
                    variant="outlined"
                    helperText="Введіть ваше ім'я"
                    name="name"
                    isRequired={true}
                    value={user?.name || ""}
                    onChange={(e) => handleUserChange(e, "name")}
                  />
                }

                {
                  <FormControlTextField
                    id="surname"
                    label="Прізвище"
                    variant="outlined"
                    helperText="Введіть ваше прізвище"
                    name="surname"
                    isRequired={true}
                    value={user?.surname || ""}
                    onChange={(e) => handleUserChange(e, "surname")}
                  />
                }

                <FormControlTextField
                  id="email"
                  label="Електронна пошта"
                  variant="outlined"
                  helperText="Введіть електронну пошту"
                  name="email"
                  isRequired={true}
                  value={user?.email || ""}
                  onChange={(e) => handleUserChange(e, "email")}
                />

                {
                  <FormControlTextField
                    id="company-name"
                    label="Назва компанії"
                    variant="outlined"
                    helperText="Введіть назву компанії"
                    name="companyName"
                    isRequired={true}
                    value={user?.companyName || ""}
                    onChange={(e) => handleUserChange(e, "companyName")}
                  />
                }

                <FormControlTextField
                  id="password"
                  label="Пароль"
                  variant="outlined"
                  helperText="Введіть пароль"
                  name="password"
                  isRequired={true}
                  value={user?.password || ""}
                  onChange={(e) => handleUserChange(e, "password")}
                />

                {
                  <FormControlTextField
                    id="confirm-password"
                    label="Підтвердіть пароль"
                    variant="outlined"
                    helperText="Введіть пароль ще раз"
                    name="confirm-password"
                    isRequired={true}
                    value={user?.password || ""}
                    onChange={(e) => handleUserChange(e, "password")}
                  />
                }
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default CandidateProfilePage;
