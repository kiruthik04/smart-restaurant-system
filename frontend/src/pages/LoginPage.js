import { useState } from "react";
import { login } from "../api/authApi";
import { saveAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      saveAuth(res.data.token, res.data.role);

      // Redirect based on role
      if (res.data.role === "ADMIN") navigate("/admin/tables");
      else if (res.data.role === "KITCHEN") navigate("/kitchen");
      else navigate("/order");

    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
