import { ChangeEvent, useEffect, useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from "@mui/material";
import FormControlTextField from "../../components/FormControlTextField/FormControlTextFields";
import { CandidateUser, BusinessUser } from "../../types/UserTypes.ts";
import { useAuth } from "../../auth/AuthWrapper.tsx";

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
  const navigate = useNavigate();

  const [isSignIn, setIsSignIn] = useState(true);
  const [role, setRole] = useState<"candidate" | "business">("candidate");
  const [candidate, setCandidate] = useState<CandidateUser>(initialCandidate);
  const [business, setBusiness] = useState<BusinessUser>(initialBusiness);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, register } = useAuth(); 

  useEffect(() => {
    setErrorMessage(null);
  }, [isSignIn]);

  const handleRoleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newRole = event.target.value as "candidate" | "business";
    setRole(newRole);
    if (newRole === "candidate") {
      setCandidate(initialCandidate);
    } else {
      setBusiness(initialBusiness);
    }
    console.log("role: " + newRole);
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
    if (isSignIn) {
      const { email, password } = role === "candidate" ? candidate : business;
      try {
        const response = await login(email, password);
        navigate(response.user.role === "candidate" ? "/candidates" : "/business");
      } catch (error: any) {
        console.error("Login error:", error);
        setErrorMessage(error.response?.data?.error || "Failed to login. Please check your credentials.");
      }
    } else {
      const user = role === "candidate" ? candidate : business;
      if (user.password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
  
      try {
        const response = await register(user);
        console.log("Registration response:", response);  
  
        if (response?.message === "User registered successfully") {
          console.log("Registration success:", response);
          setIsSignIn(true); 
          setRegistrationSuccess(true);
          setErrorMessage(null);
        } else {
          console.error("Unexpected response:", response);
          setErrorMessage("Failed to register. Please try again.");
        }
      } catch (error: any) {
        console.error("Registration error:", error);
        setErrorMessage("Registration failed. Please try again.");
      }
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

          {registrationSuccess && <div className="success-message">Успішно зареєстровано! Тепер ви можете увійти.</div>}

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
              <div
                className={!isSignIn ? "form-button grey" : "form-button"}
                onClick={() => (isSignIn ? handleSubmit() : setIsSignIn(true))}
              >
                Увійти
              </div>
              <div
                className={isSignIn ? "form-button grey" : "form-button"}
                onClick={() => (!isSignIn ? handleSubmit() : setIsSignIn(false))}
              >
                Зареєструватися
              </div>{" "}
            </div>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
