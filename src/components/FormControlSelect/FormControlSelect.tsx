import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { Option } from "../../types/Option";

interface FormControlSelectProps {
  label: string;
  placeholder?: string;
  name: string;
  value: string;
  options: Option[];
  displayKey: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  isRequired?: boolean;
}

const FormControlSelect: React.FC<FormControlSelectProps> = ({
  label,
  placeholder,
  name,
  value,
  options,
  displayKey,
  onChange,
  isRequired = false,
}) => {
  return (
    <div>
      <FormControl sx={{ minWidth: 360 }} required={isRequired}>
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
          {options &&
            options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option[displayKey]}
              </MenuItem>
            ))}
        </Select>
        <FormHelperText>{placeholder}</FormHelperText>
      </FormControl>
    </div>
  );
};

export default FormControlSelect;
