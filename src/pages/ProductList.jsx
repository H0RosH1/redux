import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProduct } from "../slice/productSlice";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  const handleAddCart = (item) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity || 0) + 1,
        };
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            ...item,
            quantity: 1,
            price: Math.floor(item.price),
            category:
              item.category == "women's clothing" ||
              item.category == "men's clothing" ? "clothing" : item.category,
          },
        ];
      }
    });
  };

  const handleCheckOut = () => {
    localStorage.setItem("dataCart", JSON.stringify(cart));
    if (cart.length) navigate(`/checkout`);
  };

  useEffect(() => {
    console.log(cart);
    setTotalPrice(cart.reduce((accumulator, currentItem) => {
  return (
    accumulator +
    Math.floor(currentItem.price) * currentItem.quantity
  );
}, 0));
  }, [cart]);

  return (
    <div className="container mx-auto p-4 md:w-1/2 relative">
      <h3 className="mb-4 text-lg font-semibold">Product List</h3>
      {!loading ? (
        <div className="h-24">
          {products?.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b py-2"
            >
              <div className="flex w-full relative">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={product.image}
                    alt={product.category}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col w-full">
                  <p className="font-medium text-lg">{product.title}</p>
                  <p className="text-zinc-500">{product.category}</p>
                  <p className="font-medium my-2">
                    ${Math.floor(product.price)}
                  </p>
                  <button
                    type="button"
                    className="font-medium text-white py-1 px-2 bg-indigo-600 hover:bg-indigo-500 border rounded-md sm:absolute sm:bottom-0 sm:right-0"
                    onClick={() => handleAddCart(product)}
                  >
                    add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="sticky bottom-0 w-full mx-auto p-4 bg-white">
            <div className="flex justify-between py-2">
              <p className="font-medium text-lg">Order total</p>
              <p className="font-medium text-lg">$ {totalPrice}</p>
            </div>
            <button
              type="button"
              className="w-full mt-2 font-medium text-white py-1 px-2 bg-indigo-600 hover:bg-indigo-500 border rounded-md"
              onClick={() => handleCheckOut()}
            >
              Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          <div
            className="inline-block h-8 w-8 animate-spin text-indigo-600 rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
