import { useState } from "react";
import { useLogin, useRegister } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

/*
 * Authentication page component
 */
export default function Auth() {
  // State to toggle between login and registration forms
  // Checks if the register form should be displayed
  const [isRegister, setIsRegister] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // State to hold form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  // State to hold server error messages
  const [serverError, setServerError] = useState("");

  // Highlight input field if there's an error
  const inputClass = (hasError?: string) =>
    hasError ? "input border-red-500 focus:ring-red-500" : "input";

  // const isLoading = login.isPending || register.isPending;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Hooks for login and registration mutations
  const login = useLogin();
  const register = useRegister();
  const navigate = useNavigate();

  // Loading state for form submission
  const isLoading = login.isPending || register.isPending;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic email validation
    if (!form.email.includes("@")) {
      newErrors.email = "Invalid email";
    }

    // Password strength validation
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!strongPasswordRegex.test(form.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, number, and special character";
    }

    // Additional validations for registration form
    if (isRegister) {
      if (!form.firstName) newErrors.firstName = "First name required";
      if (!form.lastName) newErrors.lastName = "Last name required";
    }

    // Update error state
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    // Handle form submission for registration
    if (isRegister) {
      register.mutate(form, {
        // On successful registration, switch to login form
        onSuccess: () => setIsRegister(false),

        // Set server error message on registration failure
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };

          // Set server error message from response or default message
          setServerError(
            axiosError?.response?.data?.message || "Registration failed",
          );
        },
      });
      // Handle form submission for login
    } else {
      login.mutate(
        {
          email: form.email,
          password: form.password,
        },
        {
          // On successful login, store token and navigate to home page
          onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            navigate("/");
          },
          // Set server error message on login failure
          onError: (error: unknown) => {
            const axiosError = error as {
              response?: { data?: { message?: string } };
            };

            // Set server error message from response or default message
            setServerError(
              axiosError?.response?.data?.message ||
                "Invalid email or password",
            );
          },
        },
      );
    }
  };

  return (
    <div className="page">
      <form onSubmit={handleSubmit} className="card w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center">
          {isRegister ? "Create Account" : "Login"}
        </h1>

        {isRegister && (
          <>
            <input
              name="firstName"
              placeholder="First name"
              className={inputClass(errors.firstName)}
              value={form.firstName}
              onChange={handleChange}
            />
            {/*
             * Display first name error message
             */}
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}

            <input
              name="lastName"
              placeholder="Last name"
              className={inputClass(errors.lastName)}
              value={form.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </>
        )}

        <input
          name="email"
          placeholder="Email"
          className={inputClass(errors.email)}
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          className={inputClass(errors.password)}
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        {serverError && (
          <p className=" text-red-600 text-sm text-center">{serverError}</p>
        )}

        <button className="btn w-full" disabled={isLoading}>
          {isLoading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>

        {/* Toggle between login and registration forms*/}
        <p className="text-sm text-center">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 underline"
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
                className="text-blue-600 underline"
                onClick={() => setIsRegister(true)}
              >
                Create account
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
