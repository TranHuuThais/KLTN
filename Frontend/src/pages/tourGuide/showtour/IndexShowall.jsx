import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Component PaymentList
const PaymentList = ({ payments }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
      {payments.map((payment, index) => (
        <div key={index} style={{ textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
          {payment.packageId?.image && (
            <img
              src={payment.packageId?.image}
              alt="Package Image"
              style={{ maxWidth: '100%', borderRadius: '8px' }}
            />
          )}
          <p>User: {payment.userId?.firstname || 'N/A'} {payment.userId?.lastname || 'N/A'}</p>
          <p>Package: {payment.packageId?.package_name || 'N/A'}</p>
          <p>Amount: {payment.amount || 'N/A'}</p>
        </div>
      ))}
    </div>
  );
};

// Component App (lấy dữ liệu từ API)
const App = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userid');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const url = `http://localhost:8001/api/user/userGuideId/${userId}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch payments. Status: ${response.status}`);
        }
        const data = await response.json();
        setPayments(data.payments || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPayments();
  }, [userId]);

  return (
    <div>
      <h1>Danh sách thanh toán</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <PaymentList payments={payments} />
      )}
    </div>
  );
};

// Component IndexShowall (nhận dữ liệu qua React Router)
const IndexShowall = () => {
  const location = useLocation();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const state = location.state || {};
    if (state.payments) {
      setPayments(state.payments);
    }
  }, [location.state]);

  return (
    <div className="payment-container">
      <h1>Danh sách thanh toán</h1>
      {payments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã đơn hàng</th>
              <th>Tên gói</th>
              <th>Số tiền</th>
              <th>Phương thức thanh toán</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id}>
                <td>{index + 1}</td>
                <td>{payment.order_id}</td>
                <td>{payment.packageId?.package_name || 'N/A'}</td>
                <td>{payment.amount}</td>
                <td>{payment.method}</td>
                <td>{payment.status}</td>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có dữ liệu thanh toán.</p>
      )}
    </div>
  );
};

export default App;
