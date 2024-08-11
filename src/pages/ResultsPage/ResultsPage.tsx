import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CandidateCard from "../../components/CandidateCard/CandidateCard";
import "./ResultsPage.css";
import { mapApiResponseToCandidate } from "../../helpers/mapApiResponseToCandidate.tsx";
/* types */
import { Response } from "../../types/Response";
import { Option } from "../../types/Option";
import { Candidate } from "../../types/Candidate.ts";
import { useAuth } from "../../auth/AuthWrapper.tsx"; // Import useAuth hook

interface Props {}

const Results: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchParams] = useSearchParams();
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

  const [favorites, setFavorites] = useState([]);
  
  const { user } = useAuth(); // Use login and register functions from AuthContext

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `/api/business/get-results?` + new URLSearchParams(Object.fromEntries([...searchParams])).toString()
        );
        const data = await response.json();
        const mappedCandidates = data.candidates.map(mapApiResponseToCandidate);
        setCandidates(mappedCandidates);
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
      }
    };

    const fetchMetaData = async () => {
      try {
        const response = await fetch("/api/get-meta-data");
        const data : Response = await response.json();
        setResponse(data);
      } catch (error) {
        console.error("Failed to fetch tech and tools:", error);
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

    fetchResults();
    fetchMetaData();
    fetchFavoriteStatus();
  }, [searchParams]);

  return (
    <main className="page">
      <div className="intro">
        <div className="waves">
          <div className="wave -one"></div>
          <div className="wave -two"></div>
        </div>
      </div>
      <div className="results-section">
        <h2 className="landing-title">Рекомендовані кандидати</h2>
        <ul className="result-candidates">
        {candidates.map((candidate) => {
            const isFavorite = favorites.some(fav => fav.candidate_id === candidate.candidateId);
            return (
              <CandidateCard
                key={candidate.candidateId}
                candidate={candidate}
                metaData={response}
                isFavorite={isFavorite} 
              />
            );
          })}
        </ul>
      </div>
    </main>
  );
};

export default Results;
