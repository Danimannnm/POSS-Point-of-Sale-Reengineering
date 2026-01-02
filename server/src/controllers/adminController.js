import Employee from "../models/Employee.js";

// Get all employees
export async function getEmployees(req, res) {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Add employee
export async function addEmployee(req, res) {
  try {
    const { name, username, password, position } = req.body;
    const newEmp = new Employee({ name, username, password, role: position });
    await newEmp.save();
    res.status(201).json(newEmp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update employee
export async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const { name, username, password, position } = req.body;
    const emp = await Employee.findById(id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    emp.name = name;
    emp.username = username;
    emp.password = password;
    emp.role = position;
    await emp.save();
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Delete employee
export async function removeEmployee(req, res) {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Logout
export function logout(req, res) {
  res.json({ message: "Logged out" });
}

// Hardcoded login
export function login(req, res) {
  // Read credentials from common places and normalize
  const body = req.body || {};
  const usernameRaw = (body.username || body.user?.username || req.query.username || "").toString();
  const passwordRaw = (body.password || body.user?.password || req.query.password || "").toString();
  const roleInputRaw = (body.role || req.query.role || "").toString(); // <-- accept role from client

  // Trim and normalize
  const username = usernameRaw.trim();
  const password = passwordRaw.trim();
  const roleInput = roleInputRaw.trim();

  console.log(`\n🔐 Login attempt:`);
  console.log(`  Username: ${username || '(missing)'}`);
  console.log(`  Password: ${password ? '***' : '(missing)'}`);
  console.log(`  Role: ${roleInput || '(not specified)'}`);

  if (!username || !password) {
    console.warn("❌ Login failed: Missing credentials");
    return res.status(400).json({ message: "username and password required" });
  }

  // Hardcoded users (keep them here for dev/testing)
  const users = [
    { username: "admin", password: "admin123", role: "Admin" },
    { username: "cashier", password: "cashier123", role: "Cashier" }
  ];

  // compare username case-insensitively and trimmed password
  const user = users.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (user) {
    // If client provided a role, ensure it matches the user's role
    if (roleInput && roleInput !== user.role) {
      console.warn(`❌ Login failed: Role mismatch for '${username}' - Expected: ${user.role}, Got: ${roleInput}`);
      return res.status(401).json({ message: "Role does not match credentials" });
    }

    console.log(`✓ Login successful: ${username} (${user.role})\n`);
    
    // Return both shapes so different frontend expectations are satisfied
    return res.json({
      user: { username: user.username, role: user.role },
      role: user.role
    });
  } else {
    console.warn(`✗ Login failed: Invalid credentials for '${username}'\\n`);
    return res.status(401).json({ message: "Invalid credentials" });
  }
}

// Route alias for /users/login
export function loginAlias(req, res) {
  return login(req, res);
}
