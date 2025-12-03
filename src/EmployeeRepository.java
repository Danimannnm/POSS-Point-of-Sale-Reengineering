import java.util.List;

public interface EmployeeRepository extends Repository<Employee, String> {
    Employee findByUsername(String username);
}
