import React, { ChangeEvent, useState } from "react";
import { MailOutline, PersonCircleOutline, LockClosedOutline } from "react-ionicons";
import "./LoginPage.css";
import Button from "@mui/material/Button";
import { TextField, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from "@mui/material";

import Form from "react-bootstrap/Form";

interface Props {}

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

function LoginPage({}: Props) {
  const [isSignIn, setIsSignIn] = useState(true);

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

  const handleChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target as HTMLInputElement;  // Type assertion
    setStudent({ ...student, [name]: value });
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
            <div className="text">{isSignIn ? "Sign In" : "Sign Up"}</div>
            <div className="underline"></div>
          </div>

          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel color="secondary">Region</InputLabel>
            <Select
              color="secondary"
              value={student.studentRegion}
              label="Region"
              name="studentRegion"  // Add the name attribute
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>

          <FormControl required  sx={{ m: 1, minWidth: 120 }}>
            <InputLabel color="secondary" size="small">City</InputLabel>
            <Select
              color="secondary"
              value={student.studentCity}
              label="City"
              name="studentCity"  // Add the name attribute
              onChange={handleChange}
              size="small"
              
              MenuProps={{
                disableScrollLock: true,
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Kyiv</MenuItem>
              <MenuItem value={20}>Tokyo</MenuItem>
              <MenuItem value={30}>Oslo</MenuItem>
            </Select>
          </FormControl>

          <div className="inputs">
            {!isSignIn && (
              <div>
                <div className="radio">
                  <label>
                    <input type="radio" value="option1" checked={true} />
                    Option 1
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input type="radio" value="option2" />
                    Option 2
                  </label>
                </div>
              </div>
            )}

            {!isSignIn && (
              <div className="input">
                <PersonCircleOutline color={"#00000"} title={"person"} height="25px" width="25px" />
                <input type="text" placeholder="Name" name="studentName" onChange={handleChange} />
              </div>
            )}

            <div className="input">
              <MailOutline color={"#00000"} title={"email"} height="25px" width="25px" />
              <input type="email" placeholder="Email" name="studentEmail" onChange={handleChange} />
            </div>

            <div className="input">
              <LockClosedOutline color={"#00000"} title={"password"} height="25px" width="25px" />
              <input type="password" placeholder="Password" name="studentPassword" onChange={handleChange} />
            </div>

            {!isSignIn && (
              <div className="input">
                <LockClosedOutline color={"#00000"} title={"password"} height="25px" width="25px" />
                <input type="password" placeholder="Confirm Password" name="studentConfirmPassword" onChange={handleChange} />
              </div>
            )}
          </div>

          {isSignIn && (
            <div className="forgot-password">
              Forget Password? <span>Click here</span>
            </div>
          )}

          <div className="submit-container">
            <div className={!isSignIn ? "submit grey" : "submit"} onClick={() => setIsSignIn(true)}>
              Sign In
            </div>
            <div className={isSignIn ? "submit grey" : "submit"} onClick={() => setIsSignIn(false)}>
              Sign Up
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
