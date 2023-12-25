import { userInfoType } from './userType';

export interface likeType {
	content?: string;
	createAt?: string;
	updatedAt?: string;
	module?: number;
	createdAt?: string;
	id?: number;
	module_id?: number;
	user_id?: number;
	user?: Array<userInfoType>;
}
