export const validators = {
  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  password: (password: string, minLength = 6): boolean => {
    return password.length >= minLength;
  },
};

export const validationMessages = {
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
  },
  password: {
    required: 'Password is required',
    tooShort: (min: number) => `Password must be at least ${min} characters`,
  },
} as const;
