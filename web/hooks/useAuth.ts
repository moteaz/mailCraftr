import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  const { user, setUser } = useAuthContext(); // <- use context
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    // Save token
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("authUser", JSON.stringify(data.user));

    // Update global context
    setUser(data.user);

    return data;
  };

  return { login, user };
}
