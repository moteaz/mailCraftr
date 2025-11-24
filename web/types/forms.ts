export interface CreateProjectForm {
  title: string;
  description: string;
  userEmails: string[];
}

export interface CreateUserForm {
  email: string;
  password: string;
  projectIds: string[];
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface FormErrors<T> {
  [K in keyof T]?: string;
}
