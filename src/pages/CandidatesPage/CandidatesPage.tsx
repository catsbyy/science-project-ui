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
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import FormControlSelect from "../../components/FormControlSelect/FormControlSelect";
import FormControlTextField from "../../components/FormControlTextField/FormControlTextFields";

import { ArrowForwardOutline } from "react-ionicons";
import { ArrowBackOutline } from "react-ionicons";
import { CheckmarkOutline } from "react-ionicons";

import warning from "../../img/icons/warning.svg";

interface Props {}

interface TechAndToolOption {
  value: string;
  label: string;
}

interface Candidate {
  candidateSurname: string;
  candidateName: string;
  candidatePatronymic: string;
  candidateDateOfBirth: Dayjs | null;
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
  //const [selectedTechAndToolsOptions, setSelectedTechAndToolsOptions] = useState<MultiValue<TechAndToolOption>>();
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
  } = useForm<Candidate>({ mode: "all" });

  const [candidate, setCandidate] = useState<Candidate>({
    candidateSurname: "",
    candidateName: "",
    candidatePatronymic: "",
    candidateDateOfBirth: null,
    candidateMobNumber: "",
    candidateEmail: "",
    candidateRegion: "",
    candidateCity: "",
    candidateStreet: "",
    candidateHouseNum: "",
    candidateEducation: "",
    candidateUniversity: "",
    candidateEnglish: "",
    candidatePosition: "",
    candidateWorkExp: "",
    candidateWorkArea: "",
    candidateLinkedin: "",
    candidateGithub: "",
  });

  const handleSelect = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handleDateChange = (event: Dayjs | null) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const addNewCandidate: SubmitHandler<Candidate> = (data) => {
    const candidate: Candidate = {
      ...data,
      //candidateTechAndTools: selectedTechAndToolsOptions?.map((option: Option) => option.value).join(";"),
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

  const isDataInvalid = (candidate: Candidate): boolean => {
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
                    <FormControlTextField
                      id="outlined-basic"
                      label="Прізвище"
                      variant="outlined"
                      helperText="Введіть ваше прізвище"
                      name="candidateSurname"
                      value={candidate.candidateSurname}
                      onChange={handleChange}
                      isRequired={true}
                    />

                    <FormControlTextField
                      id="outlined-basic"
                      label="Ім'я"
                      variant="outlined"
                      helperText="Введіть ваше ім'я"
                      name="candidateName"
                      value={candidate.candidateName}
                      onChange={handleChange}
                      isRequired={true}
                    />

                    <FormControlTextField
                      id="outlined-basic"
                      label="По-батькові"
                      variant="outlined"
                      helperText="Введіть ваше по-батькові"
                      name="candidatePatronymic"
                      value={candidate.candidatePatronymic}
                      onChange={handleChange}
                      isRequired={false}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Дата народження"
                        value={candidate.candidateDateOfBirth}
                        onChange={handleDateChange}
                        slotProps={{
                          textField: { size: "small", color: "secondary", helperText: "Оберіть дату народження" },
                        }}
                      />
                    </LocalizationProvider>

                    {/*regex*/}
                    <FormControlTextField
                      id="outlined-basic"
                      label="Мобільний номер"
                      variant="outlined"
                      helperText="Введіть мобільний номер"
                      name="candidateMobNumber"
                      value={candidate.candidateMobNumber}
                      onChange={handleChange}
                      isRequired={true}
                    />

                    {/*regex*/}
                    <FormControlTextField
                      id="outlined-basic"
                      label="Електронна пошта"
                      variant="outlined"
                      helperText="Введіть електронну пошту"
                      name="candidateEmail"
                      value={candidate.candidateEmail}
                      onChange={handleChange}
                      isRequired={true}
                    />
                  </div>
                </div>

                <div className="details ID">
                  <span className="title">Адреса та додаткові контакти</span>

                  <div className="fields">
                    <FormControlSelect
                      label="Область"
                      name="candidateRegion"
                      placeholder="Оберіть область"
                      value={candidate.candidateRegion}
                      options={response.regions}
                      onChange={handleSelect}
                    />

                    <FormControlTextField
                      id="outlined-basic"
                      label="Місто"
                      variant="outlined"
                      helperText="Введіть ваше місто"
                      name="candidateCity"
                      value={candidate.candidateCity}
                      onChange={handleChange}
                      isRequired={true}
                    />

                    {/*regex inputRegex*/}
                    <FormControlTextField
                      id="outlined-basic"
                      label="Вулиця"
                      variant="outlined"
                      helperText="Введіть вашу вулицю"
                      name="candidateStreet"
                      value={candidate.candidateStreet}
                      onChange={handleChange}
                      isRequired={false}
                    />

                    {/*regex inputRegex*/}
                    <FormControlTextField
                      id="outlined-basic"
                      label="Номер будинку"
                      variant="outlined"
                      helperText="Введіть номер будинку"
                      name="candidateHouseNum"
                      value={candidate.candidateHouseNum}
                      onChange={handleChange}
                      isRequired={false}
                    />

                    <FormControlTextField
                      id="outlined-basic"
                      label="Linkedin"
                      variant="outlined"
                      helperText="Посилання на профіль"
                      name="candidateLinkedin"
                      value={candidate.candidateLinkedin}
                      onChange={handleChange}
                      isRequired={false}
                    />

                    <FormControlTextField
                      id="outlined-basic"
                      label="Github"
                      variant="outlined"
                      helperText="Посилання на профіль"
                      name="candidateGithub"
                      value={candidate.candidateGithub}
                      onChange={handleChange}
                      isRequired={false}
                    />
                  </div>
                </div>
              </div>
            )}

            {page === 1 && (
              <div className="form second">
                <div className="details education">
                  <span className="title">Освіта</span>

                  <div className="fields">
                    <FormControlSelect
                      label="Освіта"
                      name="candidateEducation"
                      placeholder="Оберіть освіту"
                      value={candidate.candidateEducation}
                      options={education}
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    {/*regex input..*/}
                    <FormControlTextField
                      id="outlined-basic"
                      label="Навчальний заклад"
                      variant="outlined"
                      helperText="Введіть ваш навчальний заклад"
                      name="candidateUniversity"
                      value={candidate.candidateUniversity}
                      onChange={handleChange}
                      isRequired={true}
                    />

                    <FormControlTextField
                      id="outlined-basic"
                      label="Спеціальність"
                      variant="outlined"
                      helperText="Введіть вашу спеціальність"
                      name="candidateSpecialty"
                      value={candidate.candidateSpecialty}
                      onChange={handleChange}
                      isRequired={false}
                    />
                    
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={techAndToolsOptions}
                      getOptionLabel={(option) => option.label}
                      value={[]}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField {...params} sx={{ minWidth: 360 }} label="Технології та інструменти" helperText="Оберіть технології та інструменти" color="secondary" size="small" />
                      )}
                    />

                    <FormControlSelect
                      label="Рівень англійської"
                      name="candidateEnglish"
                      placeholder="Оберіть рівень англійської"
                      value={candidate.candidateEnglish}
                      options={englishLevels}
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    <FormControlTextField
                      id="outlined-basic"
                      label="Коротка біографія"
                      variant="outlined"
                      helperText="Розкажіть про себе"
                      name="candidateSummary"
                      value={candidate.candidateSummary}
                      onChange={handleChange}
                      isRequired={false}
                      isTextArea={true}
                    />
                  </div>
                </div>

                <div className="details more">
                  <span className="title">Робота</span>

                  <div className="fields">
                    <FormControlSelect
                      label="Посада"
                      name="candidatePosition"
                      placeholder="Оберіть бажану посаду"
                      value={candidate.candidatePosition}
                      options={positions}
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    <FormControlSelect
                      label="Досвід роботи"
                      name="candidateWorkExp"
                      placeholder="Оберіть досвід роботи"
                      value={candidate.candidateWorkExp}
                      options={workExps}
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    <FormControlSelect
                      label="Область роботи"
                      name="candidateWorkArea"
                      placeholder="Оберіть область роботи"
                      value={candidate.candidateWorkArea}
                      options={workAreas}
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    <FormControlSelect
                      label="Бажана заробітна плата"
                      name="candidateSalary"
                      placeholder="Оберіть заробітну плату"
                      value={candidate.candidateSalary}
                      options={salaries}
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    <FormControlSelect
                      label="Місце роботи"
                      name="candidateWorkplace"
                      placeholder="Оберіть місце роботи"
                      value={candidate.candidateWorkplace}
                      options={workplaces}
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    <FormControlTextField
                      id="outlined-basic"
                      label="Профільна картинка"
                      variant="outlined"
                      helperText="Посилання на фото профілю"
                      name="candidateProfilePic"
                      value={candidate.candidateProfilePic}
                      onChange={handleChange}
                      isRequired={false}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="navigation-buttons">
              {page > 0 && (
                <div>
                  <button type="button" onClick={() => setPage(page - 1)} className="form-button">
                    Назад
                    <ArrowBackOutline color={"#00000"} title={"back"} height="25px" width="25px" />
                  </button>
                  <button type="submit" className="form-button">
                    Підтвердити
                    <CheckmarkOutline color={"#00000"} title={"submit"} height="25px" width="25px" />
                  </button>
                </div>
              )}

              {page < 1 && (
                <button type="button" onClick={() => setPage(page + 1)} className="form-button">
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
