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
        unknown,
        male,
        female
    }
}
