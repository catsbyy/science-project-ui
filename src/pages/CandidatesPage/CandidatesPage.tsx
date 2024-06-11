import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import Select, { MultiValue } from "react-select";
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

import arrowRight from "../../img/icons/arrow-right-solid.svg";
import warning from "../../img/icons/warning.svg";

interface Props {}

interface TechAndToolOption {
  value: string;
  label: string;
}

interface StudentData {
  studentSurname: string;
  studentName: string;
  studentPatronymic: string;
  studentDateOfBirth: string;
  studentMobNumber: string;
  studentEmail: string;
  studentRegion: string;
  studentCity: string;
  studentStreet: string;
  studentHouseNum: string;
  studentLinkedin?: string;
  studentGithub?: string;
  studentEducation: string;
  studentUniversity: string;
  studentSpecialty?: string;
  studentTechAndTools?: string;
  studentEnglish: string;
  studentSummary?: string;
  studentPosition: string;
  studentWorkExp: string;
  studentWorkArea: string;
  studentSalary?: string;
  studentWorkplace?: string;
  studentProfilePic?: string;
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
    fetch("/api/server")
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
  } = useForm<StudentData>({ mode: "all" });

  const handleSelect = (data: MultiValue<TechAndToolOption>) => {
    setSelectedTechAndToolsOptions(data);
  };

  const addNewStudent: SubmitHandler<StudentData> = (data) => {
    const student: StudentData = {
      ...data,
      studentTechAndTools: selectedTechAndToolsOptions?.map((option: Option) => option.value).join(";"),
      studentWorkplace: data.studentWorkplace || "3",
      studentProfilePic:
        data.studentProfilePic ||
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png",
    };

    if (!isDataInvalid(student)) {
      fetch("/students", {
        method: "POST",
        body: JSON.stringify(student),
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

  const isDataInvalid = (student: StudentData): boolean => {
    const optionalFields = [
      "studentLinkedin",
      "studentGithub",
      "studentSpecialty",
      "studentSummary",
      "studentSalary",
      "studentWorkplace",
      "studentProfilePic",
    ];

    const textFields = [
      "studentSurname",
      "studentName",
      "studentPatronymic",
      "studentCity",
      "studentStreet",
      "studentHouseNum",
      "studentEducation",
      "studentUniversity",
    ];

    let isInvalid = false;

    for (const [key, value] of Object.entries(student)) {
      const isValueNotEmpty = value !== "" && value !== null && value !== undefined;

      if (!optionalFields.includes(key)) {
        if (isValueNotEmpty) {
          if (textFields.includes(key)) {
            if (!inputRegex.test(value)) {
              isInvalid = true;
            }
          } else if (key === "studentDateOfBirth") {
            if (new Date(value) >= new Date()) {
              isInvalid = true;
            }
          } else if (key === "studentMobNumber") {
            if (!phoneRegex.test(value)) {
              isInvalid = true;
            }
          } else if (key === "studentEmail") {
            if (!emailRegex.test(value)) {
              isInvalid = true;
            }
          }
        } else {
          isInvalid = true;
        }
      } else {
        if (isValueNotEmpty && ["studentLinkedin", "studentGithub", "studentProfilePic"].includes(key)) {
          if (!linkRegex.test(value)) {
            isInvalid = true;
          }
        } else if (isValueNotEmpty && ["studentSpecialty", "studentSummary"].includes(key)) {
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

          <form name="registrationForm" method="post" onSubmit={handleSubmit(addNewStudent)}>
            {page === 0 && (
              <div className="form first">
                <div className="details personal">
                  <span className="title">Персональні дані</span>

                  <div className="fields">
                    <div className="input-field">
                      <label className={errors?.studentSurname ? "input-label-invalid" : "input-label"}>
                        Прізвище *
                      </label>
                      <input
                        {...register("studentSurname", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.studentSurname ? "input-field-invalid" : ""}
                        name="studentSurname"
                        type="text"
                        placeholder="Введіть ваше прізвище"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.studentName ? "input-label-invalid" : "input-label"}>Ім'я *</label>
                      <input
                        {...register("studentName", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.studentName ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть ваше ім'я"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.studentPatronymic ? "input-label-invalid" : "input-label"}>
                        По-батькові *
                      </label>
                      <input
                        {...register("studentPatronymic", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.studentPatronymic ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть ваше по-батькові"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.studentDateOfBirth ? "input-label-invalid" : "input-label"}>
                        Дата народження *
                      </label>
                      <input
                        {...register("studentDateOfBirth", {
                          required: true,
                          validate: (dateValue) => new Date(dateValue) < new Date(),
                        })}
                        className={errors?.studentDateOfBirth ? "input-field-invalid" : ""}
                        type="date"
                        placeholder="Enter birth date"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.studentMobNumber ? "input-label-invalid" : "input-label"}>
                        Мобільний номер *
                      </label>
                      <input
                        {...register("studentMobNumber", {
                          required: true,
                          pattern: phoneRegex,
                        })}
                        className={errors?.studentMobNumber ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть мобільний номер"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.studentEmail ? "input-label-invalid" : "input-label"}>
                        Електронна пошта *
                      </label>
                      <input
                        {...register("studentEmail", {
                          required: true,
                          pattern: emailRegex,
                        })}
                        className={errors?.studentEmail ? "input-field-invalid" : ""}
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
                      <label className={errors?.studentRegion ? "input-label-invalid" : "input-label"}>Область *</label>
                      <select
                        {...register("studentRegion", {
                          required: true,
                        })}
                        className={errors?.studentRegion ? "input-field-invalid" : ""}
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
                      <label className={errors?.studentCity ? "input-label-invalid" : "input-label"}>Місто *</label>
                      <input
                        {...register("studentCity", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.studentCity ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть ваше місто"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.studentStreet ? "input-label-invalid" : "input-label"}>Вулиця *</label>
                      <input
                        {...register("studentStreet", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.studentStreet ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть вашу вулицю"
                      />
                    </div>

                    <div className="input-field">
                      <label className={errors?.studentHouseNum ? "input-label-invalid" : "input-label"}>
                        Номер будинку *
                      </label>
                      <input
                        {...register("studentHouseNum", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.studentHouseNum ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть номер будинку"
                      />
                    </div>

                    <div className="input-field">
                      <label className="input-label">Номер квартири</label>
                      <input {...register("studentHouseNum")} type="text" placeholder="Введіть номер квартири" />
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
                      <label className={errors?.studentEducation ? "input-label-invalid" : "input-label"}>
                        Освіта *
                      </label>
                      <select
                        {...register("studentEducation", {
                          required: true,
                        })}
                        className={errors?.studentEducation ? "input-field-invalid" : ""}
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
                      <label className={errors?.studentUniversity ? "input-label-invalid" : "input-label"}>
                        Навчальний заклад *
                      </label>
                      <input
                        {...register("studentUniversity", {
                          required: true,
                          pattern: inputRegex,
                        })}
                        className={errors?.studentUniversity ? "input-field-invalid" : ""}
                        type="text"
                        placeholder="Введіть ваш навчальний заклад"
                      />
                    </div>

                    <div className="input-field">
                      <label className="input-label">Спеціальність</label>
                      <input {...register("studentSpecialty")} type="text" placeholder="Введіть вашу спеціальність" />
                    </div>

                    <div className="input-field">
                      <label className={errors?.studentEnglish ? "input-label-invalid" : "input-label"}>
                        Рівень англійської *
                      </label>
                      <select
                        {...register("studentEnglish", {
                          required: true,
                        })}
                        className={errors?.studentEnglish ? "input-field-invalid" : ""}
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
                      <textarea {...register("studentSummary")} placeholder="Розкажіть про себе"></textarea>
                    </div>
                  </div>
                </div>

                <div className="details more">
                  <span className="title">Деталі</span>

                  <div className="fields">
                    <div className="input-field">
                      <label className={errors?.studentPosition ? "input-label-invalid" : "input-label"}>
                        Посада *
                      </label>
                      <select
                        {...register("studentPosition", {
                          required: true,
                        })}
                        className={errors?.studentPosition ? "input-field-invalid" : ""}
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
                      <label className={errors?.studentWorkExp ? "input-label-invalid" : "input-label"}>
                        Досвід роботи *
                      </label>
                      <select
                        {...register("studentWorkExp", {
                          required: true,
                        })}
                        className={errors?.studentWorkExp ? "input-field-invalid" : ""}
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
                      <label className={errors?.studentWorkArea ? "input-label-invalid" : "input-label"}>
                        Сфера роботи *
                      </label>
                      <select
                        {...register("studentWorkArea", {
                          required: true,
                        })}
                        className={errors?.studentWorkArea ? "input-field-invalid" : ""}
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
                      <select {...register("studentSalary")}>
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
                        onChange={handleSelect}
                        isMulti
                        closeMenuOnSelect={false}
                        placeholder="Обрані інструменти та технології"
                      />
                    </div>

                    <div className="input-field">
                      <label className="input-label">Місце роботи</label>
                      <select {...register("studentWorkplace")}>
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
                      <input {...register("studentLinkedin")} type="text" placeholder="Linkedin" />
                    </div>

                    <div className="input-field">
                      <label className="input-label">Посилання на Github</label>
                      <input {...register("studentGithub")} type="text" placeholder="Github" />
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
                      <input {...register("studentProfilePic")} type="text" placeholder="Посилання на фото профілю" />
                    </div>

                    <div className="input-field">
                      <button type="submit" className="submit-button">
                        Підтвердити
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
                  <img src={arrowRight} alt="Next" className="arrow-left" />
                </button>
              )}

              {page < 2 && (
                <button type="button" onClick={() => setPage(page + 1)}>
                  Далі
                  <img src={arrowRight} alt="Next" />
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
