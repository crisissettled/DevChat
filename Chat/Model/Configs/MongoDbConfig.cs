namespace Chat.Model.Configs
{
    public class MongoDbConfig
    {
        public static string ConnectionString = "mongodb://db:27017";
        public static string DatabaseName = "dev_chat";
        public static string UserCollectionName = "user";
        public static string UserSessionStateCollectionName = "user_session_state";
        public static string UserFriendCollectionName = "user_friend";
        public static string ChatMessageCollectionName = "chat_message";
    }
}
