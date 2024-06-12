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

interface TechAndToolsOption {
  id: string;
  name: string;
}

interface Region {
  id: string;
  region_name: string;
}

interface Student {
  studentRegion: string;
  studentCity: string;
  studentEducation: string;
  studentTechAndTools: string;
  studentEnglish: string;
  studentPosition: string;
  studentWorkExp: string;
  studentWorkArea: string;
  studentSalary: string;
  studentWorkplace: string;
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

  const [student, setStudent] = useState<Student>({
    studentRegion: "",
    studentCity: "",
    studentEducation: "",
    studentTechAndTools: "",
    studentEnglish: "",
    studentPosition: "",
    studentWorkExp: "",
    studentWorkArea: "",
    studentSalary: "",
    studentWorkplace: "",
  });

  const handleSelect = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setStudent({ ...student, [name]: value });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setStudent({ ...student, [name]: value });
  };

  useEffect(() => {
    fetch("/api/server")
      .then((response) => response.json())
      .then((response) => setResponse(response));
  }, []);

  const techAndToolsOptions: SelectOption[] = response.techAndTools.map((techAndTool) => ({
    value: `${techAndTool.id}`,
    label: `${techAndTool.name}`,
  }));

  console.log(response);

  const goToResults = () => {
    navigate({
      pathname: "/results",
      search: `?${createSearchParams(
        Object.fromEntries(Object.entries(student).filter(([key, value]) => value !== ""))
      )}`,
    });
  };

  const searchCandidates = (e: FormEvent) => {
    e.preventDefault();
    console.log("student", student);
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
                  name="studentPosition"
                  placeholder="Оберіть необхідну посаду"
                  value={student.studentPosition}
                  options={positions}
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Область роботи"
                  name="studentWorkArea"
                  placeholder="Оберіть область роботи"
                  value={student.studentWorkArea}
                  options={workAreas}
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Досвід роботи"
                  name="studentWorkExp"
                  placeholder="Оберіть досвід роботи"
                  value={student.studentWorkExp}
                  options={workExps}
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Технології та інструменти"
                  name="studentTechAndTools"
                  placeholder="Оберіть технології та інструменти"
                  value={student.studentTechAndTools}
                  options={/*techAndToolsOptions*/ []}
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Рівень англійської"
                  name="studentEnglish"
                  placeholder="Оберіть рівень англійської"
                  value={student.studentEnglish}
                  options={englishLevels}
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Рівень освіти"
                  name="studentEducation"
                  placeholder="Оберіть рівень освіти"
                  value={student.studentEducation}
                  options={education}
                  onChange={handleSelect}
                />
              </div>

              <div className="section-title">Додаткові параметри</div>
              <div className="fields">
                <FormControlSelect
                  label="Область"
                  name="studentRegion"
                  placeholder="Оберіть вашу область"
                  value={student.studentRegion}
                  options={response.regions}
                  onChange={handleSelect}
                />

                <div>
                  <TextField
                    sx={{ width: 360 }}
                    id="outlined-basic"
                    label="Місто"
                    variant="outlined"
                    size="small"
                    helperText="Введіть місто"
                    name="studentCity"
                    value={student.studentCity}
                    onChange={handleChange}
                    color="secondary"
                  />
                </div>

                <FormControlSelect
                  label="Місце роботи"
                  name="studentWorkplace"
                  placeholder="Оберіть місце роботи"
                  value={student.studentWorkplace}
                  options={workplaces}
                  onChange={handleSelect}
                />

                <FormControlSelect
                  label="Заробітна плата"
                  name="studentSalary"
                  placeholder="Оберіть заробітну плату ($)"
                  value={student.studentSalary}
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
