import { useEffect, useState } from "react";
import API from "./services/api";
import UserTable from "./components/UserTable";
import UserForm from "./components/UserForm";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await API.get("/users");

      // Add firstName, lastName and department
      const departments = ["IT", "HR", "Finance", "Marketing", "Sales"];

      const updatedUsers = response.data.map((user) => {
        const names = user.name.split(" ");

        return {
          ...user,
          firstName: names[0],
          lastName: names.slice(1).join(" "),
          department:
            departments[Math.floor(Math.random() * departments.length)],
        };
      });

      setUsers(updatedUsers);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }


  async function deleteUser(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) return;

  try {
    await API.delete(`/users/${id}`);

    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);

    alert("User deleted successfully!");
  } catch (error) {
    alert("Failed to delete user.");
  }
}



async function addUser(user) {
  try {
    const response = await API.post("/users", user);

    const newUser = {
      id: users.length + 1,
      ...response.data,
    };

    setUsers([...users, newUser]);

    alert("User added successfully!");
  } catch (error) {
    alert("Failed to add user.");
  }
}

async function updateUser(updatedUser) {
  try {
    await API.put(`/users/${updatedUser.id}`, updatedUser);

    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );

    setUsers(updatedUsers);
    setEditUser(null);

    alert("User updated successfully!");
  } catch (error) {
    alert("Failed to update user.");
  }
}


const filteredUsers = users
  .filter((user) => {
    const text = search.toLowerCase();

    const matchesSearch =
      user.firstName.toLowerCase().includes(text) ||
      user.lastName.toLowerCase().includes(text) ||
      user.email.toLowerCase().includes(text);

    const matchesDepartment =
      departmentFilter === "" ||
      user.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  })
  .sort((a, b) => {
    if (sortOrder === "asc") {
      return a.firstName.localeCompare(b.firstName);
    }

    if (sortOrder === "desc") {
      return b.firstName.localeCompare(a.firstName);
    }

    return 0;
  });



  const indexOfLastUser = currentPage * itemsPerPage;
const indexOfFirstUser = indexOfLastUser - itemsPerPage;

const currentUsers = filteredUsers.slice(
  indexOfFirstUser,
  indexOfLastUser
);

const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);




  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (

    
    <div className="container">
      <h1 className="heading">User Management Dashboard</h1>

<div className="toolbar">
      <SearchBar search={search} setSearch={setSearch} />


      <select
  value={sortOrder}
  onChange={(e) => setSortOrder(e.target.value)}
  style={{ marginLeft: "10px", padding: "10px" }}
>
  <option value="">Sort</option>
  <option value="asc">First Name A-Z</option>
  <option value="desc">First Name Z-A</option>
</select>
      <select
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
        style={{ marginLeft: "10px", padding: "10px" }}
      >
        <option value="">All Departments</option>
        <option value="IT">IT</option>
        <option value="HR">HR</option>
        <option value="Finance">Finance</option>
        <option value="Marketing">Marketing</option>
        <option value="Sales">Sales</option>
      </select>
      <UserForm onAdd={addUser} editUser={editUser} onUpdate={updateUser} />

<div style={{ marginTop: "20px" }}>
  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  <span style={{ margin: "0 15px" }}>
    Page {currentPage} of {totalPages || 1}
  </span>

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages || totalPages === 0}
  >
    Next
  </button>

  <select
    value={itemsPerPage}
    onChange={(e) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
    }}
    style={{ marginLeft: "20px" }}
  >
    <option value={10}>10</option>
    <option value={25}>25</option>
    <option value={50}>50</option>
    <option value={100}>100</option>
  </select>
</div>
</div>



<UserTable
  users={currentUsers}
  onDelete={deleteUser}
  onEdit={setEditUser}
/>
    </div>
  );
}

export default App;