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

const router = createBrowserRouter([
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
        path:'user',
        element: <Suspense fallback={'加载中'}><User/></Suspense> 
      }
    ]
  },
  {
    path:"/",
    element:<Entrance/>
  }
])

export default router