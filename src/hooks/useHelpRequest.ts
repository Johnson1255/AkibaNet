import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useHelpRequest = () => {
  const [comments, setComments] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { t } = useTranslation();

  const sendRequest = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id;
      if (!userId) throw new Error(t("help.noUserId"));

      const requestBody = {
        user_id: userId,
        date: new Date().toISOString(),
        description: comments,
      };

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/requests", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(t("help.failedRequest"));

      setSuccessMessage(t("help.successfullRequest"));
      setComments("");

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      if (error instanceof Error) {
        alert(t(error.message));
      } else {
        alert(t("help.error"));
      }
    }
  };

  return {
    comments,
    setComments,
    successMessage,
    sendRequest
  };
};
