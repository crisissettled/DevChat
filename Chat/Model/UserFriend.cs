using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;

namespace Chat.Model
{
    public class UserFriend {
        public string UserId { get; set; }
        public string FriendUserId { get; set; }
        public FriendRequestStatus FriendStatus { get; set; } = FriendRequestStatus.Requested;
        public DateTime RequestedAt { get; set; } = DateTime.Now;
        public DateTime AcceptOrDeniedAt { get; set; }
        public List<UserFriendMessage>? MessageIn { get; set; }
        public List<UserFriendMessage>? MessageOut { get; set; }
        public bool Blocked { get; set; } = false;

        public UserFriend(string userId, string friendUserId) {
            UserId = userId;
            FriendUserId = friendUserId;
        }
    }

    public class UserFriendMessage {
        public string? Message { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }

}
