
namespace Chat.Model.Response {
    public class UserResponse {
        public string UserId { get; set; }
        public string Name { get; set; } = "";
        public Gender Gender { get; set; }
        public string Phone { get; set; } = "";
        public string Email { get; set; } = "";
        public string Province { get; set; } = "";
        public string City { get; set; } = "";
        public string Address { get; set; } = "";

        public UserResponse(string UserId)
        {
            this.UserId = UserId;
        }
    }
}
