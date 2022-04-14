import * as React from "react";
// import "./styles.css";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Link
} from "react-router-dom";

/**
 *
 * BEST explanation:
 *
 * https://www.robinwieruch.de/react-router-authentication/
 *
 *
 * https://codesandbox.io/s/react-router-dom-v6-auth-ig7z5?file=/src/App.js:0-2904
 *
 * https://stackoverflow.com/questions/70760793/react-router-dom-v6-auth
 *
 *
 * See also (typescript though):
 *
 * https://stackblitz.com/github/remix-run/react-router/tree/main/examples/auth?file=src%2FApp.tsx
 *
 * See also, better, though using Firebase but still relevant:
 *
 * https://www.freecodecamp.org/news/react-firebase-authentication-and-crud-operations/
 *
 */

const AuthContext = React.createContext({
  authed: false,
  login: () => {},
  logout: () => {}
});

function useAuth() {
  return React.useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [authed, setAuthed] = React.useState(false);

  const login = () => setAuthed(true);
  const logout = () => setAuthed(false);

  let value = { authed, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function RequireAuth({ children }) {
  const location = useLocation();
  const { authed } = useAuth();
  return authed ? children : <Navigate to="/" state={{ from: location }} />;
}

const AdminDashboard = () => 
  <div>
    <h1>AdminDashboard</h1>
  </div>
  ;
const UserDashboard = () => 
  <div>
    <h1>UserDashboard</h1>
  </div>
  ;

const Login = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const { from } = state || {};
  const { authed } = useAuth();
  console.log(`Login() authed: ${authed}`);

  return authed ? "" : (
    <>
      <h1>Login</h1>
      <button
        type="button"
        onClick={() => {
          login();
          navigate("/userDashboard",from);
        }}
      >
        Log in
      </button>
    </>
  );
};

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { authed } = useAuth();
  console.log(`Logout() authed: ${authed}`);

  return !authed ? "" : (
    <button
      type="button"
      onClick={() => {
        logout();
        navigate("/");
      }}
    >
      Log out
    </button>
  );
};

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>

      <BrowserRouter>
        <AuthProvider>
          <ul>
            <li>
              <Link to="/adminDashboard">Admin</Link>
            </li>
            <li>
              <Link to="/userDashboard">User</Link>
            </li>
          </ul>
          <Routes>
            <Route index element={<Login />} />
            <Route
              path="adminDashboard"
              element={
                <RequireAuth redirectTo="/">
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="userDashboard"
              element={
                <RequireAuth redirectTo="/">
                  <UserDashboard />
                </RequireAuth>
              }
            />
          </Routes>
        <Logout />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
