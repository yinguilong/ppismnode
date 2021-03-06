export class cookiehelper {
	_valItem: any;
	_res: any;
	_maxage:number= 86400 * 1000;
	constructor(valItem, response) {
		this._valItem = valItem;
		this._res = response;
		
	}
	set() {
		if (this._valItem == undefined || this._res == undefined) return;
		if(this._valItem.loginAccount!=undefined&&this._valItem.loginAccount!="")
		{
			this._res.cookie("ppismloginaccount", this._valItem.loginAccount, { maxAge: this._maxage });
		}
		if(this._valItem.id!=undefined&&this._valItem.id!="")
		{
			this._res.cookie("ppismid", this._valItem.id, { maxAge: this._maxage });
		}
		if(this._valItem.userName!=undefined&&this._valItem.userName!="")
		{
			this._res.cookie("ppismusername", this._valItem.userName, { maxAge: this._maxage });
		}
		if(this._valItem.headerImg!=undefined&&this._valItem.headerImg!="")
		{
			this._res.cookie("ppismheaderimg", this._valItem.headerImg, { maxAge: this._maxage });
		}
	}
    clear(){
        this._res.clearCookie("ppismloginaccount");
        this._res.clearCookie("ppismid");
        this._res.clearCookie("ppismusername");
        this._res.clearCookie("ppismheaderimg");
    }
}