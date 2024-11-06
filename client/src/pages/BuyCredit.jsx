import React, { useContext, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Modal from "react-modal";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { assets, plans } from "../assets/assets";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

const BuyCredit = () => {
  const { backendUrl, loadCreditsData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); 
  const [selectedPlanId, setSelectedPlanId] = useState(null); 
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const openModal = (planId) => {
    setSelectedPlanId(planId); 
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPlanId(null); 
  };

  const handlePayment = async () => {
    if (!selectedPlanId) {
      console.error("No plan selected for payment");
      return;
    }
    
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        console.error("Card element not found");
        return;
      }
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.post(`${backendUrl}/api/user/payment`, { planId: selectedPlanId }, {
        headers: { token }
      });
      
      if (data.success && data.order && data.order.clientSecret) {
        const { clientSecret, paymentIntentId } = data.order;

        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name: user.fullName },
          },
        });

        if (error) {
          console.log("Payment error:", error);
          toast.error("Payment error. Please try again later.");
        } else {
          
          const verifyResponse = await axios.post(`${backendUrl}/api/user/verify-payment`, { paymentIntentId }, {
            headers: { token }
          });

          console.log(paymentIntentId)
          if (verifyResponse.data.success) {
            toast.success("Payment successful! Credits added.");
            loadCreditsData(); 
            navigate("/"); 
            closeModal();
          } else {
            toast.error("Payment verification failed. Please contact support.");
          }
        }
      } else {
        console.error("Error: clientSecret not found", data);
        toast.error("Error processing payment. Please try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] text-center pt-14 mb-10">
      <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent mb-6 sm:mb-10'>
        Choose the plan that's right for you
      </h1>
      <div className="flex flex-wrap justify-center gap-6 text-left ">
       
        {plans.map((plan, i) => (
          <div key={i} className="bg-white drop-shadow-md border rounded-lg py-12 px-8 text-gray-700 hover:scale-105 transition-all duration-500">
            <p className="mt-3 font-semibold ">{plan.id}</p>
            <p className="text-sm">{plan.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">${plan.price}</span>/{plan.credits} credits
            </p>
            <button
              onClick={() => openModal(plan.id)} 
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
              disabled={loading}
            >
              {loading ? "Processing..." : "Purchase"}
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Payment Modal"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
          <h2 className="text-xl font-semibold mb-4">Enter your payment details</h2>
          <CardElement className="p-4 border rounded mb-4" />
          <button
            onClick={handlePayment} 
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 transition duration-200"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
          <button
            onClick={closeModal}
            className="w-full text-red-600 mt-2"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BuyCredit;
