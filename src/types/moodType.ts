import { messageType } from './messageType';
import { userInfoType } from './userType';
import { likeType } from './likeType';
export interface moodType {
	content?: string;
	createAt?: string;
	updatedAt?: string;
	images?: string | Array<string>;
	isOpen?: number;
	isTop?: number;
	id?: number;
	user_id?: number | string;
	user?: Array<userInfoType>;
	message?: Array<messageType>;
	like: Array<likeType>;
}
