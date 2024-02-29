import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Dashboard() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accesstoken");
  const refreshToken = localStorage.getItem("refreshtoken");
  useEffect(() => {
    const api = axios.create({
      baseURL: "http://localhost:3000",
    });

    if (!accessToken || !refreshToken) {
      navigate("/login");
      return;
    }
    api.interceptors.request.use(
      (config) => {
        config.headers["accesstoken"] = `Bearer ${accessToken}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await axios.get(
              "http://localhost:3000/auth/refresh",
              {
                headers: {
      
                  refreshtoken: `Bearer ${refreshToken}`,
                },
              }
            );
            const newAccessToken = response.data.accesstoken;
            localStorage.setItem("accesstoken", newAccessToken);
            originalRequest.headers["accesstoken"] = `Bearer ${newAccessToken}`;
            return api(originalRequest); 
          } catch (error) {
            navigate("/login");
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );


    api
      .get("/user/dashboard")
      .then(() => {

      })
      .catch((error) => {
  
      });
  }, [navigate, accessToken, refreshToken]);

  const handleClick = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div>Dashboard</div>
      <button onClick={handleClick}>Logout</button>
    </>
  );
}

export default Dashboard;
