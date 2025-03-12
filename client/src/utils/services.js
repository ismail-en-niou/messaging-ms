export const baseUrl = "http://localhost:4243/api/v1";

export const getfetch = async (baseUrl)=>{
    const response = await fetch(baseUrl);
    const data = await response.json();
    if (!response)
    {
        let message = "An error occured ...";
        if (data?.message)
            message.data.message;
        return {error: true , message };
    }
    return data;
}

export const postfetch = async (baseUrl, payload) => {
    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            let message = "An error occurred ...";
            if (data?.message) {
                message = data.message;
            }
            return { error: true, message };
        }
        
        return data;
    } catch (error) {
        return { error: true, message: error.message };
    }
};