import { Candidate } from '../types/Candidate';
import { Response } from '../types/Response';
import { Option } from '../types/Option';

type MetadataKey = 'english' | 'position' | 'workExp' | 'workArea' | 'education' | 'workplace' | 'salary' | 'regions' | 'techAndTools';

const getMetadataItem = (response: Response, key: MetadataKey, index: number): Option | undefined => {
  return response[key] && response[key][index];
}

export const getMetaDataValue = (
  candidate: Candidate, 
  response: Response, 
  property: keyof Candidate, 
  key: MetadataKey, 
  defaultValue: string = "Unknown"
): string => {
   // Ensure property exists and is valid
  if (!candidate[property]) {
    return defaultValue;
  }

  const index = Number(candidate[property]) - 1; // Ensure correct conversion and index calculation
  const metadataItem = getMetadataItem(response, key, index);

  return metadataItem && key in metadataItem ? String(metadataItem[key]) : defaultValue;
}

export const getEnglishLevel = (candidate: Candidate, response: Response): string => {
  const index = Number(candidate.candidateEnglish) - 1;
  const englishLevel = response.english[index]?.english_level;
  return englishLevel ? englishLevel.split(" - ")[1] : "Unknown";
}

export const getEducationLevel = (candidate: Candidate, response: Response): string => {
  const index = Number(candidate.candidateEducation) - 1;
  const educationLevel = response.education[index]?.education_level;
  return educationLevel ? educationLevel : "Unknown";
}

export const getWorkArea = (candidate: Candidate, response: Response): string => {
  const index = Number(candidate.candidateWorkArea) - 1;
  const workArea = response.workArea[index]?.work_area;
  return workArea ? workArea : "Unknown";
}

export const getWorkplace = (candidate: Candidate, response: Response): string => {
  return getMetaDataValue(candidate, response, 'candidateWorkplace', 'workplace');
}

export const getSalary = (candidate: Candidate, response: Response): string => {
  return getMetaDataValue(candidate, response, 'candidateSalary', 'salary');
}

export const getPosition = (candidate: Candidate, response: Response): string => {
  return getMetaDataValue(candidate, response, 'candidatePosition', 'position');
}

export const getBirthday = (candidate: Candidate): string => {
  const dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return new Date(candidate.candidateDateOfBirth?.toString() || "").toLocaleDateString("ukr-UA", dateOptions).slice(0, -3);
}

export const getRegion = (candidate: Candidate, response: Response): string => {
  const regionIndex = candidate.candidateRegion ? Number(candidate.candidateRegion) - 1 : -1;
  const region = response.regions[regionIndex]?.region_name;
  return region ? `${region} область` : "Unknown";
}

export const getWorkExperience = (candidate: Candidate, response: Response): string => {
  const index = Number(candidate.candidateWorkExp) - 1;
  let workExp = response.workExp[index]?.work_experience;
  switch (index) {
    case 0:
      workExp = "без досвіду";
      break;
    case 1:
    case 3:
      workExp += " року";
      break;
    case 2:
      workExp += " рік";
      break;
    case 4:
    case 5:
      workExp += " роки";
      break;
    case 6:
      workExp += " років";
      break;
    default:
      break;
  }
  return workExp;
}

export const getTechAndToolsNames = (candidate: Candidate, response: Response): { id: number; name: string }[] => {
  const candidateTechAndTools = Array.isArray(candidate.candidateTechAndTools) ? candidate.candidateTechAndTools : [];
  return response.techAndTools.filter((item) => candidateTechAndTools.includes(item.id)).map((item) => ({ id: item.id, name: item.name }));
}