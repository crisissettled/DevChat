using Chat.Model;

namespace Chat.Utils.MongoDb {
    public interface IMongoDbUserService {
        Task CreateAsync(User user);
    }
}