using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Chat.Model {
    public class User {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string UserId { get; set; }
        public string Password { get; set; }      
        public string Name { get; set; }
        public Gender Gender { get; set; } 
        public string? Province { get; set; }
        public string? City { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public User(string UserId,string Password,string Name) {
            this.UserId = UserId;
            this.Password = Password;
            this.Name = Name;
        }
    }

    public enum Gender {
        unknown,
        male,
        female 
    }
}
