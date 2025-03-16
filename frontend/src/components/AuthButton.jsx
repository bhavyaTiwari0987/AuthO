import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";

export const AuthButton = () => {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    const sendToken = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        const res = await axios.post("https://autho-xn16.onrender.com/auth/callback", {
          token,
        });
        console.log("this is response", res);
      }
    };
    sendToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div className="page-container">
      {!isAuthenticated ? (
        <button  className="login-button" onClick={() => loginWithRedirect()}>Login</button>
      ) : (
        <div className="user-container">
          <p className="welcome-text">Welcome, {user.name}</p>
          <button
            className="logout-button"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
