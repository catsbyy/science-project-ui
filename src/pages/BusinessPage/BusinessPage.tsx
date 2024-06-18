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
import { TextField, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent, Autocomplete } from "@mui/material";
import FormControlSelect from "../../components/FormControlSelect/FormControlSelect";
import FormControlTextField from "../../components/FormControlTextField/FormControlTextFields";
/* types */
import { Response } from "../../types/Response";
import { Option } from "../../types/Option";
import { BusinessCandidate } from "../../types/BusinessCandidate.ts";

const BusinessPage: React.FC = () => {
  const navigate = useNavigate();

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

  const [candidate, setCandidate] = useState<BusinessCandidate>({
    candidateRegion: "",
    candidateCity: "",
    candidateEducation: "",
    candidateTechAndTools: [] as number[],
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

  const handleTechAndToolsChange = (event: any, newValue: Option[]) => {
    const ids = newValue.map((option) => option.id);
    setCandidate({ ...candidate, candidateTechAndTools: ids });
  };

  useEffect(() => {
    fetch("/api/get-meta-data")
      .then((response) => response.json())
      .then((response) => setResponse(response));
  }, []);

  const techAndToolsOptions: Option[] = response.techAndTools
    ? response.techAndTools.map((techAndTool) => ({
        id: techAndTool.id,
        name: techAndTool.name,
      }))
    : [];

  console.log(response.regions);

  const goToResults = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Filter out properties with empty values
    const queryParams: Record<string, string | string[]> = Object.fromEntries(
      Object.entries(candidate).filter(([key, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0; // Filter out empty arrays
        }
        return value !== ""; // Filter out empty strings
      })
    );
  
    // Convert candidateTechAndTools to comma-separated string
    if (queryParams.candidateTechAndTools) {
      queryParams.candidateTechAndTools = queryParams.candidateTechAndTools.join(";");
    }
  
    const searchParams = new URLSearchParams(queryParams).toString();
  
    navigate(`/results?${searchParams}`);
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
                  options={response.position}
                  displayKey="position"
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Область роботи"
                  name="candidateWorkArea"
                  placeholder="Оберіть область роботи"
                  value={candidate.candidateWorkArea}
                  options={response.workArea}
                  displayKey="work_area"
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Досвід роботи"
                  name="candidateWorkExp"
                  placeholder="Оберіть досвід роботи"
                  value={candidate.candidateWorkExp}
                  options={response.workExp}
                  displayKey="work_experience"
                  onChange={handleSelect}
                />

                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={techAndToolsOptions}
                  getOptionLabel={(option) => option.name}
                  value={techAndToolsOptions.filter((option) => candidate.candidateTechAndTools.includes(option.id))}
                  onChange={handleTechAndToolsChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ width: 360 }}
                      label="Технології та інструменти"
                      helperText="Оберіть технології та інструменти"
                      color="secondary"
                      size="small"
                    />
                  )}
                />

                <FormControlSelect
                  label="Рівень англійської"
                  name="candidateEnglish"
                  placeholder="Оберіть рівень англійської"
                  value={candidate.candidateEnglish}
                  options={response.english}
                  displayKey="english_level"
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Рівень освіти"
                  name="candidateEducation"
                  placeholder="Оберіть рівень освіти"
                  value={candidate.candidateEducation}
                  options={response.education}
                  displayKey="education_level"
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
                  displayKey="region_name"
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
                  options={response.workplace}
                  displayKey="workplace"
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Заробітна плата"
                  name="candidateSalary"
                  placeholder="Оберіть заробітну плату ($)"
                  value={candidate.candidateSalary}
                  options={response.salary}
                  displayKey="salary"
                  onChange={handleSelect}
                />
              </div>

              <div className="button-container">
                <button className="sumbit form-button" type="submit" onClick={goToResults}>
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
