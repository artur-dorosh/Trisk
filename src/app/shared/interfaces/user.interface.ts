import { Gender } from '../enums/gender';

export interface User {
  name: string;
  surname: string;
  age: number;
  email: string;
  gender: Gender;
  isLegal: boolean;
}
