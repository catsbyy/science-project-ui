import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CandidateCard from "../../components/CandidateCard/CandidateCard";
import "./ResultsPage.css";
import { mapApiResponseToCandidate } from "../../helpers/mapApiResponseToCandidate.tsx";
/* types */
import { Response } from "../../types/Response";
import { Option } from "../../types/Option";
import { Candidate } from "../../types/Candidate.ts";

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

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `/api/business/get-results?` + new URLSearchParams(Object.fromEntries([...searchParams])).toString()
        );
        const data = await response.json();
        const mappedCandidates = data.candidates.map(mapApiResponseToCandidate);
        setCandidates(mappedCandidates);
        console.log("BLUAT: ", candidates);
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

    fetchResults();
    fetchMetaData();
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
            <CandidateCard key={candidate.candidateId} candidate={candidate} metaData={response} />
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Results;
