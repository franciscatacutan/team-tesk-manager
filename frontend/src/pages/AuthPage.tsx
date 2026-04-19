import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLogin } from "../features/auth/hooks/useLogin";
import { useRegister } from "../features/auth/hooks/useRegister";

import { Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";

export default function AuthPage() {
  const navigate = useNavigate();

  const login = useLogin();
  const register = useRegister();

  const [isRegister, setIsRegister] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const isLoading = login.isPending || register.isPending;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email.includes("@")) {
      newErrors.email = "Invalid email";
    }

    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isRegister) {
      if (!form.firstName) newErrors.firstName = "First name required";
      if (!form.lastName) newErrors.lastName = "Last name required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    if (isRegister) {
      register.mutate(form, {
        onSuccess: () => navigate("/teams"),
        onError: () => setServerError("Registration failed"),
      });
    } else {
      login.mutate(
        { email: form.email, password: form.password },
        {
          onSuccess: () => navigate("/teams"),
          onError: () => setServerError("Invalid credentials"),
        },
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl">
            {isRegister ? "Create account" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? "Enter your details to get started"
              : "Login to your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    name="firstName"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    name="lastName"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            {serverError && (
              <div className="text-red-600 text-sm text-center">
                {serverError}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait
                </span>
              ) : isRegister ? (
                "Create account"
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <p className="text-sm text-center mt-4">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setIsRegister(false)}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setIsRegister(true)}
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
