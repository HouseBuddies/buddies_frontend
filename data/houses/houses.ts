import { API } from '../api';

export async function listHouses(token: string) {
    const response = await API.get('/houses', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export async function showHouse(id: string, token: string) {
    const response = await API.get(`/houses/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response.data;
}

export async function addFavoriteHouse(house_id: string, user_id: string, token: string) {
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

export async function removeFavoriteHouse(house_id: string, user_id: string, token: string) {
    const response = await API.delete(`/houses/${house_id}/favorite`, {
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

export async function getUserFavoriteHouses(user_id: string, token: string) {
    const response = await API.get(`/houses/${user_id}/favorite_houses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    return response.data;
}

export async function has_applyToJoin(house_id: string, user_id: string, token: string) {
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

export async function applyToJoin(house_id: string, user_id: string, token: string) {
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

export async function removeApplyToJoin(house_id: string, user_id: string, token: string) {
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
    return response.data;
}

export async function getHouseTasks(house_id: string, token: string) {
    const response = await API.get(`/houses/${house_id}/tasks`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}

export async function getHouseBills(house_id: string, token: string) {
    const response = await API.get(`/houses/${house_id}/bills`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}

export async function getHouseActivities(house_id: string, token: string) {
    const response = await API.get(`/houses/${house_id}/activities`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}

export async function updateTask(task_id: string, finished: boolean, token: string) {
    const response = await API.put(`/tasks/${task_id}`, {
        finished
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}

export async function listRankedHouses(token: string, location: string) {
    const response = await API.get('/houses/ranked', {
        params: { "location": location },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export async function createHouseActivity(house_id: string, user_id: string, activity: { title: string; description: string; start_date: string; end_date: string }, token: string) {
    const response = await API.post(`/houses/${house_id}/activities`, {
        activity,
        created_by_id: user_id
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return response.data;
}

export async function createHouseTask(house_id: string, user_id: string, task: { title: string; description: string; due_date: string }, token: string) {
    const response = await API.post(`/houses/${house_id}/tasks`, {
        task,
        creator_id: user_id
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return response.data;
}


export async function listHouseProducts(house_id: string, token: string) {
    const response = await API.get(`/houses/${house_id}/products`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    console.log("House products", response.data);
    return response.data;
}

export async function updateShoppingItemState(house_id: string, item_id: string, state: string, user_id: string, token: string) {
    const response = await API.put(`/houses/${house_id}/products/${item_id}`, { state: state, user_id: user_id }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    console.log("Update shopping item state", response.data);
    return response.data;
}

export async function createHouseProduct(house_id: string, payload: { created_by: string, name: string; quantity: number; description?: string }, token: string) {
    console.log(token);
    const response = await API.post(`/houses/${house_id}/products`, {
        payload
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    console.log("Create house product", response.data);
    return response.data;
}

export async function getHouseMatchScore(house_id: string, token: string) {
    const response = await API.get(`/houses/${house_id}/score`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data["match_score"];
}