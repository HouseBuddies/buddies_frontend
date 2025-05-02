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

export async function addFavoriteHouse(house_id : string, user_id: string, token : string) {
    console.log("Adding favorite house", house_id, user_id, token);
    const response = await API.post(`/houses/${house_id}/favorite`, {
        user_id,
        house_id
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response.data;
}

export async function removeFavoriteHouse(house_id : string, user_id: string, token : string) {
    const response = await API.delete(`/houses/${house_id}/favorite`, {
        data: {
            user_id,
            house_id
        },
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    console.log(response.data);
    return response.data;
}

export async function getUserFavoriteHouses(user_id : string, token : string) {
    const response = await API.get(`/houses/${user_id}/favorite_houses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response.data;
}