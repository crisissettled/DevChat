namespace Chat.Model.Response {
    public class SearchFriendResponse {
        public string UserId { get; set; }
        public string Name { get; set; }
        public Gender Gender { get; set; }
        public string? Province { get; set; }
        public string? City { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }

        public SearchFriendResponse(string UserId, string Name, Gender Gender) {
            this.UserId = UserId;
            this.Name = Name;
            this.Gender = Gender;
        }
    }
}
