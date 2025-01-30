export const baseUrl = "http://localhost:4242/api/v1";

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
