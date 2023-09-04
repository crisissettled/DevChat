using Chat.Utils.MongoDb.UserFirendService;
using Chat.Utils.MongoDb.UserService;

namespace Chat.Utils.MongoDb {
    public static class MongoDbServiceInjection {
        public static IServiceCollection AddMongoDbServices(this IServiceCollection services) {
            services.AddSingleton<IMongoDbUserService, MongoDbUserService>();
            services.AddSingleton<IMongoDbUserFriendService, MongoDbUserFriendService>();
            services.AddSingleton<IMongoDbLogInStateService, MongoDbLogInStateService>();

            return services;
        }
    }
}
