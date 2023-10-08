namespace Chat.Model.Response {
    public class UserFriendResponse {
        public string FriendUserId { get; set; }
        public string FriendName { get; set;}
        public string FriendRequestReceiver { get; set;}
        public Gender Gender { get; set;}

        public FriendRequestStatus FriendStatus { get; set; }

        public bool? Blocked { get; set; } = null;

        public UserFriendResponse(string friendUserId, string friendName, string friendRequestReceiver, Gender gender, FriendRequestStatus friendStatus,bool? Blocked) {
            FriendUserId = friendUserId;
            FriendName = friendName;
            FriendRequestReceiver = friendRequestReceiver;
            Gender = gender;
            FriendStatus = friendStatus;    
            this.Blocked = Blocked;
        }
    }
}
