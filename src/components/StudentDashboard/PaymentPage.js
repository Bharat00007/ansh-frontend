import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Extract event details from navigate()
  const { eventName, amount } = location.state || {};

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePayment = async () => {
    if (!currentUser) {
      alert("You must be logged in to purchase a ticket.");
      navigate("/login");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      const options = {
        key: "rzp_test_JDt5MVqg59i8us",
        amount: amount * 100,
        currency: "INR",
        name: "Event Ticket",
        description: `Ticket for ${eventName}`,
        image: "example.com/image/rzp.jpg",
        prefill: {
          email: currentUser?.email || "user@example.com",
          contact: "919900000000",
        },
        handler: async function (response) {
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);

          try {
            // ✅ Save registration details in Firestore
            await addDoc(collection(firestore, "registrations"), {
              userId: currentUser.uid,
              email: currentUser.email,
              eventName: eventName,
              amount: amount,
              paymentId: response.razorpay_payment_id,
              registeredAt: new Date().toISOString(),
            });

            navigate("/profile"); // Redirect after success
          } catch (error) {
            console.error("❌ Error saving registration:", error);
            alert("Error saving registration details.");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    };

    document.body.appendChild(script);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Payment for {eventName}</h2>
      <p>Amount: ₹{amount}</p>
      {currentUser ? (
        <button onClick={handlePayment} className="pay-button">Proceed to Payment</button>
      ) : (
        <p style={{ color: "red" }}>⚠️ Please log in to continue.</p>
      )}
    </div>
  );
}

export default PaymentPage;
