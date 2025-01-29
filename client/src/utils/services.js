export const baseUrl = "https://studious-goldfish-9pwrwvp777x3qqq-4242.app.github.dev/api/v1/chat";

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
