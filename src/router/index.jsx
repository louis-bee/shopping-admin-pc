import Layout from "@/pages/layout/Layout.jsx";
import Entrance from "@/pages/entrance/Entrance.jsx"

import { createBrowserRouter } from "react-router-dom";
import { AuthRoute } from "@/components/AuthRoute";  //路由守卫
import { lazy, Suspense } from "react";

const Show = lazy(()=> import("@/pages/layout/components/show/Show.jsx"))
const Goods = lazy(()=> import("@/pages/layout/components/goods/Goods.jsx"))
const Edit = lazy(()=> import("@/pages/layout/components/edit/Edit.jsx"))
const Order = lazy(()=> import("@/pages/layout/components/order/Order.jsx"))
const User = lazy(()=> import("@/pages/layout/components/user/User.jsx"))
const LoginLog = lazy(()=> import("@/pages/layout/components/login-log/LoginLog.jsx"))
const ActionLog = lazy(()=> import("@/pages/layout/components/action-log/ActionLog.jsx"))

const router = createBrowserRouter([
  {
    path:"/",
    element:<Entrance/>
  },
  {
    path:"/layout",
    element: <AuthRoute><Layout/></AuthRoute>,
    children: [
      {
        index:true,
        // path:'/',
        element: <Suspense fallback={'加载中'}><Show/></Suspense> 
      },
      {
        path:'user',
        element: <Suspense fallback={'加载中'}><User/></Suspense> 
      },
      {
        path:'goods',
        element: <Suspense fallback={'加载中'}><Goods/></Suspense> 
      },
      {
        path:'edit',
        element: <Suspense fallback={'加载中'}><Edit/></Suspense> 
      },
      {
        path:'order',
        element: <Suspense fallback={'加载中'}><Order/></Suspense> 
      },
      {
        path:'login-log',
        element: <Suspense fallback={'加载中'}><LoginLog/></Suspense> 
      },
      {
        path:'action-log',
        element: <Suspense fallback={'加载中'}><ActionLog/></Suspense> 
      }
    ]
  },

])

export default router