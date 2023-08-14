using Chat.Model;

namespace Chat.Utils.MongoDb {
    public interface IMongoDbUserService {

        Task<bool> GetUserAsync(string UserId);
        Task CreateUserAsync(User user);
    }
}