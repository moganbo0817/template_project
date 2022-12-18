import axios,{AxiosRequestConfig, AxiosResponse, AxiosError}  from "axios";

const httpClient = axios.create({
    headers:{
        'Content-Type': 'application/json'
    }
});

httpClient.interceptors.request.use((config:AxiosRequestConfig)=>{
    const token = localStorage.getItem("token");
    if (token){
        if (!config.headers) {
            config.headers = {};
        }
        config.headers['Authorization'] = 'Bearer '+ token;
    }
    return config;
});

httpClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
      },
    (error: AxiosError) => {
        switch (error.response?.status) {
          case 401:
            window.location.href = "/";
            break
          default:
            break
        }
        return Promise.reject(error)
    }
)

export default httpClient;