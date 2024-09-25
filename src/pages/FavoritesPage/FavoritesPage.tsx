import { useEffect, useState } from "react";
import "./FavoritesPage.css";
import { useAuth } from "../../auth/AuthWrapper.tsx"; // Import useAuth hook
import { Response } from "../../types/Response";
import { Candidate } from "../../types/Candidate.ts";
import { mapApiResponseToCandidate } from "../../helpers/mapApiResponseToCandidate.tsx";
import CandidateCard from "../../components/CandidateCard/CandidateCard.tsx";

interface Props {}

function FavoritesPage({}: Props) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [favorites, setFavorites] = useState([]);
  
  const { user } = useAuth(); // Use login and register functions from AuthContext

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
    const fetchFavorites = async () => {
      const url = `/api/business/favorites/${user.id}?fetchAllDetails=true`;
  
      try {
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json(); 
  
        if (data.success) {
          console.log("Raw candidates data:", data.candidates);
          const mappedCandidates = data.candidates.map(mapApiResponseToCandidate);
          console.log("Mapped candidates:", mappedCandidates);
          setCandidates(mappedCandidates);
          setFavorites(data.favorites);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(`Failed to fetch favorites: ${error}`);
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
  
    fetchMetaData();
    fetchFavorites();
  }, [user.id]);

  useEffect(() => {
    console.log("Candidates updated:", candidates);
  }, [candidates]);

  return (
    <main className="page">
      <div className="intro">
        <div className="waves">
          <div className="wave -one"></div>
          <div className="wave -two"></div>
        </div>

        <div className="results-section">
          <h2 className="landing-title">Обрані кандидати</h2>
          <ul className="result-candidates">
            {candidates.map((candidate) => {
              const isFavorite = favorites.some((fav) => fav.candidate_id === candidate.candidateId);
              return (
                <CandidateCard
                  key={candidate.candidateId}
                  candidate={candidate}
                  metaData={response}
                  isFavorite={isFavorite}
                />
              );
            }) }
          </ul>
        </div>
      </div>
    </main>
  );
}

export default FavoritesPage;
