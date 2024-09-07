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


export type responseType = {
  //TODO: Fix this type
  years: string,
  contributions: any
  // years: {
  //   [key: string]: {
  //     total: number;
  //     contributions: {
  //       [key: string]: number;
  //     }
  //   },
  //   contributions:
  //   {
  //     [key: string]: number;
  //   }
  // }

}
export type UserContributionStore = {
  userName: string;
  userContributions: responseType
}

export enum FormatEnum {
  nested = "nested",
  flat = "flat"
}
