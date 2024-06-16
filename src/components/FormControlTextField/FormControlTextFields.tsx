import React from "react";
import { FormControl, TextField } from "@mui/material";

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
  isRequired?: boolean;
  isTextArea?: boolean;
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
  isRequired = false,
  isTextArea = false
}) => {
  return (
    <FormControl sx={{ minWidth: 360 }} required={isRequired}>
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
        required={isRequired}
        multiline={isTextArea}
        rows={Infinity}
      />
    </FormControl>
  );
};

export default FormControlTextField;
