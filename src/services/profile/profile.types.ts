export interface IAdminProfile {
  id: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role?: string;
  phone?: string;
  [key: string]: any;
}

export interface IUserProfile {
  id: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role?: string;
  phone?: string;
  [key: string]: any;
}

export type IAdminProfileUpdate = Partial<Omit<IAdminProfile, "id" | "full_name" | "role">>;
export type IUserProfileUpdate = Partial<Omit<IUserProfile, "id" | "full_name" | "role">>;

export interface IChangePasswordRequest {
  old_password: string;
  new_password: string;
}