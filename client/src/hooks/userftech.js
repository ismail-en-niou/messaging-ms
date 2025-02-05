import { useEffect, useState } from "react";
import { baseUrl, getfetch } from "../utils/services";

const userftech = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);
  const recipientId = chat?.chat?.members.find((id) => id !== user?._id);
  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;
      try {
        const resp = await getfetch(`${baseUrl}/users/find/${recipientId}`);
        if (resp.error) {
          setError(`Error: ${resp.error}`);
          return;
        }
        // console.log(resp);
        setRecipientUser(resp);
      } catch (err) {
        setError("Error fetching user.");
      }
    };
    if (recipientId) {
      getUser();
    }
  }, []);

  return { recipientUser, error };
};

export default userftech;