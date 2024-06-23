export interface BaseUser {
    name: string;
    surname: string;
    email: string;
    password: string;
    role: 'candidate' | 'business';
  }
  
  export interface CandidateUser extends BaseUser {
  }
  
  export interface BusinessUser extends BaseUser {
    companyName: string;
  }