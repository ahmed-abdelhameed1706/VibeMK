export const validatePassword = (password, confirmPassword) => {
  if (password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters long",
    };
  }

  const passwordPattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`|-]).{6,}$/;
  if (!passwordPattern.test(password)) {
    return {
      success: false,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match",
    };
  }
  return null;
};
