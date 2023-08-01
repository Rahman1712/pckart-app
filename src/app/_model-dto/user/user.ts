import { FileHandle } from "../file-handle.model";
import { Address } from "./address";

export class User {
  id: number;
	fullname: string;
	email: string;
	mobile: string;
	username: string;
	password: string;
	role: string;
  image: any;
  imageName: string;
  imageType: string;
  enabled: boolean;
  nonLocked: boolean;

  addresses: Address[];
  last_logins: any[]

  userImage: FileHandle;
}
