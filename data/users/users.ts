
import { API } from "../api";

export * from "./users";

export async function updateUserPreferences(token : string, preferences : any) {
    const response = await API.post('/user/update_preferences', preferences, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}