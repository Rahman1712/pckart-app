export class OrderAddress{
  id: number;
	fullname: string;
	houseno: string;
	place: string;
	city: string;
	post: string;
	pincode: string;
	state: string;
	country: string;
	contact: string;
	alternative_contact: string;

	constructor(fullname:string,houseno:string,place:string,city: string, post:string, pincode:string, state:string, country:string,contact: string,alternative_contact:string){
		this.fullname = fullname;
		this.houseno = houseno;
		this.place = place;
		this.city = city;
		this.post = post;
		this.pincode = pincode;
		this.state = state;
		this.country = country;
		this.contact = contact;
		this.alternative_contact = alternative_contact;
	}
}