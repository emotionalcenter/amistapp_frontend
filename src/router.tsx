import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

const router = createBrowserRouter([
  {
    path:"/",
    element:<App />,
    children:[
      { index:true, element:<Home /> },
      { path:"login", element:<Auth /> }
    ]
  }
]);

export default router;
