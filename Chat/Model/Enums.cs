namespace Chat.Model
{
    public enum FriendRequestStatus
    {
        Requested,
        Pending, //send message back and forth to confirm friend
        Accepted,
        Denied
    }

    public enum Gender
    {
        NotSet = 0,       
        Male = 1,
        Female = 2,
        Unknown = 3
    }

    public enum UserFriendMessageType {
        Send, // the one who request adding friend [UserId]
        Reply // the one who receive adding friend message [FriendUserId]
    }

    public enum ChatMessageType {
       Text,
       File
    }
}
