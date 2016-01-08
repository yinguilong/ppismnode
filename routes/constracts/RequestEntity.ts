export class RequestEntity {
	public Name: string;
	public Count: number;
	public Items: any[];
	constructor(name, count, items) {
		this.Name = name;
		this.Count = count;
		this.Items = items;
	}
}