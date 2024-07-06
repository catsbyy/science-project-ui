import React, { useState, useEffect } from "react";
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

interface CandidateProfilePageProps {
  userId?: number | null;
}

const CandidateProfilePage: React.FC<CandidateProfilePageProps> = ({ userId }) => {
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

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const response = await fetch(`/api/business/get-candidate-details/${userId || id}${userId ? "/true" : ""}`);
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
  }, [userId, id]);

  if (!candidate || !response) {
    return <div>Loading...</div>;
  }

  const englishLevel = getEnglishLevel(candidate, response);
  const position = getPosition(candidate, response);
  const workExperience = getWorkExperience(candidate, response);
  const workArea = getWorkArea(candidate, response);
  const educationLevel = getEducationLevel(candidate, response);
  const workplace = getWorkplace(candidate, response);
  const salary = getSalary(candidate, response);
  const birthday = getBirthday(candidate);
  const region = getRegion(candidate, response);

  const techAndToolsNames = getTechAndToolsNames(candidate, response);
  console.log(techAndToolsNames);

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
        </div>
      </div>
    </main>
  );
};

export default CandidateProfilePage;
