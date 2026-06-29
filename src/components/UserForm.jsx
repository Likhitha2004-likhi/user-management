import { useEffect, useState } from "react";

function UserForm({ onAdd, editUser, onUpdate }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "IT",
  });


  useEffect(() => {
  if (editUser) {
    setFormData(editUser);
  }
}, [editUser]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
  e.preventDefault();

  if (
    !formData.firstName ||
    !formData.lastName ||
    !formData.email
  ) {
    alert("Please fill all fields");
    return;
  }

  if (editUser) {
    onUpdate(formData);
  } else {
    onAdd(formData);
  }

  setFormData({
    firstName: "",
    lastName: "",
    email: "",
    department: "IT",
  });
}

  return (
    <form
      onSubmit={handleSubmit} className="form-container"
      style={{ marginTop: "20px", marginBottom: "20px" }}
    >
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
      />

      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <select
        name="department"
        value={formData.department}
        onChange={handleChange}
      >
        <option>IT</option>
        <option>HR</option>
        <option>Finance</option>
        <option>Marketing</option>
        <option>Sales</option>
      </select>

     <button type="submit" className="button">
  {editUser ? "Update User" : "Add User"}
</button>
    </form>
  );
}

export default UserForm;