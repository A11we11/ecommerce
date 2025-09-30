import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import type { currentSelectedProps, RootState } from "@/types";
import { useAppDispatch } from "@/hooks/redux";
import { fetchCartItems } from "@/store/shop/cart-slice";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state: RootState) => state.shopCart);
  const { user } = useSelector((state: RootState) => state.auth);
  const { approvalURL } = useSelector((state: RootState) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] =
    useState<currentSelectedProps | null>(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "currentSelectedAddress");
  console.log(cartItems, "cartItems"); // Add this if you want to log cart items

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice && currentItem.salePrice > 0
              ? currentItem.salePrice
              : currentItem.price) *
              currentItem.quantity,
          0
        )
      : 0;
  /*  cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0; */

  function handleInitiatePaypalPayment() {
    console.log("🚀 Starting payment process...");

    if (!cartItems.items || cartItems.items.length === 0) {
      console.log("❌ Cart is empty");
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      console.log("❌ No address selected");
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    console.log("✅ Validation passed");
    console.log("📦 Cart items:", cartItems.items);
    console.log("📍 Selected address:", currentSelectedAddress);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          /*  singleCartItem?.salePrice > 0 */
          singleCartItem?.salePrice && singleCartItem.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    console.log("📤 Sending order data:", orderData);

    dispatch(createNewOrder(orderData)).then((data: any) => {
      console.log("📥 Order creation response:", data);
      if (data?.payload?.success) {
        console.log("✅ Order created successfully");
        console.log("🔗 Approval URL:", data?.payload?.approvalURL);
        setIsPaymentStart(true);
      } else {
        console.log("❌ Order creation failed:", data?.payload);
        setIsPaymentStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
