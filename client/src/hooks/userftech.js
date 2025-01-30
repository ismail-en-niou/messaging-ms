import { useEffect, useState } from "react";
import { baseUrl, getfetch } from "../utils/services"; // ✅ Ensure getfetch is imported

const userftech = (chat, user) => {  
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Debugging: Check if chat is received properly
//   console.log("Chat data:", chat);

  // ✅ Prevent error if chat is undefined/null
  if (!chat || !chat.members) {
    console.error("Invalid chat object:", chat);
    return { recipientUser, error: "Invalid chat object" };
  }

  const recipientId = chat.members.find((id) => id !== user?._id); // ✅ Used strict equality (!==)

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return;

      try {
        const resp = await getfetch(`${baseUrl}/users/find/${recipientId}`);

        if (resp.error) {
          setError(`Error: ${resp.error}`);
          return;
        }
        console.log("test +++++++++++" +JSON.parse(resp));
        setRecipientUser(resp);
      } catch (err) {
        setError("Error fetching user.");
      }
    };

    getUser();
  }, [recipientId]);

  return { recipientUser, error };
};

export default userftech;
