import CheckoutForm from "./CheckoutForm/CheckoutForm";
import OrderDetails from "./OrderDetails/OrderDetails";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Order.css";

function Order() {
  return (
    <div className="order-page">
      <Header />
      <main className="main-content">
        <div className="checkout-container">
          <div className="checkout-form-container">
            <CheckoutForm />
          </div>
          <div className="order-details-container">
            <OrderDetails />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Order;
