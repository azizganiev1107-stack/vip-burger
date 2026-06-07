export interface IRole {
  id: number;
  code: string;
  name: string;
}

export type IRoleCreate = Omit<IRole, "id">;
export type IRoleUpdate = IRoleCreate;
export type IRolePatch = Partial<IRoleCreate>;

export interface IRoleListParams {
  code?: string;
  name?: string;
  limit?: number;
  ordering?: string;
}

export interface IRoleListResponse {
  pagination?: {
    count?: number;
    next?: string | null;
    previous?: string | null;
  };
  data: IRole[];
}