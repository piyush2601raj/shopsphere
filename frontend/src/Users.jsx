import { useEffect, useState } from "react";
import API from "./api";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/users/all")
      .then((res) => {
        console.log(res.data);
        setUsers(res.data.data); // 🔥 main data
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  return (
    <div>
      <h2>Users List</h2>

      {users.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            margin: "10px",
          }}
        >
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>Role: {user.role}</p>
          <p>Cart Items: {user.cart.items.length}</p>
          <p>Total: ₹{user.cart.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}

export default Users;