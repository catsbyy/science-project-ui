import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { inputRegex } from "../../helpers/inputRegex";
import { emailRegex } from "../../helpers/emailRegex";
import { linkRegex } from "../../helpers/linkRegex";
import { phoneRegex } from "../../helpers/phoneRegex";
import { TextField, SelectChangeEvent, Autocomplete } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import FormControlSelect from "../../components/FormControlSelect/FormControlSelect";
import FormControlTextField from "../../components/FormControlTextField/FormControlTextFields";
/* types */
import { Response } from "../../types/Response";
import { Option } from "../../types/Option";
import { Candidate } from "../../types/Candidate";

import { ArrowForwardOutline, ArrowBackOutline, CheckmarkOutline } from "react-ionicons";

import warning from "../../img/icons/warning.svg";
import { useAuth } from "../../auth/AuthWrapper";
import { mapApiResponseToCandidate } from "../../helpers/mapApiResponseToCandidate";

interface Props {}

function CandidatesPage({}: Props) {
  const { user } = useAuth();
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
  //const [selectedTechAndToolsOptions, setSelectedTechAndToolsOptions] = useState<MultiValue<TechAndToolOption>>();
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const response = await fetch(`/api/business/get-candidate-details/${user.id}/true`);
        const data = await response.json();
        setCandidate(mapApiResponseToCandidate(data.candidate[0]));
        console.log("user: ", candidate);
      } catch (error) {
        console.error("Failed to fetch candidate details:", error);
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

    fetchCandidateDetails();
    fetchMetaData();
  }, []);

  console.log(response);

  const techAndToolsOptions: Option[] = response.techAndTools
    ? response.techAndTools.map((techAndTool) => ({
        id: techAndTool.id,
        name: techAndTool.name,
      }))
    : [];

  const [candidate, setCandidate] = useState<Candidate>({
    candidateId: null,
    candidateSurname: user.surname,
    candidateName: user.name,
    candidatePatronymic: "",
    candidateDateOfBirth: null,
    candidateMobNumber: "",
    candidateEmail: user.email,
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
    candidateTechAndTools: [] as number[],
    userId: user.id,
  });

  const handleSelect = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setCandidate({ ...candidate, candidateDateOfBirth: date.format("YYYY-MM-DD") });
    }
  };

  const handleTechAndToolsChange = (event: any, newValue: Option[]) => {
    const ids = newValue.map((option) => option.id);
    setCandidate({ ...candidate, candidateTechAndTools: ids });
  };

  const addNewCandidate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(candidate);

    const formattedDateOfBirth = candidate.candidateDateOfBirth
      ? dayjs(candidate.candidateDateOfBirth).format("YYYY-MM-DD")
      : null;

    const newCandidate: Candidate = {
      ...candidate,
      candidateDateOfBirth: formattedDateOfBirth,
      userId: user.id,
      candidateWorkplace: candidate.candidateWorkplace || "3",
      candidateProfilePic:
        candidate.candidateProfilePic ||
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png",
    };

    //if (!isDataInvalid) {
    if (true) {
      console.log(newCandidate);

      try {
        const response = await fetch("/api/candidates/add-candidate", {
          method: "POST",
          body: JSON.stringify(newCandidate),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          setIsSaveSuccess(true);
        } else {
          console.error("Failed to save candidate");
        }
      } catch (error) {
        console.error("Error saving candidate:", error);
        setIsFormInvalid(true);
      }
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
      "candidatePatronymic",
      "candidateCity",
      "candidateStreet",
      "candidateHouseNum",
    ];

    const textFields = ["candidateSurname", "candidateName", "candidateEducation", "candidateUniversity"];

    let isInvalid = false;

    for (const [key, value] of Object.entries(candidate)) {
      const isValueNotEmpty = value !== "" && value !== null && value !== undefined;

      console.log("incorrect ", key);

      if (!optionalFields.includes(key)) {
        if (isValueNotEmpty) {
          if (textFields.includes(key)) {
            if (!inputRegex.test(value)) {
              console.log("incorrect ", key);
              isInvalid = true;
            }
          } else if (key === "candidateDateOfBirth") {
            if (new Date(value) >= new Date()) {
              console.log("incorrect ", key);
              isInvalid = true;
            }
          } else if (key === "candidateMobNumber") {
            if (!phoneRegex.test(value)) {
              console.log("incorrect ", key);
              isInvalid = true;
            }
          } else if (key === "candidateEmail") {
            if (!emailRegex.test(value)) {
              console.log("incorrect ", key);
              isInvalid = true;
            }
          }
        } else {
          console.log("incorrect ", key);
          isInvalid = true;
        }
      } else {
        if (isValueNotEmpty && ["candidateLinkedin", "candidateGithub", "candidateProfilePic"].includes(key)) {
          if (!linkRegex.test(value)) {
            console.log("incorrect ", key);
            isInvalid = true;
          }
        } else if (isValueNotEmpty && ["candidateSpecialty", "candidateSummary"].includes(key)) {
          if (!inputRegex.test(value)) {
            console.log("incorrect ", key);
            isInvalid = true;
          }
        }
      }
    }

    if (candidate.candidateTechAndTools.length === 0) {
      console.log("priehali");
      isInvalid = true;
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

          <form name="registrationForm" method="post" onSubmit={addNewCandidate}>
            {page === 0 && (
              <div className="form first">
                <div className="details personal">
                  <span className="title">Персональні дані</span>

                  <div className="fields">
                    <FormControlTextField
                      id="candidate-surname"
                      label="Прізвище"
                      variant="outlined"
                      helperText="Введіть ваше прізвище"
                      name="candidateSurname"
                      value={candidate.candidateSurname}
                      onChange={handleChange}
                      isRequired={true}
                    />

                    <FormControlTextField
                      id="candidate-name"
                      label="Ім'я"
                      variant="outlined"
                      helperText="Введіть ваше ім'я"
                      name="candidateName"
                      value={candidate.candidateName}
                      onChange={handleChange}
                      isRequired={true}
                    />

                    <FormControlTextField
                      id="candidate-patronymic"
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
                        value={
                          candidate.candidateDateOfBirth ? dayjs(candidate.candidateDateOfBirth, "YYYY-MM-DD") : null
                        }
                        onChange={handleDateChange}
                        slotProps={{
                          textField: {
                            size: "small",
                            color: "secondary",
                            helperText: "Оберіть дату народження",
                            sx: { minWidth: 360 },
                          },
                        }}
                      />
                    </LocalizationProvider>

                    {/*regex*/}
                    <FormControlTextField
                      id="candidate-phone-number"
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
                      id="candidate-email"
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
                      displayKey="region_name"
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    <FormControlTextField
                      id="candidate-city"
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
                      id="candidate-street"
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
                      id="candidate-house"
                      label="Номер будинку"
                      variant="outlined"
                      helperText="Введіть номер будинку"
                      name="candidateHouseNum"
                      value={candidate.candidateHouseNum}
                      onChange={handleChange}
                      isRequired={false}
                    />

                    <FormControlTextField
                      id="candidate-linkedin"
                      label="Linkedin"
                      variant="outlined"
                      helperText="Посилання на профіль"
                      name="candidateLinkedin"
                      value={candidate.candidateLinkedin || ""}
                      onChange={handleChange}
                      isRequired={false}
                    />

                    <FormControlTextField
                      id="candidate-github"
                      label="Github"
                      variant="outlined"
                      helperText="Посилання на профіль"
                      name="candidateGithub"
                      value={candidate.candidateGithub || ""}
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
                      options={response.education}
                      displayKey="education_level"
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    {/*regex input..*/}
                    <FormControlTextField
                      id="candidate-university"
                      label="Навчальний заклад"
                      variant="outlined"
                      helperText="Введіть ваш навчальний заклад"
                      name="candidateUniversity"
                      value={candidate.candidateUniversity}
                      onChange={handleChange}
                      isRequired={true}
                    />

                    <FormControlTextField
                      id="candidate-specialty"
                      label="Спеціальність"
                      variant="outlined"
                      helperText="Введіть вашу спеціальність"
                      name="candidateSpecialty"
                      value={candidate.candidateSpecialty || ""}
                      onChange={handleChange}
                      isRequired={false}
                    />

                    <Autocomplete
                      multiple
                      id="candidate-technologies"
                      options={techAndToolsOptions}
                      getOptionLabel={(option) => String(option.name)}
                      value={techAndToolsOptions.filter((option) =>
                        candidate.candidateTechAndTools.includes(option.id)
                      )}
                      onChange={handleTechAndToolsChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ width: 360 }}
                          label="Технології та інструменти *"
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
                      isRequired={true}
                    />

                    <FormControlTextField
                      id="candidate-summary"
                      label="Коротка біографія"
                      variant="outlined"
                      helperText="Розкажіть про себе"
                      name="candidateSummary"
                      value={candidate.candidateSummary || ""}
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
                      options={response.position}
                      displayKey="position"
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    <FormControlSelect
                      label="Досвід роботи"
                      name="candidateWorkExp"
                      placeholder="Оберіть досвід роботи"
                      value={candidate.candidateWorkExp}
                      options={response.workExp}
                      displayKey="work_experience"
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    <FormControlSelect
                      label="Область роботи"
                      name="candidateWorkArea"
                      placeholder="Оберіть область роботи"
                      value={candidate.candidateWorkArea}
                      options={response.workArea}
                      displayKey="work_area"
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    <FormControlSelect
                      label="Бажана заробітна плата"
                      name="candidateSalary"
                      placeholder="Оберіть заробітну плату"
                      value={candidate.candidateSalary || ""}
                      options={response.salary}
                      displayKey="salary"
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    <FormControlSelect
                      label="Місце роботи"
                      name="candidateWorkplace"
                      placeholder="Оберіть місце роботи"
                      value={candidate.candidateWorkplace || ""}
                      options={response.workplace}
                      displayKey="workplace"
                      onChange={handleSelect}
                      isRequired={true}
                    />

                    <FormControlTextField
                      id="candidate-profile"
                      label="Профільна картинка"
                      variant="outlined"
                      helperText="Посилання на фото профілю"
                      name="candidateProfilePic"
                      value={candidate.candidateProfilePic || ""}
                      onChange={handleChange}
                      isRequired={false}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="navigation-buttons">
              {page > 0 && (
                <div className="buttons">
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

          {isSaveSuccess && <div className="success-message">Дані успішно збережено.</div>}

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
