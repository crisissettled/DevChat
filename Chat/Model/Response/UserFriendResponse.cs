namespace Chat.Model.Response {
    public class UserFriendResponse {
        public string FriendUserId { get; set; }
        public string FriendName { get; set;}
        public Gender Gender { get; set;}

        public FriendRequestStatus FriendStatus { get; set; }

        public bool? Blocked { get; set; } = null;

        public UserFriendResponse(string friendUserId, string friendName, Gender gender, FriendRequestStatus friendStatus,bool? Blocked) {
            FriendUserId = friendUserId;
            FriendName = friendName;
            Gender = gender;
            FriendStatus = friendStatus;    
            this.Blocked = Blocked;
        }
    }
}
