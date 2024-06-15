import React from "react";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface SelectOption {
  id: string | number;
  name?: string; // Make this optional
  region_name?: string; // Make this optional
}

interface FormControlSelectProps {
  label: string;
  placeholder?: string;
  name: string;
  value: string;
  options: SelectOption[];
  onChange: (event: SelectChangeEvent<string>) => void;
}

const FormControlSelect: React.FC<FormControlSelectProps> = ({
  label,
  placeholder,
  name,
  value,
  options,
  onChange,
}) => {
  return (
    <div>
      <FormControl sx={{ minWidth: 360 }}>
        <InputLabel color="secondary" size="small">
          {label}
        </InputLabel>
        <Select
          color="secondary"
          value={value}
          label={label}
          name={name}
          onChange={onChange}
          size="small"
          MenuProps={{
            disableScrollLock: true,
          }}
        >
          <MenuItem value="">
            <em>{placeholder || "Select an option"}</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name || option.region_name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{placeholder}</FormHelperText>
      </FormControl>
    </div>
  );
};

export default FormControlSelect;