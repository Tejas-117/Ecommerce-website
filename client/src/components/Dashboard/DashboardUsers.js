import "./DashboardUsers.css";

function DashboardUsers({ allUsers, setMessage, resetMessage }) {
  
  async function handleClick(e, user){
    const a = e.target.closest('p');
    const selectedRole = a.querySelector("#choose_role").value;
    
    if(user.user_role !== selectedRole){
      const response = await fetch(`/api/v1/users/user-roles/${user.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_role: selectedRole })
      });

      const { data, error } = await response.json();

      if(error){
        setMessage("Couldn't change user role");
        resetMessage();
      }
      else{
        setMessage(data.message);
        resetMessage(true);
      }
    }    
  }
  
  return (
    <div className="dashboard_users_container">
      {
        allUsers.map((user) => (
          <div className="dashboard_user"  key={user.id}>
            <p>USER # <span>{user.id}</span></p>
            <p>NAME <span>{user.name}</span></p>
            <p>EMAIL <span>{user.email}</span></p>
            <p>USER ROLE <span>{user.user_role}</span></p>
            <p>
              CHANGE ROLES
              <select name="user_role" id="choose_role" defaultValue={user.user_role}>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
              <button onClick={(e) => handleClick(e, user)}>Change user role</button>
            </p>  
          </div>
        ))
      }
    </div>
  )
}

export default DashboardUsers;