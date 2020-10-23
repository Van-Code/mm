export interface Poll {
	question: string;
	choices: string[];
	model: string;
	showResults: boolean;
	id: string;
}
export interface Choices {
	text: any;
	value: any;
}
