import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CandidateCard from "../../components/CandidateCard/CandidateCard";
import "./ResultsPage.css";

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

export interface ApiResponse {
  candidates: Candidate[];
  techAndTools: TechAndTool[];
}

interface Props {}

const Results: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [techAndTools, setTechAndTools] = useState<TechAndTool[]>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `api/business/get-results?` + new URLSearchParams(Object.fromEntries([...searchParams])).toString()
        );
        const data: ApiResponse = await response.json();
        setCandidates(data.candidates);
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
      }
    };

    const fetchTechAndTools = async () => {
      try {
        const response = await fetch("api/get-meta-data");
        const data: { techAndTools: TechAndTool[] } = await response.json();
        setTechAndTools(data.techAndTools);
      } catch (error) {
        console.error("Failed to fetch tech and tools:", error);
      }
    };

    fetchResults();
    fetchTechAndTools();
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
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} techAndToolsData={techAndTools} />
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Results;
