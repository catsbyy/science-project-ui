interface SalaryOption {
  id: number;
  name: string;
}

const salaries: SalaryOption[] = [
  { id: 1, name: "300-500" },
  { id: 2, name: "500-1000" },
  { id: 3, name: "1000-2000" },
  { id: 4, name: "2000-5000" },
  { id: 5, name: "5000+" },
];

export { salaries };
