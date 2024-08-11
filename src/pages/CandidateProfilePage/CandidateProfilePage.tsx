import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { CheckmarkOutline, LockClosedOutline, LockOpenOutline } from "react-ionicons";
import {
  LogoLinkedin,
  LogoGithub,
  LocationOutline,
  MailOutline,
  PhonePortraitOutline,
  CalendarOutline,
  HeartOutline,
  Heart,
} from "react-ionicons";
import { TextField, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from "@mui/material";
import "./CandidateProfilePage.css";
/* types */
import { Response } from "../../types/Response.ts";
import { Candidate } from "../../types/Candidate.ts";
import { CandidateUser, BusinessUser } from "../../types/UserTypes.ts";

import { mapApiResponseToCandidate } from "../../helpers/mapApiResponseToCandidate";
import {
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
} from "../../helpers/getMetaDataValue";
import FormControlTextField from "../../components/FormControlTextField/FormControlTextFields";
import { useAuth } from "../../auth/AuthWrapper.tsx"; // Import useAuth hook

interface CandidateProfilePageProps {
  user?: CandidateUser | BusinessUser | null;
  isFavorite?: boolean;
}

const CandidateProfilePage: React.FC<CandidateProfilePageProps> = ({ user: propUser }) => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState({
    ...propUser,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updateError, setUpdateError] = useState<string>("");
  const [updateSuccess, setUpdateSuccess] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(true);
  const [favorites, setFavorites] = useState([]);

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

  const isBusinessUser = propUser?.role === "business";
  const [isProfileTab, setIsProfileTab] = useState<boolean>(!isBusinessUser);
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);


  console.log("current propUser: ", currentUser);

  useEffect(() => {
    if (!isBusinessUser) {
      const fetchCandidateDetails = async () => {
        try {
          const response = await fetch(
            `/api/business/get-candidate-details/${propUser?.id || id}${propUser?.id ? "/true" : ""}`
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

      const fetchFavoriteStatus = async () => {
        try {
          const response = await fetch(`/api/business/favorites/${user.id}`);
          const data = await response.json();
          console.log(data.favorites);
          if (data.success) {
            setFavorites(data.favorites);
          } else {
            console.error("Failed to fetch favorites:", data.message);
          }
        } catch (error) {
          console.error("Failed to fetch favorite status:", error);
        }
      };

      fetchCandidateDetails();
      fetchMetaData();
      fetchFavoriteStatus();
    }
  }, [propUser?.id, id]);

  useEffect(() => {
    const isCandidateFavorite = favorites.some(fav => fav.candidate_id === candidate.candidateId);
    setIsFavorite(isCandidateFavorite);
  }, [favorites])

  let englishLevel = "";
  let position = "";
  let workExperience = "";
  let workArea = "";
  let educationLevel = "";
  let workplace = "";
  let salary = "";
  let birthday = "";
  let region = "";
  let techAndToolsNames: string[] = [];

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
    if (!currentUser) return;

    const value = event.target.value;

    // Create a new user object with the updated field
    const updatedUser = {
      ...currentUser,
      [fieldName]: value,
    };

    // Update the state with the new user object
    setCurrentUser(updatedUser);
  };

  const handleUpdateSubmit = async () => {
    if (!currentUser) return;

    // Validation: Ensure no field is blank
    if (
      !currentUser.name ||
      !currentUser.surname ||
      !currentUser.email ||
      (currentUser.role === "business" && !currentUser.companyName)
    ) {
      setUpdateError("Всі поля повинні бути заповнені");
      return;
    }

    try {
      // Call API to update user details
      const response = await fetch(`/api/user/update-user-details/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: currentUser.name,
          surname: currentUser.surname,
          email: currentUser.email,
          companyName: isBusinessUser ? currentUser.companyName : undefined,
          currentPassword: currentUser.currentPassword,
          newPassword: currentUser.newPassword,
          confirmPassword: currentUser.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.message === "User details updated successfully") {
        setUpdateSuccess("Дані успішно оновлені");
        setUpdateError("");
      } else {
        setUpdateError(data.message || "Не вдалося оновити дані");
        setUpdateSuccess("");
      }
    } catch (error) {
      setUpdateError("Не вдалося оновити дані, спробуйте ще раз пізніше");
      setUpdateSuccess("");
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
    const value = event.target.value;
    if (!currentUser) return;

    // Update password-related fields separately
    const updatedUser = {
      ...currentUser,
      [fieldName]: value,
    };

    // Update the state with the new user object
    setCurrentUser(updatedUser);
  };

  // Function to toggle favorite status
  const toggleFavorite = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent click from propagating to the parent NavLink

    const url = "/api/business/favorites";
    const method = isFavorite ? "DELETE" : "POST";
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessUserId: user.id,
          candidateId: candidate.candidateId,
        }),
      });
  
      // Check if response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.success) {
        setIsFavorite(!isFavorite);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to update favorite status:", error);
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
          {propUser?.id && (
            <ul className="small-menu">
              <li
                className={isProfileTab ? "selected-item" : ""}
                onClick={() => (isBusinessUser ? setIsProfileTab(false) : setIsProfileTab(true))}
              >
                Мій профіль
              </li>
              <li className={!isProfileTab ? "selected-item" : ""} onClick={() => setIsProfileTab(false)}>
                Редагувати дані
              </li>
            </ul>
          )}
          {isProfileTab && !isBusinessUser && candidate && (
            <>
              <div className="favorite-profile">
                {isFavorite ? (
                  <Heart color={"#6a49fa"} onClick={toggleFavorite} height="25px" width="25px" />
                ) : (
                  <HeartOutline color={"#6a49fa"} onClick={toggleFavorite} height="25px" width="25px" />
                )}
              </div>
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
              <div className="edit-inputs">
                <FormControl required={true}>
                  <FormLabel id="demo-radio-buttons-group-label" color="secondary">
                    Моя роль
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-required
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={currentUser?.role || "candidate"}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel
                      value="candidate"
                      control={<Radio color="secondary" />}
                      label="Кандидат"
                      disabled
                    />
                    <FormControlLabel
                      value="business"
                      control={<Radio color="secondary" />}
                      label="Роботодавець"
                      disabled
                    />
                  </RadioGroup>
                </FormControl>

                <FormControlTextField
                  id="name"
                  label="Ім'я"
                  variant="outlined"
                  helperText="Введіть ваше ім'я"
                  name="name"
                  isRequired={true}
                  value={currentUser?.name || ""}
                  onChange={(e) => handleUserChange(e, "name")}
                />

                <FormControlTextField
                  id="surname"
                  label="Прізвище"
                  variant="outlined"
                  helperText="Введіть ваше прізвище"
                  name="surname"
                  isRequired={true}
                  value={currentUser?.surname || ""}
                  onChange={(e) => handleUserChange(e, "surname")}
                />
                <FormControlTextField
                  id="email"
                  label="Електронна пошта"
                  variant="outlined"
                  helperText="Введіть електронну пошту"
                  name="email"
                  isRequired={true}
                  value={currentUser?.email || ""}
                  onChange={(e) => handleUserChange(e, "email")}
                />

                {isBusinessUser && (
                  <FormControlTextField
                    id="company-name"
                    label="Назва компанії"
                    variant="outlined"
                    helperText="Введіть назву компанії"
                    name="companyName"
                    isRequired={true}
                    value={currentUser?.companyName || ""}
                    onChange={(e) => handleUserChange(e, "companyName")}
                  />
                )}

                {updateError && <div className="error-message">{updateError}</div>}
                {updateSuccess && <div className="success-message">{updateSuccess}</div>}

                <button type="button" onClick={handleUpdateSubmit} className="form-button">
                  Зберегти зміни
                  <CheckmarkOutline color={"#00000"} title={"submit"} height="25px" width="25px" />
                </button>
              </div>

              <div className="edit-password">
                <button type="button" onClick={() => setIsChangePassword(!isChangePassword)} className="form-button">
                  Змінити пароль
                  {!isChangePassword ? (
                    <LockClosedOutline color={"#00000"} title={"forward"} height="25px" width="25px" />
                  ) : (
                    <LockOpenOutline color={"#00000"} title={"forward"} height="25px" width="25px" />
                  )}
                </button>

                {isChangePassword && (
                  <>
                    <FormControlTextField
                      id="current-password"
                      label="Поточний пароль"
                      variant="outlined"
                      helperText="Введіть поточний пароль"
                      name="current-password"
                      isRequired={true}
                      type="password"
                      value={currentUser.currentPassword}
                      onChange={(e) => handlePasswordChange(e, "currentPassword")}
                    />

                    <FormControlTextField
                      id="new-password"
                      label="Новий пароль"
                      variant="outlined"
                      helperText="Введіть новий пароль"
                      name="new-password"
                      isRequired={true}
                      type="password"
                      value={currentUser.newPassword}
                      onChange={(e) => handlePasswordChange(e, "newPassword")}
                    />

                    <FormControlTextField
                      id="confirm-password"
                      label="Підтвердіть пароль"
                      variant="outlined"
                      helperText="Введіть пароль ще раз"
                      name="confirm-password"
                      isRequired={true}
                      type="password"
                      value={currentUser.confirmPassword}
                      onChange={(e) => handlePasswordChange(e, "confirmPassword")}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default CandidateProfilePage;
