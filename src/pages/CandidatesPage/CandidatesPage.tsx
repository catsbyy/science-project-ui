import React, { useState, useEffect, ChangeEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { education } from "../../helpers/educationOptionsList";
import { englishLevels } from "../../helpers/englishLevelsList";
import { positions } from "../../helpers/positionOptionsList";
import { workExps } from "../../helpers/workExpOptionsList";
import { workAreas } from "../../helpers/workAreaOptionsList";
import { salaries } from "../../helpers/salaryOptionsList";
import { workplaces } from "../../helpers/workplaceOptionsList";
import { inputRegex } from "../../helpers/inputRegex";
import { emailRegex } from "../../helpers/emailRegex";
import { linkRegex } from "../../helpers/linkRegex";
import { phoneRegex } from "../../helpers/phoneRegex";
import { TextField, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from "@mui/material";
import FormControlSelect from "../../components/FormControlSelect/FormControlSelect";
import FormControlTextField from "../../components/FormControlTextField/FormControlTextFields";

import { ArrowForwardOutline } from "react-ionicons";
import { ArrowBackOutline } from "react-ionicons";
import { CheckmarkOutline } from 'react-ionicons';

import warning from "../../img/icons/warning.svg";

interface Props {}

interface TechAndToolOption {
  value: string;
  label: string;
}

interface CandidateData {
  candidateSurname: string;
  candidateName: string;
  candidatePatronymic: string;
  candidateDateOfBirth: string;
  candidateMobNumber: string;
  candidateEmail: string;
  candidateRegion: string;
  candidateCity: string;
  candidateStreet: string;
  candidateHouseNum: string;
  candidateLinkedin?: string;
  candidateGithub?: string;
  candidateEducation: string;
  candidateUniversity: string;
  candidateSpecialty?: string;
  candidateTechAndTools?: string;
  candidateEnglish: string;
  candidateSummary?: string;
  candidatePosition: string;
  candidateWorkExp: string;
  candidateWorkArea: string;
  candidateSalary?: string;
  candidateWorkplace?: string;
  candidateProfilePic?: string;
}
interface Option {
  value: string;
  label: string;
}

function CandidatesPage({}: Props) {
  const [response, setResponse] = useState<{ regions: any[]; techAndTools: any[] }>({ regions: [], techAndTools: [] });
  const [selectedTechAndToolsOptions, setSelectedTechAndToolsOptions] = useState<MultiValue<TechAndToolOption>>();
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [isFormInvalid, setIsFormInvalid] = useState(false);

  useEffect(() => {
    fetch("/api/get-meta-data")
      .then((response) => response.json())
      .then((response) => setResponse(response));
  }, []);

  const techAndToolsOptions: TechAndToolOption[] = response.techAndTools.map((techAndTool) => ({
    value: `${techAndTool.id}`,
    label: `${techAndTool.name}`,
  }));

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CandidateData>({ mode: "all" });
/* 
  
  const handleSelect = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };
  */

  const addNewCandidate: SubmitHandler<CandidateData> = (data) => {
    const candidate: CandidateData = {
      ...data,
      candidateTechAndTools: selectedTechAndToolsOptions?.map((option: Option) => option.value).join(";"),
      candidateWorkplace: data.candidateWorkplace || "3",
      candidateProfilePic:
        data.candidateProfilePic ||
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png",
    };

    if (!isDataInvalid(candidate)) {
      fetch("/candidates", {
        method: "POST",
        body: JSON.stringify(candidate),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((e) => {
        console.log(e);
      });
      navigate("/success");
    } else {
      setIsFormInvalid(true);
    }
  };

  const isDataInvalid = (candidate: CandidateData): boolean => {
    const optionalFields = [
      "candidateLinkedin",
      "candidateGithub",
      "candidateSpecialty",
      "candidateSummary",
      "candidateSalary",
      "candidateWorkplace",
      "candidateProfilePic",
    ];

    const textFields = [
      "candidateSurname",
      "candidateName",
      "candidatePatronymic",
      "candidateCity",
      "candidateStreet",
      "candidateHouseNum",
      "candidateEducation",
      "candidateUniversity",
    ];

    let isInvalid = false;

    for (const [key, value] of Object.entries(candidate)) {
      const isValueNotEmpty = value !== "" && value !== null && value !== undefined;

      if (!optionalFields.includes(key)) {
        if (isValueNotEmpty) {
          if (textFields.includes(key)) {
            if (!inputRegex.test(value)) {
              isInvalid = true;
            }
          } else if (key === "candidateDateOfBirth") {
            if (new Date(value) >= new Date()) {
              isInvalid = true;
            }
          } else if (key === "candidateMobNumber") {
            if (!phoneRegex.test(value)) {
              isInvalid = true;
            }
          } else if (key === "candidateEmail") {
            if (!emailRegex.test(value)) {
              isInvalid = true;
            }
          }
        } else {
          isInvalid = true;
        }
      } else {
        if (isValueNotEmpty && ["candidateLinkedin", "candidateGithub", "candidateProfilePic"].includes(key)) {
          if (!linkRegex.test(value)) {
            isInvalid = true;
          }
        } else if (isValueNotEmpty && ["candidateSpecialty", "candidateSummary"].includes(key)) {
          if (!inputRegex.test(value)) {
            isInvalid = true;
          }
        }
      }
    }

    return isInvalid;
  };

  return (
    <main className="page">
      <div className="intro">
        <div className="waves">
          <div className="wave -one"></div>
          <div className="wave -two"></div>
        </div>
        <div className="container">
          <header>Анкета кандидата</header>

          <form name="registrationForm" method="post" onSubmit={handleSubmit(addNewCandidate)}>
            {page === 0 && (
              <div className="form first">
                <div className="details personal">
                  <span className="title">Персональні дані</span>

                  <div className="fields">
                    
                    <div className="input-field">
                      <label className={errors?.candidateSurname ? "input-label-invalid" : "input-label"}>
                        Прізвище *
                      </label>
                      <input
                        {...register("candidateSurname", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.candidateSurname ? "input-field-invalid" : ""}
                        name="candidateSurname"
                        type="text"
                        placeholder="Введіть ваше прізвище"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.candidateName ? "input-label-invalid" : "input-label"}>Ім'я *</label>
                      <input
                        {...register("candidateName", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.candidateName ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть ваше ім'я"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.candidatePatronymic ? "input-label-invalid" : "input-label"}>
                        По-батькові *
                      </label>
                      <input
                        {...register("candidatePatronymic", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.candidatePatronymic ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть ваше по-батькові"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.candidateDateOfBirth ? "input-label-invalid" : "input-label"}>
                        Дата народження *
                      </label>
                      <input
                        {...register("candidateDateOfBirth", {
                          required: true,
                          validate: (dateValue) => new Date(dateValue) < new Date(),
                        })}
                        className={errors?.candidateDateOfBirth ? "input-field-invalid" : ""}
                        type="date"
                        placeholder="Enter birth date"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.candidateMobNumber ? "input-label-invalid" : "input-label"}>
                        Мобільний номер *
                      </label>
                      <input
                        {...register("candidateMobNumber", {
                          required: true,
                          pattern: phoneRegex,
                        })}
                        className={errors?.candidateMobNumber ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть мобільний номер"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.candidateEmail ? "input-label-invalid" : "input-label"}>
                        Електронна пошта *
                      </label>
                      <input
                        {...register("candidateEmail", {
                          required: true,
                          pattern: emailRegex,
                        })}
                        className={errors?.candidateEmail ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть електронну пошту"
                      />
                    </div>
                  </div>
                </div>

                <div className="details ID">
                  <span className="title">Адреса проживання</span>

                  <div className="fields">
                    <div className="input-field">
                      <label className={errors?.candidateRegion ? "input-label-invalid" : "input-label"}>Область *</label>
                      <select
                        {...register("candidateRegion", {
                          required: true,
                        })}
                        className={errors?.candidateRegion ? "input-field-invalid" : ""}
                      >
                        <option disabled selected value="">
                          Область
                        </option>
                        {response.regions?.map((region) => (
                          <option key={region.id} value={region.name}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-field">
                      <label className={errors?.candidateCity ? "input-label-invalid" : "input-label"}>Місто *</label>
                      <input
                        {...register("candidateCity", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.candidateCity ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть ваше місто"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.candidateStreet ? "input-label-invalid" : "input-label"}>Вулиця *</label>
                      <input
                        {...register("candidateStreet", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.candidateStreet ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть вашу вулицю"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.candidateHouseNum ? "input-label-invalid" : "input-label"}>
                        Номер будинку *
                      </label>
                      <input
                        {...register("candidateHouseNum", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.candidateHouseNum ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть номер будинку"
                      />
                    </div>

                    <div className="input-field">
                      <label className="input-label">Номер квартири</label>
                      <input {...register("candidateHouseNum")} type="text" placeholder="Введіть номер квартири" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {page === 1 && (
              <div className="form second">
                <div className="details education">
                  <span className="title">Освіта</span>

                  <div className="fields">
                    <div className="input-field">
                      <label className={errors?.candidateEducation ? "input-label-invalid" : "input-label"}>
                        Освіта *
                      </label>
                      <select
                        {...register("candidateEducation", {
                          required: true,
                        })}
                        className={errors?.candidateEducation ? "input-field-invalid" : ""}
                      >
                        <option disabled selected value="">
                          Освіта
                        </option>
                        {education?.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-field">
                      <label className={errors?.candidateUniversity ? "input-label-invalid" : "input-label"}>
                        Навчальний заклад *
                      </label>
                      <input
                        {...register("candidateUniversity", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.candidateUniversity ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть ваш навчальний заклад"
                      />
                    </div>

                    <div className="input-field">
                      <label className="input-label">Спеціальність</label>
                      <input {...register("candidateSpecialty")} type="text" placeholder="Введіть вашу спеціальність" />
                    </div>

                    <div className="input-field">
                      <label className={errors?.candidateEnglish ? "input-label-invalid" : "input-label"}>
                        Рівень англійської *
                      </label>
                      <select
                        {...register("candidateEnglish", {
                          required: true,
                        })}
                        className={errors?.candidateEnglish ? "input-field-invalid" : ""}
                      >
                        <option disabled selected value="">
                          Рівень англійської
                        </option>
                        {englishLevels?.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-field">
                      <label className="input-label">Коротка біографія</label>
                      <textarea {...register("candidateSummary")} placeholder="Розкажіть про себе"></textarea>
                    </div>
                  </div>
                </div>

                <div className="details more">
                  <span className="title">Деталі</span>

                  <div className="fields">
                    <div className="input-field">
                      <label className={errors?.candidatePosition ? "input-label-invalid" : "input-label"}>
                        Посада *
                      </label>
                      <select
                        {...register("candidatePosition", {
                          required: true,
                        })}
                        className={errors?.candidatePosition ? "input-field-invalid" : ""}
                      >
                        <option disabled selected value="">
                          Посада
                        </option>
                        {positions?.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-field">
                      <label className={errors?.candidateWorkExp ? "input-label-invalid" : "input-label"}>
                        Досвід роботи *
                      </label>
                      <select
                        {...register("candidateWorkExp", {
                          required: true,
                        })}
                        className={errors?.candidateWorkExp ? "input-field-invalid" : ""}
                      >
                        <option disabled selected value="">
                          Досвід роботи
                        </option>
                        {workExps?.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-field">
                      <label className={errors?.candidateWorkArea ? "input-label-invalid" : "input-label"}>
                        Сфера роботи *
                      </label>
                      <select
                        {...register("candidateWorkArea", {
                          required: true,
                        })}
                        className={errors?.candidateWorkArea ? "input-field-invalid" : ""}
                      >
                        <option disabled selected value="">
                          Сфера роботи
                        </option>
                        {workAreas?.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-field">
                      <label className="input-label">Бажана зарплата</label>
                      <select {...register("candidateSalary")}>
                        <option disabled selected value="">
                          Бажана зарплата
                        </option>
                        {salaries?.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-field">
                      <label className="input-label">Інструменти та технології</label>
                      <Select
                        options={techAndToolsOptions}
                        onChange={()=> {}}
                        isMulti
                        closeMenuOnSelect={false}
                        placeholder="Обрані інструменти та технології"
                      />
                    </div>

                    <div className="input-field">
                      <label className="input-label">Місце роботи</label>
                      <select {...register("candidateWorkplace")}>
                        <option disabled selected value="">
                          Місце роботи
                        </option>
                        {workplaces?.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-field">
                      <label className="input-label">Посилання на профіль</label>
                      <input {...register("candidateLinkedin")} type="text" placeholder="Linkedin" />
                    </div>

                    <div className="input-field">
                      <label className="input-label">Посилання на Github</label>
                      <input {...register("candidateGithub")} type="text" placeholder="Github" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {page === 2 && (
              <div className="form third">
                <div className="details review">
                  <span className="title">Підтвердження</span>

                  <div className="fields">
                    <div className="input-field">
                      <label className="input-label">Фото профілю</label>
                      <input {...register("candidateProfilePic")} type="text" placeholder="Посилання на фото профілю" />
                    </div>

                    <div className="input-field">
                      <button type="submit" className="submit-button">
                        Підтвердити
                        <CheckmarkOutline color={"#00000"} title={"submit"} height="25px" width="25px" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="navigation-buttons">
              {page > 0 && (
                <button type="button" onClick={() => setPage(page - 1)}>
                  Назад
                  <ArrowBackOutline color={"#00000"} title={"back"} height="25px" width="25px" />
                </button>
              )}

              {page < 2 && (
                <button type="button" onClick={() => setPage(page + 1)}>
                  Далі
                  <ArrowForwardOutline color={"#00000"} title={"forward"} height="25px" width="25px" />
                </button>
              )}
            </div>
          </form>

          {isFormInvalid && (
            <div className="form-invalid">
              <img src={warning} alt="Warning" />
              <span>Форма заповнена некоректно</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default CandidatesPage;
