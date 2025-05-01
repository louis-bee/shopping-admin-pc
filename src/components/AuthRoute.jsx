import { Navigate } from "react-router-dom";
import { message } from "antd";

export function AuthRoute ({children}) {
  const token = localStorage.getItem('token')
  if(token) {
    return <>{children}</>
  } else {
    message.warning('请先登录')
    return <Navigate to={'./'} replace />
  }
}