import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { education } from "../../helpers/educationOptionsList";
import { englishLevels } from "../../helpers/englishLevelsList";
import { positions } from "../../helpers/positionOptionsList";
import { workExps } from "../../helpers/workExpOptionsList";
import { workAreas } from "../../helpers/workAreaOptionsList";
import { salaries } from "../../helpers/salaryOptionsList";
import { workplaces } from "../../helpers/workplaceOptionsList";
import { SearchOutline } from "react-ionicons";
import "./BusinessPage.css";
import { TextField, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from "@mui/material";
import FormControlSelect from "../../components/FormControlSelect/FormControlSelect";
import FormControlTextField from "../../components/FormControlTextField/FormControlTextFields";

interface TechAndToolsOption {
  id: string;
  name: string;
}

interface Region {
  id: string;
  region_name: string;
}

interface Candidate {
  candidateRegion: string;
  candidateCity: string;
  candidateEducation: string;
  candidateTechAndTools: string;
  candidateEnglish: string;
  candidatePosition: string;
  candidateWorkExp: string;
  candidateWorkArea: string;
  candidateSalary: string;
  candidateWorkplace: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const BusinessPage: React.FC = () => {
  const navigate = useNavigate();

  const [response, setResponse] = useState<{ regions: Region[]; techAndTools: TechAndToolsOption[] }>({
    regions: [],
    techAndTools: [],
  });

  const [candidate, setCandidate] = useState<Candidate>({
    candidateRegion: "",
    candidateCity: "",
    candidateEducation: "",
    candidateTechAndTools: "",
    candidateEnglish: "",
    candidatePosition: "",
    candidateWorkExp: "",
    candidateWorkArea: "",
    candidateSalary: "",
    candidateWorkplace: "",
  });

  const handleSelect = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  useEffect(() => {
    fetch("/api/get-meta-data")
      .then((response) => response.json())
      .then((response) => setResponse(response));
  }, []);

  const techAndToolsOptions: SelectOption[] = response.techAndTools.map((techAndTool) => ({
    value: `${techAndTool.id}`,
    label: `${techAndTool.name}`,
  }));

  console.log(response.regions);

  const goToResults = () => {
    navigate({
      pathname: "/results",
      search: `?${createSearchParams(
        Object.fromEntries(Object.entries(candidate).filter(([key, value]) => value !== ""))
      )}`,
    });
  };

  const searchCandidates = (e: FormEvent) => {
    e.preventDefault();
    console.log("candidate", candidate);
  };

  return (
    <main className="page">
      <div className="intro">
        <div className="waves">
          <div className="wave -one"></div>
          <div className="wave -two"></div>
        </div>

        <div className="container">
          <header>Пошук кандидатів</header>
          <form action="#" method="post" onSubmit={searchCandidates}>
            <div className="form">
              <div className="section-title">Основні параметри</div>
              <div className="fields">
                <FormControlSelect
                  label="Посада"
                  name="candidatePosition"
                  placeholder="Оберіть необхідну посаду"
                  value={candidate.candidatePosition}
                  options={positions}
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Область роботи"
                  name="candidateWorkArea"
                  placeholder="Оберіть область роботи"
                  value={candidate.candidateWorkArea}
                  options={workAreas}
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Досвід роботи"
                  name="candidateWorkExp"
                  placeholder="Оберіть досвід роботи"
                  value={candidate.candidateWorkExp}
                  options={workExps}
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Технології та інструменти"
                  name="candidateTechAndTools"
                  placeholder="Оберіть технології та інструменти"
                  value={candidate.candidateTechAndTools}
                  options={/*techAndToolsOptions*/ []}
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Рівень англійської"
                  name="candidateEnglish"
                  placeholder="Оберіть рівень англійської"
                  value={candidate.candidateEnglish}
                  options={englishLevels}
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Рівень освіти"
                  name="candidateEducation"
                  placeholder="Оберіть рівень освіти"
                  value={candidate.candidateEducation}
                  options={education}
                  onChange={handleSelect}
                />
              </div>

              <div className="section-title">Додаткові параметри</div>
              <div className="fields">
                <FormControlSelect
                  label="Область"
                  name="candidateRegion"
                  placeholder="Оберіть вашу область"
                  value={candidate.candidateRegion}
                  options={response.regions}
                  onChange={handleSelect}
                />

                <FormControlTextField
                  id="outlined-basic"
                  label="Місто"
                  variant="outlined"
                  helperText="Введіть місто"
                  name="candidateCity"
                  value={candidate.candidateCity}
                  onChange={handleChange}
                />

                <FormControlSelect
                  label="Місце роботи"
                  name="candidateWorkplace"
                  placeholder="Оберіть місце роботи"
                  value={candidate.candidateWorkplace}
                  options={workplaces}
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Заробітна плата"
                  name="candidateSalary"
                  placeholder="Оберіть заробітну плату ($)"
                  value={candidate.candidateSalary}
                  options={salaries}
                  onChange={handleSelect}
                />
              </div>

              <div className="button-container">
                <button className="sumbit" type="submit" onClick={goToResults}>
                  Знайти
                  <SearchOutline width="20px" height="20px" color={"000000"} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default BusinessPage;
