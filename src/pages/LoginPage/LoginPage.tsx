import React, { ChangeEvent, useState } from "react";
import { MailOutline, PersonCircleOutline, LockClosedOutline } from "react-ionicons";
import "./LoginPage.css";
import Button from "@mui/material/Button";
import { TextField, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from "@mui/material";
import FormControlTextField from "../../components/FormControlTextField/FormControlTextFields";
import { CandidateUser, BusinessUser } from "../../types/UserTypes.ts";
import { useAuth } from "../../auth/AuthWrapper.tsx"; // Import useAuth hook

interface Props {}

const initialCandidate: CandidateUser = {
  name: "",
  surname: "",
  email: "",
  password: "",
  role: "candidate",
};

const initialBusiness: BusinessUser = {
  name: "",
  surname: "",
  email: "",
  password: "",
  role: "business",
  companyName: "",
};

function LoginPage({}: Props) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [role, setRole] = useState<"candidate" | "business">("candidate");
  const [candidate, setCandidate] = useState<CandidateUser>(initialCandidate);
  const [business, setBusiness] = useState<BusinessUser>(initialBusiness);
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const { login } = useAuth(); // Use login function from AuthContext

  const handleRoleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newRole = event.target.value as "candidate" | "business";
    setRole(newRole);
    if (newRole === "candidate") {
      setCandidate(initialCandidate);
    } else {
      setBusiness(initialBusiness);
    }
    setConfirmPassword("");
  };

  const handleCandidateChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setCandidate({ ...candidate, [name]: value });
  };

  const handleBusinessChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setBusiness({ ...business, [name]: value });
  };

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async () => {
    const { email, password } = role === "candidate" ? candidate : business;
    try {
      await login(email, password);
      // Redirect or show success message here
    } catch (error) {
      console.error(error);
      // Show error message to user
    }
  };

  return (
    <div className="page">
      <div className="intro">
        <div className="waves">
          <div className="wave -one"> </div>
          <div className="wave -two"></div>
        </div>

        <div className="login-container">
          <div className="header">
            <div className="text">{isSignIn ? "Увійти" : "Зареєструватися"}</div>
            <div className="underline"></div>
          </div>

          <div className="inputs">
            {!isSignIn && (
              <FormControl required={true}>
                <FormLabel id="demo-radio-buttons-group-label" color="secondary">
                  Моя роль
                </FormLabel>
                <RadioGroup
                  row
                  aria-required
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={role}
                  name="radio-buttons-group"
                  onChange={handleRoleChange}
                >
                  <FormControlLabel value="candidate" control={<Radio color="secondary" />} label="Кандидат" />
                  <FormControlLabel value="business" control={<Radio color="secondary" />} label="Роботодавець" />
                </RadioGroup>
              </FormControl>
            )}
            {!isSignIn && (
              <FormControlTextField
                id="name"
                label="Ім'я"
                variant="outlined"
                helperText="Введіть ваше ім'я"
                name="name"
                isRequired={true}
                value={role === "candidate" ? candidate.name : business.name}
                onChange={role === "candidate" ? handleCandidateChange : handleBusinessChange}
              />
            )}

            {!isSignIn && (
              <FormControlTextField
                id="surname"
                label="Прізвище"
                variant="outlined"
                helperText="Введіть ваше прізвище"
                name="surname"
                isRequired={true}
                value={role === "candidate" ? candidate.surname : business.surname}
                onChange={role === "candidate" ? handleCandidateChange : handleBusinessChange}
              />
            )}

            <FormControlTextField
              id="email"
              label="Електронна пошта"
              variant="outlined"
              helperText="Введіть електронну пошту"
              name="email"
              isRequired={true}
              value={role === "candidate" ? candidate.email : business.email}
              onChange={role === "candidate" ? handleCandidateChange : handleBusinessChange}
            />

            {!isSignIn && role === "business" && (
              <FormControlTextField
                id="company-name"
                label="Назва компанії"
                variant="outlined"
                helperText="Введіть назву компанії"
                name="companyName"
                isRequired={true}
                value={business.companyName}
                onChange={handleBusinessChange}
              />
            )}

            <FormControlTextField
              id="password"
              label="Пароль"
              variant="outlined"
              helperText="Введіть пароль"
              name="password"
              isRequired={true}
              value={role === "candidate" ? candidate.password : business.password}
              onChange={role === "candidate" ? handleCandidateChange : handleBusinessChange}
            />

            {!isSignIn && (
              <FormControlTextField
                id="confirm-password"
                label="Підтвердіть пароль"
                variant="outlined"
                helperText="Введіть пароль ще раз"
                name="confirm-password"
                isRequired={true}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            )}
          </div>

          <div className="navigation-buttons">
            <div className="buttons">
              <div className={!isSignIn ? "form-button grey" : "form-button"} onClick={() => setIsSignIn(true)}>
                Увійти
              </div>
              <div className={isSignIn ? "form-button grey" : "form-button"} onClick={() => setIsSignIn(false)}>
                Зареєструватися
              </div>{" "}
            </div>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {isSignIn ? "Увійти" : "Зареєструватися"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
