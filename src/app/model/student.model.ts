export interface StudentLoginResponse {
  status: number;
  responseType: string;
  apiPath: string;
  message: string;
  token: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  date_of_birth: string;
  registration_number: string;
  certification_number: string;
  father_name: string;
  mother_name: string;
  spouse_name: string;
  address: string;
}

export interface StudentProfileResponse {
  status: number;
  responseType: string;
  apiPath: string;
  message: string;
  data: Array<{
    personal_info: StudentProfile;
  }>;
}
