import { useState } from "react";
import DropdownSearch from "../components/DropdownSearch";
import { useNavigate } from "react-router-dom";
const options = [
  {
    discount: 50,
    label: "[Coupon] Discount $50",
    value: "Coupon",
    type: "Fixed",
    category: "",
  },
  {
    discount: 200,
    label: "[Coupon] Discount $200",
    value: "Coupon",
    type: "Fixed",
    category: "",
  },
  {
    discount: 30,
    label: "[Coupon] Discount $30",
    value: "Coupon",
    type: "Fixed",
    category: "",
  },
  {
    discount: 10,
    label: "[Coupon] Discount 10%",
    value: "Coupon",
    type: "Percentage",
    category: "",
  },
  {
    discount: 20,
    label: "[Coupon] Discount 20%",
    value: "Coupon",
    type: "Percentage",
    category: "",
  },
  {
    discount: 5,
    label: "[Coupon] Discount 5%",
    value: "Coupon",
    type: "Percentage",
    category: "",
  },
  {
    discount: 10,
    label: "[On Top] Discount 10% Off on Clothing",
    value: "On Top",
    type: "Percentage",
    category: "clothing",
  },
  {
    discount: 5,
    label: "[On Top] Discount 5% Off on Clothing",
    value: "On Top",
    type: "Percentage",
    category: "clothing",
  },
  {
    discount: 25,
    label: "[On Top] Discount 25% Off on Clothing",
    value: "On Top",
    type: "Percentage",
    category: "clothing",
  },
  {
    discount: 200,
    label: "[On Top] Discount 200 Points",
    value: "On Top",
    type: "Fixed",
    category: "",
    maxDiscount: 20,
  },
  {
    discount: 500,
    label: "[On Top] Discount 500 Points",
    value: "On Top",
    type: "Fixed",
    category: "",
    maxDiscount: 20,
  },
  {
    discount: 50,
    label: "[On Top] Discount 50 Points",
    value: "On Top",
    type: "Fixed",
    category: "",
    maxDiscount: 20,
  },
  {
    discount: 10,
    label: "[Seasonal] 10 THB at every 100 THB",
    value: "Seasonal",
    type: "Fixed",
    category: "",
    every: 100,
  },
  {
    discount: 40,
    label: "[Seasonal] 40 THB at every 300 THB",
    value: "Seasonal",
    type: "Fixed",
    category: "",
    every: 300,
  },
  {
    discount: 15,
    label: "[Seasonal] 15 THB at every 100 THB",
    value: "Seasonal",
    type: "Fixed",
    category: "",
    every: 100,
  },
];
function Checkout() {
  const dataCart = JSON.parse(localStorage.getItem("dataCart"));
  const [orders, setOrders] = useState(dataCart ? dataCart : []);
  const [discount, setDiscount] = useState(0);
  const [campaigns, setCampaigns] = useState([]);
    const navigate = useNavigate();

  const handbleChange = (e) => {
    setCampaigns(e);

    const categoryTotal = calculateCategoryTotal();
    const totalPrice = calculateTotalPrice();

    calculateDiscount(e, totalPrice, categoryTotal);
  };

  const calculateCategoryTotal = () => {
    const categoryTotal = {};

    orders.forEach((product) => {
      if (categoryTotal[product.category]) {
        categoryTotal[product.category] += product.price * product.quantity;
      } else {
        categoryTotal[product.category] = product.price * product.quantity;
      }
    });

    return categoryTotal;
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    orders.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });

    return totalPrice;
  };

  const calculateDiscount = (discounts, price, category) => {
    let discountedPrice = price;
    console.log("category", category);
    // ลูปเพื่อคำนวณลดราคาตามลำดับ Coupon > On Top > Seasonal
    discounts.forEach((discount) => {
      if (discount.value === "Coupon" && discount.type === "Fixed") {
        discountedPrice -= discount.discount; // ลดราคาจาก Coupon แบบ Fixed
      }
      if (discount.value === "Coupon" && discount.type === "Percentage") {
        discountedPrice *= 1 - discount.discount / 100;
      }
    });

    discounts.forEach((discount) => {

      Object.keys(category).forEach((product) => {
          console.log("category[product]", product, discount.category);
        if (
          discount.value === "On Top" &&
          discount.type === "Percentage" &&
          product === discount.category
        ) {
          if (discountedPrice < category[discount.category]){
            console.log(
              "discountedPrice",
              discountedPrice * (1 - discount.discount / 100)
            );
             discountedPrice *= (1 - discount.discount / 100);
          } else{
            discountedPrice -=
              category[discount.category] -
              category[discount.category] * (1 - discount.discount / 100);
          // discountedPrice *= 1 - discount.discount / 100; // ลดราคาจาก On Top แบบ Percentage
        }}
      });
      if (discount.value === "On Top" && discount.type === "Fixed") {
        if (discountedPrice * 0.8 < discount.discount) {
          discountedPrice *= 1 - 20 / 100; // ลดราคาจาก On Top แบบ Fixed
        } else {
          discountedPrice -= discount.discount;
        }
      }
    });
    discounts.forEach((discount) => {
      if (discount.value === "Seasonal") {
        console.log((discountedPrice / discount.every) * discount.discount);
        discountedPrice -= Math.floor(discountedPrice / discount.every) * discount.discount; // ลดราคาจาก Seasonal
      }
    });

    setDiscount(discountedPrice);
    return discountedPrice;
  };

  return (
    <div className="container mx-auto p-4 md:w-1/2 h-screen">
      <h3 className="mb-4 text-lg font-semibold">Order summary</h3>
      <div className="ml-4 flex w-full justify-between">
        <p className="font-medium">list</p>
        <p className="font-medium mr-10">price</p>
      </div>
      <div className="h-3/5 overflow-auto">
        {orders?.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div className="flex w-full">
              <div className="px-4 flex w-full justify-between">
                <p className="w-5/6">
                  {product.title}
                  <label className="text-nowrap font-medium ml-1">
                    x {product.quantity}
                  </label>
                </p>
                <p className="text-nowrap w-1/6 text-right">
                  ${Math.floor(product.price) * product.quantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-4 flex gap-3 sm:flex-row flex-col sm:items-center">
        <p className="font-medium">Campaigns</p>
        <DropdownSearch
          data={options}
          handbleChange={handbleChange}
          campaigns={campaigns}
        />
      </div>
      <div className="px-4 mt-5 flex justify-between font-medium">
        <p>total</p>
        <p className="mr-5">{calculateTotalPrice().toFixed(2)}</p>
      </div>
      <div className="px-4 mt-5 flex justify-between font-medium">
        <p>Discount</p>
        <p className="mr-5 text-red-500">
          - $
          {discount == 0
            ? 0
            : calculateTotalPrice() - discount.toFixed(2) >
              calculateTotalPrice().toFixed(2)
            ? calculateTotalPrice().toFixed(2)
            : calculateTotalPrice() - discount.toFixed(2)}
        </p>
      </div>
      <div className="px-4 mt-2 flex justify-between text-xl font-medium">
        <p>Order total</p>
        <p className="mr-5">
          $
          {discount == 0
            ? calculateTotalPrice().toFixed(2)
            : discount.toFixed(2) < 0
            ? 0
            : discount.toFixed(2)}
        </p>
      </div>
      <button
        type="button"
        className="w-full mt-5 font-medium text-white py-1 px-2 bg-indigo-600 hover:bg-indigo-500 border rounded-md"
        onClick={() => navigate(-1)}
      >
        Checkout
      </button>
    </div>
  );
}

export default Checkout;
