using Chat.Model;

namespace Chat.Utils.MongoDb.UserService {
    public interface IMongoDbLogInStateService {
        Task<LogInState> GetLogInState(string RefreshToken);
        Task UpsertLoginState(LogInState logInState);
        Task UpdateSignOut(string UserId, bool IsSignedOut = true);
    }
}