import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React from "react";
import Button from "../../components/button/Button";

interface CheckoutProps {
  id: string;
}

const Checkout = ({ id }: CheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePaymentSubmit = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/event/enrolled/${id}`,
      },
    });
    if (error.type === "card_error" || error.type === "validation_error") {
      alert(error.message);
    } else {
      alert("unexpected error");
    }
  };

  return (
    <div>
      <PaymentElement />
      <Button
        label="Submit"
        className="mt-2 w-full"
        onClick={(event) => handlePaymentSubmit(event)}
      >
        Pay
      </Button>
    </div>
  );
};

export default Checkout;
