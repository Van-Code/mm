interface IshellOptions {
	recipes?: Icontent[];
	articlesList?: { author_article_id?: string }[];
	articlesArchive?: { author_article_id?: string }[];
	favorite_recipes?: { web_content_id?: string; favorite?: boolean }[];
	page?: { web_content_id: string }[];
	pages?: Icontent[];
	coupons: { coupon_id: string }[];
	issueNum: string | null;
	banner?: string;
	tags?: { tag: string }[];
	date?: string;
	activeIssueNums: string[];
	recipesToShow?: Icontent[];
	version?: string | null;
	matrix?: Imatrix | null;
}
interface Icontent {
	web_content_id: string;
	tags: { tag: string }[];
	header: string;
	title: string;
	issue_id?: string;
	auth_id: string;
	author_article_id: string;
	file_paths: { label: string; path: string; rank?: string }[];
}
interface IssuesList {
	id: string;
	start_date: string;
	end_date: string;
	matrix: { [key: string]: Imatrix };
}
interface Imatrix {
	featured?: string;
	kitchen?: Array<string>;
	videos?: Array<string>;
	life?: Array<string>;
	recipes?: { name: string; url: string }[];
	past?: { name: string; url: string }[];
}
interface Istate {
	app: app;
	showDrawer: boolean | { type: string };
	showDialog: boolean | { type: string };
	showSnackBar: boolean | { type: string };
	showTM: boolean;
}
interface app {
	banner: string;
	banners: banners;
	istestsite: boolean;
	user: Iuser;
	isTesting: boolean;
	storageSupported: boolean;
	timeMachineOn: boolean;
	urlParam?: urlParam;
	responsive: {
		current: number;
	};
}
interface Iuser {
	state: number;
}
interface banners {
	id: string;
	name: string;
	slug: string;
}
interface urlParam {
	banner?: string;
	origin?: string;
	testing?: boolean;
}
export { IshellOptions, Icontent, IssuesList, Imatrix, Istate, Iuser };
