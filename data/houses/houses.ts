import { API } from '../api';

export async function listHouses(token : string) {
    const response = await API.get('/houses', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export async function showHouse(id : string, token : string) {
    const response = await API.get(`/houses/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response.data;
}