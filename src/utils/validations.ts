export const validateEmail = (email: string): boolean => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const validatePassword = (password: string): boolean => {
  if (password.length < 8) return false;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  return passwordPattern.test(password);
};

export const validatePhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};
