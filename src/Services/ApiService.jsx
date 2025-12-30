import AppSetting from '../Services/Appsetting'

let baseUrl = AppSetting.baseUrl

const token = JSON.parse(localStorage.getItem("Apikey"))

const ExecutePost = async (url, data) => {
    const token = JSON.parse(localStorage.getItem("Apikey"))
    try {
        let path = baseUrl + url;

        let headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(path, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};


const ExecutePatch = async (url, data, isFormData = false) => {
    const token = JSON.parse(localStorage.getItem("Apikey"))
    try {
        let path = baseUrl + url;
        let headers = {};
        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(path, {
            method: "PATCH",
            headers,
            body: isFormData ? data : JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

const ExecuteDelete = async (url, data) => {
    const token = JSON.parse(localStorage.getItem("Apikey"))
    try {
        let path = baseUrl + url;

        let headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(path, {
            method: "DELETE",
            headers: headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

const ExecutePostForm = async (url, data, FormData = false) => {
    const token = JSON.parse(localStorage.getItem("Apikey"))
    try {
        let path = baseUrl + url;

        if (!token) throw new Error("Authorization token is missing!");

        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: FormData ? data : JSON.stringify(data),
        });
        // Set Content-Type only for JSON data
        if (!FormData) {
            options.headers["Content-Type"] = "application/json";
        }


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error; // Rethrow to handle it properly in the calling function
    }
};

const ExecuteGet = async (url) => {
    const token = JSON.parse(localStorage.getItem("Apikey"))
    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer` + " " + token
            },
            // credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return error;
    }
};




export {
    ExecutePost,
    ExecuteGet,
    ExecutePostForm,
    ExecutePatch,
    ExecuteDelete
}
