export interface ILoginRequest {
  phone: string;
  password?: string;
}

export interface IUser {
  id: number;
  phone: string;
  // JWT tokens depending on backend structure
  access?: string;
  refresh?: string;
  token?: string;
}

export interface ILoginResponse {
  message: string;
  data: IUser;
}