namespace Chat.Utils {
    public class Constants {
        public const string cst_UnknowUser = "Unknown User";

        //mongodb index names IDX_[Table]_[Field]
        public const string IDX_USER_UserId = "idx_user_userId";

        public const string IDX_ChatMessage_FromUserId_ToUserId = "idx_fromUserId_toUserId";

        //session
        public const string SESSION_COOKIE_KEY = "ChatRT";
        public const int SESSION_KEEP_LOGGED_IN_DAYS = 30;

        //lang
        public const string USER_REQUEST_TEXT = "User Request";


        public const string YES = "Y";
        public const string NO = "N";
    }
}
