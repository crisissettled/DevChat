namespace Chat.Model.Response {
    public class UserFriendResponse {
        public string FriendId { get; set; }
        public string FriendName { get; set;}
        public Gender Gender { get; set;}

        public UserFriendResponse(string friendId, string friendName, Gender gender) {
            FriendId = friendId;
            FriendName = friendName;
            Gender = gender;
        }
    }
}
