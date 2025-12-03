import java.util.List;

public interface CustomerRepository {
    boolean exists(long phoneNumber);
    void create(long phoneNumber);
    // Methods for rentals will be handled here or in a separate RentalRepository
}
