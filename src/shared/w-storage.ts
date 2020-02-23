import AsyncStorage from '@react-native-community/async-storage';
import { Constants } from './constants';

export class WStorage {

	static async multiGet(arg: string[]) {
		try {
			const value = await AsyncStorage.multiGet([arg[0], arg[1]]);
			return value;
		} catch (e) {
			console.log(`Storage.multiGet( arg: ${arg} ) error: ${e}'`);
		}
	}

	static async set(key: string, value: any) {
		try {
			await AsyncStorage.setItem(key, value);
		} catch (e) {
			console.log(`Storage.set(key: ${key}, value: ${value}) error: ${e}'`);
		}
	}

	static async appDataInstalled(): Promise<boolean> {
		try {
			const value = await AsyncStorage.getItem(Constants.wInit);
			if (value) {
				return true;
			}
			await AsyncStorage.setItem(Constants.wInit, "true");
			return false;
		} catch (e) {
			console.log(`Storage.appDataInstalled() key: ${Constants.wInit}) error: ${e}'`);
			return true;
		}
	}

	static async get(key: string, defaultValue?: string) {
		try {
			const value = await AsyncStorage.getItem(key);

			if (value !== null) {
				// value previously stored
				return value;
			}
			return defaultValue || '';
		} catch (e) {
			console.log(`Storage.get(key: ${key}, defalutValue: ${defaultValue}) error: ${e}'`);
			return defaultValue || '';
		}
	}

	static async setAsJson(key: string, value: any) {
		let data: any = {};
		if (typeof value === 'object') {
			data = JSON.stringify(value);
		} else {
			data = value;
		}
		await WStorage.set(key, data);
	}

	static async getAsJson(key: string) {
		const data = await WStorage.get(key);
		let value: any;
		if (data) {
			try {
				value = JSON.parse(data);
			} catch (e) {
				value = data;
			}
			return value;
		} else {
			return null;
		}
	}

	static async getAllStorageKeys() {
		return AsyncStorage.getAllKeys();
	}

	static clear(key: string) {
		if (key) {
			AsyncStorage.removeItem(key);
		}
	}

	static async clearAsyncStorage() {
		await AsyncStorage.clear();
	}

}
