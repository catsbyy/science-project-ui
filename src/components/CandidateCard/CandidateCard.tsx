import React from "react";
import { NavLink } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import "./CandidateCard.css";
/* types */
import { Response } from "../../types/Response";
import { Option } from "../../types/Option";
import { Candidate } from "../../types/Candidate.ts";

  
  export interface CandidateCardProps {
    candidate: Candidate;
    metaData: Response;
  }

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, metaData }) => {
  console.log("candidate" + candidate);
  const mobileNumber = "tel:" + candidate.candidateMobNumber;
  const email = "mailto:" + candidate.candidateEmail;
  const englishIndex = Number(candidate.candidateEnglish) - 1;
  const englishLevel = metaData.english[englishIndex] ? metaData.english[englishIndex].english_level.split(" - ")[1] : "Unknown";
  //.split(" - ")[1];

  const positionIndex = Number(candidate.candidatePosition) - 1;
  const position = metaData.position[positionIndex] ? metaData.position[positionIndex].position : "Unknown";

  const workExpIndex = Number(candidate.candidateWorkExp) - 1;
  const workExperience = metaData.workExp[workExpIndex] ? metaData.workExp[workExpIndex].work_experience : "Unknown";

  const workAreaIndex = Number(candidate.candidateWorkArea) - 1;
  const workArea = metaData.workArea[workAreaIndex] ? metaData.workArea[workAreaIndex].work_area : "Unknown";

  const candidateTechAndTools = Array.isArray(candidate.candidateTechAndTools) ? candidate.candidateTechAndTools : [];
  const techAndToolsNames = metaData.techAndTools.filter((item) => candidateTechAndTools.includes(item.id));

  const candidateWorkExpId = Number(candidate.candidateWorkExp) - 1;
  let workExp = workExperience;
  switch (candidateWorkExpId) {
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
            &#128187; {workArea} / &#128188; {workExp} /{" "}
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