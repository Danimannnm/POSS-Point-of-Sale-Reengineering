import java.util.*;

public class Inventory {
    // Singleton design pattern applied
    private static Inventory uniqueInstance = null;
    private ItemRepository itemRepository;

    // constructor
    private Inventory() {
        // Default to file-based repository for now
        // In a real dependency injection scenario, this would be passed in
        this.itemRepository = new FileItemRepository("Database/itemDatabase.txt");
    }

    public static synchronized Inventory getInstance() {
        if (uniqueInstance == null)
            uniqueInstance = new Inventory();
        return uniqueInstance;
    }

    // methods
    public boolean accessInventory(String databaseFile, List<Item> databaseItem) {
        // Update repository path if it changes (handling the legacy behavior where path is passed in)
        // Ideally, the repository should be fixed to one source, but we adapt to legacy calls here.
        if (itemRepository instanceof FileItemRepository) {
             // Re-instantiate if we really need to switch files, or just trust the default.
             // For now, we'll reload from the repo.
             this.itemRepository = new FileItemRepository(databaseFile);
        }
        
        List<Item> items = itemRepository.findAll();
        databaseItem.clear();
        databaseItem.addAll(items);
        return true;
    }

    public void updateInventory(String databaseFile, List<Item> transactionItem, List<Item> databaseItem, boolean takeFromInventory) {
        // Sync repository with the current databaseFile
        this.itemRepository = new FileItemRepository(databaseFile);
        
        for (Item tItem : transactionItem) {
            Item dbItem = itemRepository.findById(tItem.getItemID());
            if (dbItem != null) {
                int newAmount;
                if (takeFromInventory) {
                    newAmount = dbItem.getAmount() - tItem.getAmount();
                } else {
                    newAmount = dbItem.getAmount() + tItem.getAmount();
                }
                dbItem.updateAmount(newAmount);
                itemRepository.save(dbItem);
            }
        }
        
        // Update the in-memory list passed by the caller to reflect changes
        databaseItem.clear();
        databaseItem.addAll(itemRepository.findAll());
    }
}
