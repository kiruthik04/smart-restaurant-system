export const getOrderSessionId = () => {
  let sessionId = localStorage.getItem("orderSessionId");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("orderSessionId", sessionId);
  }

  return sessionId;
};

export const clearOrderSession = () => {
  localStorage.removeItem("orderSessionId");
};
