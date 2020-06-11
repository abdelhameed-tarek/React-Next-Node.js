import React, { useState, useEffect } from "react";
import { Input } from "semantic-ui-react";
import { useRouter } from "next/router";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import cookie from "js-cookie";
import catchErrors from "../../utils/catchErrors";

function AddProductToCart({ user, productId }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleAddProductToCart = async () => {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/cart`;
      const payload = { quantity, productId };
      const token = cookie.get("token");
      const headers = { headers: { Authorization: token } };
      await axios.put(url, payload, headers);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timeout;
    if (success) {
      timeout = setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [success]);

  return (
    <Input
      type="number"
      min="1"
      placeholder="Quantity"
      value={quantity}
      onChange={(e) => setQuantity(Number(e.target.value))}
      action={
        user && success
          ? {
              color: "blue",
              content: "item added",
              icon: "plus cart",
              disabled: true,
            }
          : user
          ? {
              color: "orange",
              content: "Add To Cart",
              icon: "plus cart",
              loading,
              disabled: loading,
              onClick: handleAddProductToCart,
            }
          : {
              color: "blue",
              content: "Signup to purchase",
              icon: "signup",
              onClick: () => router.push("/signup"),
            }
      }
    />
  );
}

export default AddProductToCart;
