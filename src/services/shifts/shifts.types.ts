export interface IShift {
  id: number
  type?: number
  start_time?: string
  end_time?: string
  created_at?: string
}

export interface IShiftCreate {
  type?: number
  start_time?: string
  end_time?: string
}

export type IShiftUpdate = IShiftCreate
export type IShiftPatch = Partial<IShiftCreate>

export interface IShiftListParams {
  limit?: number
  page?: number
}

export interface IShiftListResponse {
  pagination?: {
    count?: number
    next?: string | null
    previous?: string | null
  }
  data: IShift[]
}
