import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/redux";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      // const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      let orderId = null;
      try {
        const orderIdString = sessionStorage.getItem("currentOrderId");
        orderId = orderIdString ? JSON.parse(orderIdString) : null;
      } catch (error) {
        console.error("Error parsing orderId from sessionStorage:", error);
        orderId = null;
      }
      dispatch(capturePayment({ paymentId, payerId, orderId })).then(
        (data: any) => {
          if (data?.payload?.success) {
            sessionStorage.removeItem("currentOrderId");
            window.location.href = "/shop/payment-success";
          }
        }
      );
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
