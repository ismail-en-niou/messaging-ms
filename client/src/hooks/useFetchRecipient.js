import { useEffect, useState } from "react";
import { baseUrl, getfetch } from "../utils/services";

const useFetchRecipient = (currentChat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  // console.log(currentChat , user);
  useEffect(() => {
    if (!currentChat || !user || !Array.isArray(currentChat.members)) return;

    const recipientId = currentChat.members.find((member) => member !== user._id);
    if (recipientId) {
      const fetchRecipient = async () => {
        try {
            const resp = await getfetch(`${baseUrl}/users/find/${recipientId}`);
            if (resp.error) {
                setError(`Error: ${resp.error}`);
                return;
              }
              setRecipientUser(resp);
        } catch (error) {
          setError("Error fetching user.");
        }
      };
      fetchRecipient();
    }
  }, [currentChat, user]);

  return { recipientUser };
};

export default useFetchRecipient;
