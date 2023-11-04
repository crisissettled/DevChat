using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Chat.Model {
    public class User {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string UserId { get; set; }
        public string Password { get; set; }      
        public string Name { get; set; } = "";
        public Gender Gender { get; set; }
        public string Province { get; set; } = "";
        public string City { get; set; } = "";
        public string Address { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Email { get; set; } = "";

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public User(string UserId,string Password,string Name) {
            this.UserId = UserId;
            this.Password = Password;
            this.Name = Name;
        }
    }


    public class UserSessionState {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string UserId { get; set;}
        public string Token { get; set;}
        public string RefreshToken { get; set;}
        public bool KeepLoggedIn { get; set; } = false;
        public bool IsSignedOut { get; set;} = false;
        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public UserSessionState(string UserId,string Token, string RefreshToken) {
            this.UserId = UserId;
            this.Token = Token;
            this.RefreshToken = RefreshToken;
        }
    }

   
}
