using FluentValidation;

namespace Chat.Model.Request {
    public record UserFriendRequest (string UserId,bool Blocked = false);

    public class UserFriendRequestValidator : AbstractValidator<UserFriendRequest> {
        public UserFriendRequestValidator() {
            RuleFor(x => x.UserId).NotNull();
        }
    }
}
