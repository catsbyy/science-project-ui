import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import moment from "moment/moment";
import { education } from "../../helpers/educationOptionsList";
import { englishLevels } from "../../helpers/englishLevelsList";
import { positions } from "../../helpers/positionOptionsList";
import { workExps } from "../../helpers/workExpOptionsList";
import { workAreas } from "../../helpers/workAreaOptionsList";
import { salaries } from "../../helpers/salaryOptionsList";
import { workplaces } from "../../helpers/workplaceOptionsList";
import { LogoLinkedin } from "react-ionicons";
import { LogoGithub } from "react-ionicons";
import { LocationOutline, MailOutline, PhonePortraitOutline, CalendarOutline } from "react-ionicons";
import "./CandidateProfilePage.css";

interface Candidate {
  id: number;
  name: string;
  surname: string;
  profile_picture: string;
  date_of_birth: string;
  city: string;
  region_id: number;
  english_level_id: number;
  education_level_id: number;
  position_id: number;
  work_area_id: number;
  work_experience_id: number;
  salary_id: number;
  summary: string;
  university: string;
  specialty: string;
  technologies_and_tools: string;
  email: string;
  mobile_number: string;
  linkedin: string;
  github: string;
  workplace_id: number;
}

interface ResponseData {
  regions: { id: number; region_name: string }[];
  techAndTools: { id: number; name: string }[];
}

const CandidateProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [response, setResponse] = useState<ResponseData | null>(null);

  useEffect(() => {
    fetch(`/api/business/get-candidate-details/${id}`)
      .then((response) => response.json())
      .then((data) => setCandidate(data.candidate[0]));

    fetch("/api/get-meta-data")
      .then((response) => response.json())
      .then((data) => setResponse(data));
  }, [id]);

  if (!candidate || !response) {
    return <div>Loading...</div>;
  }

  const regions = response?.regions || [];
  const techAndTools = response?.techAndTools || [];

  const englishLevel = englishLevels[candidate.english_level_id - 1]?.name;
  const educationLevel = education[candidate.education_level_id - 1]?.name;
  const position = positions[candidate.position_id - 1]?.name;
  const workArea = workAreas[candidate.work_area_id - 1]?.name;
  const workplace = workplaces[candidate.workplace_id - 1]?.name;
  const salary = salaries[candidate.salary_id - 1]?.name;

  const dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  const birthday = new Date(candidate.date_of_birth).toLocaleDateString("ukr-UA", dateOptions).slice(0, -3);
  const region = regions[candidate.region_id - 1]?.region_name + " область";

  let techAndToolsIds: number[] = [];
  if (candidate.technologies_and_tools) {
    techAndToolsIds = candidate.technologies_and_tools
      .split(",")
      .filter((el) => el !== "")
      .map(Number);
  }

  const techAndToolsNames = techAndTools.filter((item) => techAndToolsIds.includes(item.id));

  const studentWorkExpId = candidate.work_experience_id - 1;

  let workExp = workExps[studentWorkExpId]?.name;
  switch (studentWorkExpId) {
    case 0:
      workExp = "без досвіду";
      break;
    case 1:
    case 3:
      workExp += " року";
      break;
    case 2:
      workExp += " рік";
      break;
    case 4:
    case 5:
      workExp += " роки";
      break;
    case 6:
      workExp += " років";
      break;
    default:
      break;
  }

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
          <div className="profile-contacts">
            <div className="profile-contacts-bg"></div>

            <div className="profile-picture-wrapper">
              <img className="profile-picture" alt="" src={candidate.profile_picture} />
            </div>

            <div className="profile-name">{candidate.name + " " + candidate.surname}</div>

            <div className="profile-contacts-details-wrapper">
              <div className="profile-contacts-details-div">
                <CalendarOutline color={"#fff"} title={"birthday"} height="24px" width="24px" />
                <p className="profile-contacts-details">{birthday}</p>
              </div>

              <div className="profile-contacts-details-div">
                <LocationOutline color={"#fff"} title={"location"} height="24px" width="24px" />
                <div>
                  <p className="profile-contacts-details">{candidate.city},</p>
                  <p className="profile-contacts-details">{region}</p>
                </div>
              </div>

              <div className="profile-contacts-details-div">
                <MailOutline color={"#fff"} title={"mail"} height="24px" width="24px" />
                <p className="profile-contacts-details">{candidate.email}</p>
              </div>

              <div className="profile-contacts-details-div">
                <PhonePortraitOutline color={"#fff"} title={"phone"} height="24px" width="24px" />
                <p className="profile-contacts-details">{candidate.mobile_number}</p>
              </div>

              <div className="profile-contacts-details-buttons">
                {candidate.linkedin && (
                  <a href={candidate.linkedin}>
                    <LogoLinkedin height="30px" width="30px" color={"#fff"}></LogoLinkedin>
                  </a>
                )}
                {candidate.github && (
                  <a href={candidate.github}>
                    <LogoGithub height="30px" width="30px" color={"#fff"}></LogoGithub>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="profile-first-section">
            <div className="profile-summary">
              <b className="profile-title">Про себе:</b>
              <div className="profile-details">{candidate.summary}</div>
            </div>
            <div className="profile-education">
              <b className="profile-title">Освіта: </b>
              <b className="profile-details">{educationLevel}</b>
            </div>
            <div className="profile-unversity">
              <b className="profile-title">Заклад освіти:</b>
              <div className="profile-details">{candidate.university}</div>
            </div>
            <div className="profile-specialty">
              <b className="profile-title">Спеціальність: </b>
              <div className="profile-details">{candidate.specialty}</div>
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
              <b className="profile-details">{workExp}</b>
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
        </div>
      </div>
    </main>
  );
};

export default CandidateProfilePage;
