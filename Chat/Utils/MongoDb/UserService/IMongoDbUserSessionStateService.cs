using Chat.Model;

namespace Chat.Utils.MongoDb.UserService {
    public interface IMongoDbUserSessionStateService {
        Task<UserSessionState> GetUserSessionState(string RefreshToken);
        Task UpsertUserSessionState(UserSessionState userSessionState);
        Task UpdateSignOut(string UserId, bool IsSignedOut = true);
    }
}