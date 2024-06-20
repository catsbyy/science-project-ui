import { Dayjs } from 'dayjs';

export interface Candidate {
  candidateId?: number | null;
  candidateSurname: string;
  candidateName: string;
  candidatePatronymic: string;
  candidateDateOfBirth: Dayjs | null;
  candidateMobNumber: string;
  candidateEmail: string;
  candidateRegion: string;
  candidateCity: string;
  candidateStreet: string;
  candidateHouseNum: string;
  candidateLinkedin?: string;
  candidateGithub?: string;
  candidateEducation: string;
  candidateUniversity: string;
  candidateSpecialty?: string;
  candidateTechAndTools: number[];
  candidateEnglish: string;
  candidateSummary?: string;
  candidatePosition: string;
  candidateWorkExp: string;
  candidateWorkArea: string;
  candidateSalary?: string;
  candidateWorkplace?: string;
  candidateProfilePic?: string;
}