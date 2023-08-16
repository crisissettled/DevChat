﻿using Chat.Model;

namespace Chat.Utils.MongoDb {
    public interface IMongoDbUserService {

        Task<User> GetUserAsync(string UserId);
        Task<List<User>> GetUserListByKeywordAsync(string Keyword);
        Task CreateUserAsync(User user);
    }
}