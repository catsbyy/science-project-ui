import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import Select, { MultiValue, ActionMeta } from "react-select";
import { education } from "../../helpers/educationOptionsList";
import { englishLevels } from "../../helpers/englishLevelsList";
import { positions } from "../../helpers/positionOptionsList";
import { workExps } from "../../helpers/workExpOptionsList";
import { workAreas } from "../../helpers/workAreaOptionsList";
import { salaries } from "../../helpers/salaryOptionsList";
import { workplaces } from "../../helpers/workplaceOptionsList";
import { SearchOutline } from "react-ionicons";
import "./BusinessPage.css";

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
  /*
   */
  const navigate = useNavigate();

  const [selectedTechAndToolsOptions, setSelectedTechAndToolsOptions] = useState<MultiValue<SelectOption>>([]);
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

  const handleChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setStudent({ ...student, [event.target.name]: event.target.value });
  };

  const handleSelect = (data: MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => {
    setSelectedTechAndToolsOptions(data);
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
    let technologies = "";

    if (selectedTechAndToolsOptions.length > 0) {
      selectedTechAndToolsOptions.forEach((item) => {
        technologies += `${item.value};`;
      });
    }

    student.studentTechAndTools = technologies;

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
    <div className="page">
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
                <div className="input-field">
                  <label>Посада</label>
                  <select name="studentPosition" required onChange={handleChange} defaultValue={0}>
                    <option disabled value={0}>
                      Оберіть необхідну посаду
                    </option>
                    {positions.map((position) => (
                      <option key={position.id} value={position.id}>
                        {position.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-field">
                  <label>Область роботи</label>
                  <select name="studentWorkArea" required onChange={handleChange} defaultValue={0}>
                    <option disabled value={0}>
                      Оберіть область роботи
                    </option>
                    {workAreas.map((workArea) => (
                      <option key={workArea.id} value={workArea.id}>
                        {workArea.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-field">
                  <label>Досвід роботи</label>
                  <select name="studentWorkExp" required onChange={handleChange} defaultValue={0}>
                    <option disabled value={0}>
                      Оберіть досвід роботи
                    </option>
                    {workExps.map((workExp) => (
                      <option key={workExp.id} value={workExp.id}>
                        {workExp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-field">
                  <label>Технології та інструменти</label>
                  <Select
                    options={techAndToolsOptions}
                    placeholder="Оберіть технології та інструменти"
                    value={selectedTechAndToolsOptions}
                    onChange={handleSelect}
                    isMulti
                    isSearchable
                    className="select"
                  />
                </div>

                <div className="input-field">
                  <label>Рівень англійської</label>
                  <select name="studentEnglish" required onChange={handleChange} defaultValue={0}>
                    <option disabled value={0}>
                      Оберіть рівень англійської
                    </option>
                    {englishLevels.map((englishLevel) => (
                      <option key={englishLevel.id} value={englishLevel.id}>
                        {englishLevel.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-field">
                  <label>Рівень освіти</label>
                  <select name="studentEducation" required onChange={handleChange} defaultValue={0}>
                    <option disabled value={0}>
                      Оберіть рівень освіти
                    </option>
                    {education.map((edu) => (
                      <option key={edu.id} value={edu.id}>
                        {edu.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="section-title">Додаткові параметри</div>
              <div className="fields">
                <div className="input-field">
                  <label>Область</label>
                  <select name="studentRegion" required onChange={handleChange} defaultValue={0}>
                    <option disabled value={0}>
                      Оберіть вашу область
                    </option>
                    {response.regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.region_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-field">
                  <label>Місто</label>
                  <input type="text" name="studentCity" placeholder="Введіть місто" required onChange={handleChange} />
                </div>

                <div className="input-field">
                  <label>Місце роботи</label>
                  <select name="studentWorkplace" required onChange={handleChange} defaultValue={0}>
                    <option disabled value={0}>
                      Оберіть місце роботи
                    </option>
                    {workplaces.map((workplace) => (
                      <option key={workplace.id} value={workplace.id}>
                        {workplace.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-field">
                  <label>Заробітна плата</label>
                  <select name="studentSalary" required onChange={handleChange} defaultValue={0}>
                    <option disabled value={0}>
                      Оберіть заробітну плату ($)
                    </option>
                    {salaries.map((salary) => (
                      <option key={salary.id} value={salary.id}>
                        {salary.name}
                      </option>
                    ))}
                  </select>
                </div>
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
    </div>
  );

  /*
  return (
    <div className="home-page">
      <div className="intro">
        <div className="waves">
          <div className="wave -one"></div>
          <div className="wave -two"></div>
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required></textarea>
            </div>
            <div className="form-field">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  */
};

export default BusinessPage;
