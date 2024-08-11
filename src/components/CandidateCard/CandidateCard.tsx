import React, { useEffect, useState } from "react";
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
  getPosition,
  getWorkArea,
  getWorkExperience,
  getTechAndToolsNames,
} from "../../helpers/getMetaDataValue.tsx";
import { HeartOutline, Heart } from "react-ionicons";
import { useAuth } from "../../auth/AuthWrapper.tsx"; // Import useAuth hook

export interface CandidateCardProps {
  candidate: Candidate;
  metaData: Response;
  isFavorite: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, metaData, isFavorite: initialFavorite }) => {
  const { user } = useAuth(); // Use login and register functions from AuthContext
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const mobileNumber = "tel:" + candidate.candidateMobNumber;
  const email = "mailto:" + candidate.candidateEmail;

  const englishLevel = getEnglishLevel(candidate, metaData);
  const position = getPosition(candidate, metaData);
  const workExperience = getWorkExperience(candidate, metaData);
  const workArea = getWorkArea(candidate, metaData);

  const techAndToolsNames = getTechAndToolsNames(candidate, metaData);

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
    <div className="result-card">
      <div className="favorite">
        {isFavorite ? (
          <Heart color={"#6a49fa"} onClick={toggleFavorite} height="25px" width="25px" />
        ) : (
          <HeartOutline color={"#6a49fa"} onClick={toggleFavorite} height="25px" width="25px" />
        )}
      </div>
      <NavLink to={`/candidate/${candidate.candidateId}`} className="result-card-link">
        <div className="picture">
          <img
            className="img-fluid"
            src={candidate.candidateProfilePic}
            alt={`${candidate.candidateName} ${candidate.candidateSurname}`}
          />
        </div>
        <div className="result-content">
          <h3 className="name">
            {candidate.candidateName} {candidate.candidateSurname}
          </h3>
          <h4 className="position">{position}</h4>
          <p className="info">
            &#128187; {workArea} / &#128188; {workExperience} / <ReactCountryFlag countryCode="GB" svg />{" "}
            {englishLevel}
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
