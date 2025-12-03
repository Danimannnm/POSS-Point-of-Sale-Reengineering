import java.util.Calendar;

public class AuthenticationService {
    private EmployeeRepository employeeRepository;
    private AuditLogger auditLogger;
    private Employee currentUser;

    public AuthenticationService(EmployeeRepository employeeRepository, AuditLogger auditLogger) {
        this.employeeRepository = employeeRepository;
        this.auditLogger = auditLogger;
    }

    public int login(String username, String password) {
        Employee employee = employeeRepository.findByUsername(username);
        if (employee != null && employee.getPassword().equals(password)) {
            currentUser = employee;
            auditLogger.logLogin(currentUser);
            
            if ("Cashier".equals(currentUser.getPosition())) {
                return 1;
            } else if ("Admin".equals(currentUser.getPosition())) {
                return 2;
            }
        }
        return 0; // Failed
    }

    public void logout() {
        if (currentUser != null) {
            auditLogger.logLogout(currentUser);
            currentUser = null;
        }
    }

    public Employee getCurrentUser() {
        return currentUser;
    }
}
