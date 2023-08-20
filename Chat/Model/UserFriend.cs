using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Chat.Model
{
    public class UserFriend {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string UserId { get; set; }
        public string FriendUserId { get; set; }
        public FriendRequestStatus FriendStatus { get; set; } = FriendRequestStatus.Requested;

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime RequestedAt { get; set; } = DateTime.Now;

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime AcceptOrDeniedAt { get; set; }
        public List<UserFriendMessage> MessageIn { get; set; } = new List<UserFriendMessage>();
        public List<UserFriendMessage> MessageOut { get; set; } = new List<UserFriendMessage>();
        public bool Blocked { get; set; } = false;

        public UserFriend(string userId, string friendUserId) {
            UserId = userId;
            FriendUserId = friendUserId;
        }
    }

    public class UserFriendMessage {
        public string? Message { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }

}
