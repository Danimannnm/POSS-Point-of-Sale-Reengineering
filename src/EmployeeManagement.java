import java.util.*;

public class EmployeeManagement {
    private EmployeeRepository employeeRepository;

    public EmployeeManagement() {
        this.employeeRepository = new FileEmployeeRepository();
    }

    public List<Employee> getEmployeeList() {
        return employeeRepository.findAll();
    }

    public void add(String name, String password, boolean employee) {
        // Generate new ID (simple auto-increment logic based on max existing ID)
        List<Employee> all = employeeRepository.findAll();
        int maxId = 0;
        for (Employee e : all) {
            try {
                int id = Integer.parseInt(e.getUsername());
                if (id > maxId) maxId = id;
            } catch (NumberFormatException ex) {
                // Ignore non-integer IDs
            }
        }
        String newUsername = String.valueOf(maxId + 1);
        String position = employee ? "Cashier" : "Admin";
        
        // Split name into first and last
        String[] nameParts = name.split(" ");
        String firstName = nameParts.length > 0 ? nameParts[0] : "";
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        Employee newEmployee = new Employee(newUsername, name, position, password);
        employeeRepository.save(newEmployee);
    }

    public boolean delete(String username) {
        Employee emp = employeeRepository.findByUsername(username);
        if (emp != null) {
            employeeRepository.delete(username);
            return true;
        }
        return false;
    }

    public int update(String username, String password, String position, String name) {
        Employee emp = employeeRepository.findByUsername(username);
        if (emp == null) {
            return -1; // User not found
        }

        if (!(position.equals("Admin") || position.equals("Cashier") || position.equals(""))) {
            return -2; // Invalid position
        }

        // Update fields if they are not empty
        if (!password.equals("")) {
            // In a real app, we would setter methods on Employee, but Employee might be immutable or lack setters.
            // Assuming we need to create a new object or modify existing if setters exist.
            // Checking Employee class... it seems to have setters based on previous usage.
             emp.setPassword(password);
        }

        if (!position.equals("")) {
             emp.setPosition(position);
        }

        if (!name.equals("")) {
             emp.setName(name);
        }
        
        employeeRepository.save(emp);
        return 0; // Success
    }
}