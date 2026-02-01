import { useState } from "react";
import { useLogin, useRegister } from "../auth/useAuth";

/*
 * Authentication page component
 */
export default function Auth() {
  // State to toggle between login and registration forms
  // Checks if the register form should be displayed
  const [isRegister, setIsRegister] = useState(false);

  const login = useLogin();
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    // Handle form submission for registration
    if (isRegister) {
      register.mutate({
        firstName: form.firstName?.value,
        lastName: form.lastName?.value,
        email: form.email.value,
        password: form.password.value,
      });
      // Handle form submission for login
    } else {
      login.mutate(
        {
          email: form.email.value,
          password: form.password.value,
        },
        {
          // On successful login, store the token in local storage
          onSuccess: (data) => {
            localStorage.setItem("token", data.token);
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

        {/* Show input fields for first name and last name if registering */}
        {isRegister && (
          <>
            <input
              name="firstName"
              placeholder="First name"
              className="input"
            />

            <input name="lastName" placeholder="Last name" className="input" />
          </>
        )}

        <input name="email" placeholder="Email" className="input" />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input"
        />

        <button className="btn w-full">
          {isRegister ? "Register" : "Login"}
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
