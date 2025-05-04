import axios from "axios"
import { useEffect } from "react"

const Show = () => {

  useEffect(()=>{

    const res = axios.post(`${import.meta.env.VITE_API_URL}/`,{},{
      headers:{
        Authorizon: localStorage.getItem('token')
      }
    })
    console.log(res.data);
    
  },[])

  return <div>数据展示页</div>
}
export default Show