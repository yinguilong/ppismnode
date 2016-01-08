export class UserDto {
	public Id: string;
	public UserName: string;
	constructor(public LoginAccount, public Password) {
	}
}