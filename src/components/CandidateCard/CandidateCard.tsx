import React from "react";
import { NavLink } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import { education } from "../../helpers/educationOptionsList";
import { englishLevels } from "../../helpers/englishLevelsList";
import { positions } from "../../helpers/positionOptionsList";
import { workExps } from "../../helpers/workExpOptionsList";
import { workAreas } from "../../helpers/workAreaOptionsList";
import { salaries } from "../../helpers/salaryOptionsList";
import { workplaces } from "../../helpers/workplaceOptionsList";
import "./CandidateCard.css";

// interfaces.ts
export interface Candidate {
    id: number;
    name: string;
    surname: string;
    profile_picture: string;
    position_id: number;
    work_area_id: number;
    work_experience_id: number;
    english_level_id: number;
    summary: string;
    technologies_and_tools: string;
    mobile_number: string;
    email: string;
    github: string;
    linkedin: string;
  }
  
  export interface TechAndTool {
    id: number;
    name: string;
  }
  
  export interface CandidateCardProps {
    candidate: Candidate;
    techAndToolsData: TechAndTool[];
  }

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, techAndToolsData }) => {
  const mobileNumber = "tel:" + candidate.mobile_number;
  const email = "mailto:" + candidate.email;
  const englishLevel = englishLevels[candidate.english_level_id - 1].name.split(" - ")[1];

  let techAndToolsIds: number[] = [];
  if (candidate.technologies_and_tools) {
    techAndToolsIds = candidate.technologies_and_tools
      .split(",")
      .filter((el) => el !== "")
      .map(Number);
  }

  const techAndToolsNames = techAndToolsData.filter((item) => techAndToolsIds.includes(item.id));

  const candidateWorkExpId = candidate.work_experience_id - 1;
  let workExp = workExps[candidateWorkExpId].name;
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
      <NavLink to={`/candidate/${candidate.id}`} className="result-card-link">
        <div className="picture">
          <img className="img-fluid" src={candidate.profile_picture} alt={`${candidate.name} ${candidate.surname}`} />
        </div>
        <div className="result-content">
          <h3 className="name">
            {candidate.name} {candidate.surname}
          </h3>
          <h4 className="position">{positions[candidate.position_id - 1].name}</h4>
          <p className="info">
            &#128187; {workAreas[candidate.work_area_id - 1].name} / &#128188; {workExp} /{" "}
            <ReactCountryFlag countryCode="GB" svg /> {englishLevel}
          </p>
        </div>
        <br />
        <p className="result-summary">{candidate.summary}</p>
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
          <a href={candidate.github} className="fa fa-github" aria-hidden="true"></a>
        </li>
        <li>
          <a href={candidate.linkedin} className="fa fa-linkedin" aria-hidden="true"></a>
        </li>
      </ul>
    </div>
  );
};

export default CandidateCard;