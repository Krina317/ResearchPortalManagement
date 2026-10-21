import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const FORGE = [
  ["F", "Faculty"],
  ["O", "Outreach", "MoUs"],
  ["R", "Research", "Conference, journal & book chapters"],
  ["G", "Grants", "Projects"],
  ["E", "Engagements", "Consultancy"],
];

export default function Login() {
  const { user, loading, loginWithGoogle, loginMock, MOCK } = useAuth();
  const btnRef = useRef(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user || !CLIENT_ID || MOCK) return;

    const init = () => {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async ({ credential }) => {
          setError("");
          setBusy(true);
          try {
            await loginWithGoogle(credential);
          } catch (e) {
            setError(e.message);
          } finally {
            setBusy(false);
          }
        },
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 300,
      });
    };

    if (window.google?.accounts?.id) return init();

    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = init;
    document.body.appendChild(s);
  }, [user, loginWithGoogle, MOCK]);

  if (!loading && user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white">
      {/* Brand side */}
      <div className="bg-emerald-700 text-white p-10 md:p-16 flex flex-col justify-center">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight">FORGE</h1>
        <p className="mt-3 text-emerald-100">Nirma University activity portal</p>

        <dl className="mt-12 space-y-4 max-w-sm">
          {FORGE.map(([letter, word, sub]) => (
            <div key={letter} className="flex items-baseline gap-4">
              <dt className="text-3xl font-bold w-8 text-emerald-300">{letter}</dt>
              <dd>
                <span className="font-semibold">{word}</span>
                {sub && <span className="block text-sm text-emerald-100">{sub}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Sign-in side */}
      <div className="p-10 md:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Sign in</h2>
          <p className="mt-2 text-sm text-gray-500">
            Use your Nirma University Google account. Access is limited to registered faculty.
          </p>

          {MOCK ? (
            <button
              onClick={loginMock}
              className="mt-8 flex items-center justify-center gap-3 w-[300px] h-10 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
                <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/>
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          ) : (
            <div className="mt-8 min-h-[44px]" ref={btnRef} />
          )}

          {busy && <p className="mt-4 text-sm text-gray-500">Checking your account…</p>}
          {!CLIENT_ID && !MOCK && (
            <p className="mt-4 text-sm text-amber-700">
              Google client ID is missing. Set REACT_APP_GOOGLE_CLIENT_ID and restart.
            </p>
          )}
          {error && (
            <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}