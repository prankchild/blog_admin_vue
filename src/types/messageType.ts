import { userInfoType } from './userType';

export interface messageType {
	content?: string;
	createAt?: string;
	updatedAt?: string;
	module?: number;
	module_id?: number;
	parent_id?: number;
	id?: number;
	user_id?: number | string;
	user?: userInfoType;
	children: Array<messageType>;
}
