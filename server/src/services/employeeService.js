import Employee from "../models/Employee.js";

// Get all employees
export async function getEmployees() {
  // try the typical query + sort; if Employee.find().sort isn't available (mock returns array),
  // fall back to awaiting find() result and sort in-memory.
  try {
    const maybeQuery = Employee.find();
    // if the query has a sort method, use it
    if (maybeQuery && typeof maybeQuery.sort === "function") {
      return await maybeQuery.sort({ username: 1 });
    }
    // otherwise await the result (mock may have returned a promise)
    const arr = await maybeQuery;
    if (Array.isArray(arr)) {
      return arr.sort((a, b) => ("" + (a.username || "")).localeCompare("" + (b.username || "")));
    }
    return arr;
  } catch (err) {
    // fallback: direct await and sort if possible
    const arr = await Employee.find();
    if (Array.isArray(arr)) {
      return arr.sort((a, b) => ("" + (a.username || "")).localeCompare("" + (b.username || "")));
    }
    return arr;
  }
}

// Add a new employee
export async function addEmployee({ name, username, password, role }) {
  // Generate username if not provided
  try {
    if (!username) {
      // try to use findOne().sort(...) like in production; handle mocks that return arrays/promises
      try {
        const maybe = Employee.findOne();
        if (maybe && typeof maybe.sort === "function") {
          const lastEmployee = await maybe.sort({ username: -1 });
          username = lastEmployee ? (parseInt(lastEmployee.username) + 1).toString() : "1000";
        } else {
          const lastEmployeeResolved = await maybe;
          username = lastEmployeeResolved ? (parseInt(lastEmployeeResolved.username) + 1).toString() : "1000";
        }
      } catch {
        const lastEmployee = await Employee.findOne().sort?.({ username: -1 }) || await Employee.findOne();
        username = lastEmployee ? (parseInt(lastEmployee.username) + 1).toString() : "1000";
      }
    }

    // If Employee.create exists (common API), prefer it (works with mocks that are plain objects)
    if (Employee && typeof Employee.create === "function") {
      const created = await Employee.create({ name, username, password, role });
      return created;
    }

    // Otherwise assume Employee is a constructor
    const employee = new Employee({ name, username, password, role });
    await employee.save();
    return employee;
  } catch (err) {
    // bubble up error to caller
    throw err;
  }
}

// Delete employee by ID
export async function deleteEmployee(id) {
  const deleted = await Employee.findByIdAndDelete(id);
  return !!deleted;
}

// Update employee by ID
export async function updateEmployee(id, { name, password, role }) {
  const employee = await Employee.findById(id);
  if (!employee) return null;

  if (name) employee.name = name;
  if (password) employee.password = password;
  if (role && (role === "Admin" || role === "Cashier")) employee.role = role;

  await employee.save();
  return employee;
}

export default {
  getEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee
};
