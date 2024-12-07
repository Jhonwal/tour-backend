export const getToken = () => {
    const tokenStr = localStorage.getItem('token');
  
    if (!tokenStr) {
      return null;
    }
  
    const token = JSON.parse(tokenStr);
    const now = new Date();
  
    if (now.getTime() > token.expiry) {
      localStorage.removeItem('token');
      return null;
    }
  
    return token.value;
};
  