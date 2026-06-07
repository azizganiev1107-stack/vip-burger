export interface IUserSalaryUser {
  id: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
}

export interface IUserSalary {
  id: number;
  user?: IUserSalaryUser;
  user_id?: number;
  amount: string;
  month: string | null;
  created_at?: string;
}

export interface IUserSalaryCreate {
  user_id: number;
  amount: string;
  month?: string | null;
}

export type IUserSalaryUpdate = IUserSalaryCreate;
export type IUserSalaryPatch = Partial<IUserSalaryCreate>;

export interface IUserSalaryListParams {
  user?: number;
  month?: string;
  limit?: number;
}

export interface IUserSalaryListResponse {
  pagination?: {
    count?: number;
    next?: string | null;
    previous?: string | null;
  };
  data: IUserSalary[];
}