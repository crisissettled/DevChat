﻿namespace Chat.Model
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
        unknown = 0,
        male = 1,
        female = 2
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
