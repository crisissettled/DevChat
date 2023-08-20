using FluentValidation;

namespace Chat.Model.Request {
    public record SignupRequest(string UserId, string Password, string Name);
    public class SignUpRequestValidator : AbstractValidator<SignupRequest> {
        public SignUpRequestValidator() {
            RuleFor(x => x.UserId).NotNull().NotEmpty().Length(3, 15);
            RuleFor(x => x.Password).NotNull().NotEmpty().Length(3, 20);
            RuleFor(x => x.Name).NotNull().NotEmpty();

        }
    }

    public record SignInRequest(string UserId, string Password);
    public class SignInRequestValidator : AbstractValidator<SignInRequest> {
        public SignInRequestValidator() {
            RuleFor(x => x.UserId).NotNull().NotEmpty();
            RuleFor(x => x.Password).NotNull().NotEmpty();
        }
    }

    public record UserProfileRequest(
        string UserId,
        string Password,
        string Name,
        Gender Gender,
        string Province,
        string City,
        string Address,
        string Phone,
        string Email
    );
    public class UserProfileRequestValidator : AbstractValidator<UserProfileRequest> {
        public UserProfileRequestValidator() {
            RuleFor(x => x.Name).NotNull().NotEmpty();
            RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
        }
    }

    public record SearchFriendRequest(string SearchKeyword);
    public class SearchFriendRequestValidator : AbstractValidator<SearchFriendRequest> {
        public SearchFriendRequestValidator() {
            RuleFor(x => x.SearchKeyword).NotNull().NotEmpty();      
        }
    }
}
