import dayjs from 'dayjs';
import { Candidate } from '../types/Candidate';

const mapApiResponseToCandidate = (apiCandidate: any): Candidate => {
  return {
    candidateId: apiCandidate.id,
    candidateSurname: apiCandidate.surname,
    candidateName: apiCandidate.name,
    candidatePatronymic: apiCandidate.patronymic,
    candidateDateOfBirth: dayjs(apiCandidate.date_of_birth),
    candidateMobNumber: apiCandidate.mobile_number,
    candidateEmail: apiCandidate.email,
    candidateRegion: apiCandidate.region_id,
    candidateCity: apiCandidate.city,
    candidateStreet: apiCandidate.street,
    candidateHouseNum: apiCandidate.house_number,
    candidateLinkedin: apiCandidate.linkedin,
    candidateGithub: apiCandidate.github,
    candidateEducation: apiCandidate.education_level_id,
    candidateUniversity: apiCandidate.university,
    candidateSpecialty: apiCandidate.specialty,
    candidateTechAndTools: apiCandidate.technologies_and_tools.split(',').map(Number),
    //candidateTechAndTools: apiCandidate.technologies_and_tools.split(',').map(Number),
    candidateEnglish: apiCandidate.english_level_id,
    candidateSummary: apiCandidate.summary,
    candidatePosition: apiCandidate.position_id,
    candidateWorkExp: apiCandidate.work_experience_id,
    candidateWorkArea: apiCandidate.work_area_id,
    candidateSalary: apiCandidate.salary_id,
    candidateWorkplace: apiCandidate.workplace_id,
    candidateProfilePic: apiCandidate.profile_picture,
  };
};

export {mapApiResponseToCandidate};
