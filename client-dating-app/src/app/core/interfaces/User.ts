export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  imageUrl: string;
}

export interface IRegister {
  email: string;
  displayName: string;
  password: string;
  gender: string;
  dateOfBirth: string;
  city: string;
  country: string;
}

