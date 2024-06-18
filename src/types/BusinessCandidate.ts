import { Candidate } from './Candidate';

export type BusinessCandidate = Pick<
  Candidate,
  | 'candidateRegion'
  | 'candidateCity'
  | 'candidateEducation'
  | 'candidateTechAndTools'
  | 'candidateEnglish'
  | 'candidatePosition'
  | 'candidateWorkExp'
  | 'candidateWorkArea'
  | 'candidateSalary'
  | 'candidateWorkplace'
>;