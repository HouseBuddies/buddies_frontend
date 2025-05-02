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

export async function has_applyToJoin(house_id : string, user_id: string, token : string) {
    const response = await API.get(`/houses/${house_id}/join_request`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            user_id,
            house_id
        }
    });
    return response.data;
}

export async function applyToJoin(house_id : string, user_id: string, token : string) {
    const response = await API.post(`/houses/${house_id}/join`, {
        user_id,
        house_id
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response.data;
}

export async function removeApplyToJoin(house_id : string, user_id: string, token : string) {
    const response = await API.delete(`/houses/${house_id}/join`, {
        data: {
            user_id,
            house_id
        },
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}

export async function getUserHouses(user_id: string, token: string) {
    const response = await API.get(`/houses/living/${user_id}`, {
        params: {
            user_id
        },
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    console.log("User houses", response.data);
    return response.data;
}

export async function getHouseTasks(house_id: string, token: string) {
    const response = await API.get(`/houses/${house_id}/tasks`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    console.log("House tasks", response.data);
    return response.data;
}

export async function getHouseBills(house_id: string, token: string) {
    const response = await API.get(`/houses/${house_id}/bills`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    console.log("House bills", response.data);
    return response.data;
}