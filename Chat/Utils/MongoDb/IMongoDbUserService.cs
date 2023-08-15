using Chat.Model;

namespace Chat.Utils.MongoDb {
    public interface IMongoDbUserService {

        Task<User> GetUserAsync(string UserId);
        Task CreateUserAsync(User user);
    }
}