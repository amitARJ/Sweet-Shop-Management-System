import React from "react";

const Profile = ({ user }) => {
  // Dummy order history data, replace with API call as needed
  const orderHistory = [];
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Unknown";

  return (
    <div className="dashboard-bg">
      <div className="welcome-section">
        <h1>My Profile</h1>
        <p>Manage your account and view order history</p>
      </div>
      <div className="profile-info-box">
        <form>
          <div className="profile-flex-box">
            <div>
              <label>Username</label>
              <input value={user?.username || ""} disabled />
            </div>
            <div>
              <label>Email</label>
              <input value={user?.email || ""} disabled />
            </div>
          </div>
          <div className="profile-flex-box">
            <div>
              <label>Role</label>
              <input value={user?.isAdmin ? "admin" : "user"} disabled />
            </div>
            <div>
              <label>Member Since</label>
              <input value={memberSince} disabled />
            </div>
          </div>
        </form>
      </div>
      <div className="profile-orders-box">
        <h2>Order History</h2>
        {orderHistory.length === 0 ? (
          <div className="profile-no-orders">
            <div style={{ textAlign: "center", opacity: 0.3 }}>
              <img src="/boximg.png" alt="No orders" width={150} />
              <div style={{ fontWeight: 600, marginTop: 5 }}>No orders yet</div>
              <div style={{ fontSize: "0.98em", color: "#bbb" }}>Start shopping to see your order history here!</div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Profile;
