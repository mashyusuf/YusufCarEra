import {
    createBrowserRouter,
  } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../page/Home/Home/Home";
import Login from "../page/login/Login";
import SignUp from "../page/singUp/SingUp";
import SearchResult from "../componenets/search result/SearchResult";
import PrivateRoute from "./PrivateRoute";
import MyCartItem from "../componenets/myCartItem/MyCartItem";
import MyPurchase from "../componenets/myBuyCollection/MyPurchase";

 export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      children:[
        {
            path:'/',
            element: <Home></Home>
        },
        {
            path:'/search',
            element: <SearchResult></SearchResult>
        },
        {
            path:'/myCart',
            element: <PrivateRoute><MyCartItem></MyCartItem></PrivateRoute>
        },
        {
            path:'/myPurchase',
            element: <PrivateRoute> <MyPurchase></MyPurchase> </PrivateRoute>
        },
        {
            path:'/login',
            element: <Login></Login>
        },
        {
            path:'/signUp',
            element:<SignUp></SignUp>
        },
      ]
    },
  ]);