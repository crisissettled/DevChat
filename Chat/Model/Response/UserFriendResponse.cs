namespace Chat.Model.Response {
    public class UserFriendResponse {
        public string FriendId { get; set; }
        public string FriendName { get; set;}
        public Gender Gender { get; set;}

        public FriendRequestStatus FriendStatus { get; set; }

        public bool? Blocked { get; set; } = null;

        public UserFriendResponse(string friendId, string friendName, Gender gender, FriendRequestStatus friendStatus,bool? Blocked) {
            FriendId = friendId;
            FriendName = friendName;
            Gender = gender;
            FriendStatus = friendStatus;    
            this.Blocked = Blocked;
        }
    }
}
