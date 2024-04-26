import { useRoutes } from "react-router-dom";
import ProductList from "./pages/ProductList";
import Checkout from "./pages/Checkout";

function App() {
  const element = useRoutes([
    { path: "/", element: <ProductList /> },
    { path: "/checkout", element: <Checkout /> },
    // { path: "/edit/:id", element: <UserEdit /> },
  ]);

  return element;
}

export default App;
