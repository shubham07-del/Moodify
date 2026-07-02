import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { loading, user, handleLogin } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
  };

  if (loading) {
    return <Loader variant="spinner" size="md" label="Loading" />;
  }

  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[#141310] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Mark */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-8 h-8 rounded-md bg-[#e8823c] flex items-center justify-center">
            <Lock className="w-4 h-4 text-[#141310]" strokeWidth={2.5} />
          </div>
          <span className="text-[#f2ede4] font-semibold tracking-tight text-lg">
            Moodify
          </span>
        </div>

        <div className="bg-[#1c1a16] border border-[#2c2822] rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h1 className="text-2xl font-semibold text-[#f2ede4] tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-[#8a8377] mt-1.5 mb-8">
            Sign in to pick up where you left off.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[#a39c8c] mb-1.5 uppercase tracking-wide"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6b6558] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full bg-[#141310] border rounded-lg py-2.5 pl-10 pr-3.5 text-[#f2ede4] placeholder-[#5c574b] text-sm
                    focus:outline-none focus:ring-2 focus:ring-[#e8823c]/40 focus:border-[#e8823c] transition-colors
                   `}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-[#e0736b] mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-[#a39c8c] uppercase tracking-wide"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-[#141310] border rounded-lg py-2.5 pl-3.5 pr-10 text-[#f2ede4] placeholder-[#5c574b] text-sm
                    focus:outline-none focus:ring-2 focus:ring-[#e8823c]/40 focus:border-[#e8823c] transition-colors
                    `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6558] hover:text-[#a39c8c] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#e0736b] mt-1.5">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#e8823c] hover:bg-[#f2985a] disabled:opacity-60 disabled:cursor-not-allowed
                text-[#141310] font-semibold text-sm rounded-lg py-2.5 mt-2 flex items-center justify-center gap-2
                transition-colors group"
            >
              {submitting ? "Signing in…" : "Sign in"}
              {!submitting && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#6b6558] mt-6">
          Don't have an account?{" "}
          <Link className="text-md text-white/80 underline" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
