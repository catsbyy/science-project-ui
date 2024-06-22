import React from "react";
import { NavLink } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import "./CandidateCard.css";
/* types */
import { Response } from "../../types/Response";
import { Option } from "../../types/Option";
import { Candidate } from "../../types/Candidate.ts";
import {
  getMetaDataValue,
  getEnglishLevel,
  getEducationLevel,
  getWorkplace,
  getSalary,
  getBirthday,
  getRegion,
  getWorkExperience,
  getTechAndToolsNames,
} from "../../helpers/getMetaDataValue.tsx";

  
  export interface CandidateCardProps {
    candidate: Candidate;
    metaData: Response;
  }

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, metaData }) => {
  const mobileNumber = "tel:" + candidate.candidateMobNumber;
  const email = "mailto:" + candidate.candidateEmail;

  const englishLevel = getEnglishLevel(candidate, metaData);
  const position = getMetaDataValue(candidate, metaData, "candidatePosition", "position");
  const workExperience = getWorkExperience(candidate, metaData);
  const workArea = getMetaDataValue(candidate, metaData, "candidateWorkArea", "workArea");

  const techAndToolsNames = getTechAndToolsNames(candidate, metaData);
  
  return (
    <div className="result-card">
      <NavLink to={`/candidate/${candidate.candidateId}`} className="result-card-link">
        <div className="picture">
          <img className="img-fluid" src={candidate.candidateProfilePic} alt={`${candidate.candidateName} ${candidate.candidateSurname}`} />
        </div>
        <div className="result-content">
          <h3 className="name">
            {candidate.candidateName} {candidate.candidateSurname}
          </h3>
          <h4 className="position">{position}</h4>
          <p className="info">
            &#128187; {workArea} / &#128188; {workExperience} /{" "}
            <ReactCountryFlag countryCode="GB" svg /> {englishLevel}
          </p>
        </div>
        <br />
        <p className="result-summary">{candidate.candidateSummary}</p>
        <ul className="skills-section">
          {techAndToolsNames.map((techAndTool) => (
            <li key={techAndTool.id}>{techAndTool.name}</li>
          ))}
        </ul>
      </NavLink>
      <ul className="result-social">
        <li>
          <a href={mobileNumber} className="fa fa-phone" aria-hidden="true"></a>
        </li>
        <li>
          <a href={email} className="fa fa-envelope" aria-hidden="true"></a>
        </li>
        <li>
          <a href={candidate.candidateGithub} className="fa fa-github" aria-hidden="true"></a>
        </li>
        <li>
          <a href={candidate.candidateLinkedin} className="fa fa-linkedin" aria-hidden="true"></a>
        </li>
      </ul>
    </div>
  );
};

export default CandidateCard;