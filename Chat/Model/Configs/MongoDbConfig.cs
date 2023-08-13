namespace Chat.Model.Configs
{
    public class MongoDbConfig
    {
        public static string ConnectionString = "mongodb://localhost:27017";
        public static string DatabaseName = "dev_chat";
        public static string UserCollectionName = "user";
    }
}
