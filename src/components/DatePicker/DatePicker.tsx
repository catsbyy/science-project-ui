import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface DatePickerProps {
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
  }

const CustomDatePicker: React.FC<DatePickerProps> = ({
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
  }) => {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
          label="Small picker"
          slotProps={{ textField: { size: 'small', color: "secondary", helperText: {helperText} } }}
        />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;

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
        />
      </FormControl>
    );
  };
  
  export default FormControlTextField;
  