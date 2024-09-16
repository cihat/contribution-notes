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
	contributions: Contribution[] | Record<string, unknown>;
}

export interface UserContributions {
	years: YearData[] | Record<string, unknown>;
	contributions: Contribution[] | Record<string, unknown>;
}

export enum Status {
	Idle = 'idle',
	Loading = 'loading',
	Success = 'success',
	Error = 'error'
}

export enum FormatEnum {
	nested = 'nested',
	flat = 'flat'
}

export interface State {
	userName: string;
	repoName: string;
	repoData: object;
	userContributions: UserContributions | null;
	requestType: TabEntryEnum;
	status: {
		type: Status;
		message: string;
	};
}

// types.ts
export enum TabEntryEnum {
	Contributions = 'Contributions',
	RepoRetention = 'Repo Retention'
}

export interface TabEntry {
	title: string;
	description: string;
	type: TabEntryEnum;
}

export type Tabs = {
	[key in TabEntryEnum]: TabEntry;
};

export type Granularity = 'day' | 'week' | 'month';

export type Options = {
	data: any;
	username: string;
	themeName: string;
	footerText: string;
};
