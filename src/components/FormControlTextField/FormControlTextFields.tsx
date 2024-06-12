import React from "react";
import { TextField } from "@mui/material";

interface FormControlTextFieldProps {
  id: string;
  label: string;
  variant?: "filled" | "outlined" | "standard";
  size?: "small" | "medium";
  helperText?: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  width?: string | number;
}

const FormControlTextField: React.FC<FormControlTextFieldProps> = ({
  id,
  label,
  variant = "outlined",
  size = "small",
  helperText,
  name,
  value,
  onChange,
  color = "secondary",
  width = 360,
}) => {
  return (
    <TextField
      id={id}
      label={label}
      variant={variant}
      size={size}
      helperText={helperText}
      name={name}
      value={value}
      onChange={onChange}
      color={color}
      sx={{ width }}
    />
  );
};

export default FormControlTextField;
