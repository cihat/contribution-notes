interface Contribution {
  date: string;
  count: number;
  color: string;
  intensity: string;
}

export interface YearData {
  year: string;
  total: number;
  range: {
    start: string;
    end: string;
  };
  contributions: Contribution[] | Record<string, any>;
}

export interface UserContributions {
  years: YearData[] | Record<string, any>;
  contributions: Contribution[] | Record<string, any>;
}

export enum Status {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error"
}

export enum FormatEnum {
  nested = "nested",
  flat = "flat"
}

export interface State {
  userName: string;
  userContributions: UserContributions | null;
  status: Status;
}
