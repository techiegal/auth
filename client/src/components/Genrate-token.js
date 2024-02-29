import axios from "axios";
import { useNavigate } from "react-router-dom";

function generateToken(refreshToken) {
  const config = {
    headers: {
      refreshtoken: "Bearer " + refreshToken,
    },
  };

  axios
    .get("http://localhost:3000/auth/refresh", config)
    .then((response) => {
      localStorage.setItem("accesstoken", response.data.accesstoken);

      return 1;
    })
    .catch((err) => {
      return 2;
    });
}

export default generateToken;
