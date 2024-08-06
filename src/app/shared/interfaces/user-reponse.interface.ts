import { User } from './user.interface';

export interface UserResponse {
  userInfo: User;
  status: number;
  success: boolean;
}
