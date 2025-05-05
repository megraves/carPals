import React, { useState, useEffect } from "react";
import "./AuthModal.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: Pick<User, "email" | "password">) => void;
  onSignup: (user: User) => void;
}

interface User {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onSignup,
}) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    const { name, email, phone, password, confirmPassword } = formData;
    if (isSignup) {
      setCanSubmit(
        !!name &&
          !!email &&
          !!phone &&
          !!password &&
          password === confirmPassword
      );
    } else {
      setCanSubmit(!!email && !!password);
    }
  }, [formData, isSignup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Signup failed");
          return;
        }

        const data = await response.json();
        localStorage.setItem("userId", data.userId);
        localStorage.setItem(
          "userSession",
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            loginTime: Date.now(),
          })
        );
        onSignup({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        });
        alert("Signup successful!");
      } catch (err) {
        console.error("Signup error:", err);
        setError("Signup failed. Please try again later.");
        return;
      }
    } else {
      // login
      localStorage.setItem(
        "userSession",
        JSON.stringify({
          email: formData.email,
          loginTime: Date.now(),
        })
      );
      onLogin({
        email: formData.email,
        password: formData.password,
      });
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <h2>{isSignup ? "Sign Up for CarPals" : "Log In to CarPals"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </>
          )}
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          {isSignup && (
            <>
              <label>Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </>
          )}
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={!canSubmit}>
            {isSignup ? "Create Account" : "Log In"}
          </button>
        </form>
        <p className="auth-toggle">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Log In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
