import type { IRole } from "../roles";

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  role?: IRole;
  role_id?: number;
  branch?: any;
  branch_id?: number | null;
  created_at?: string;
  is_active?: boolean;
}

export interface IUserCreate {
  first_name: string;
  last_name: string;
  phone: string;
  password?: string;
  role_id: number;
  branch_id?: number | null;
  is_active?: boolean;
}

export type IUserUpdate = IUserCreate;
export type IUserPatch = Partial<IUserCreate>;

export interface IUserListParams {
  first_name?: string;
  last_name?: string;
  phone?: string;
  role_id?: number;
  limit?: number;
  created_from?: string;
  created_to?: string;
}

export interface IUserListResponse {
  pagination?: {
    count?: number;
    next?: string | null;
    previous?: string | null;
  };
  data: IUser[];
}
