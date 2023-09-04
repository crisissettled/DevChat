using FluentValidation;

namespace Chat.Model.Request {
    public record SignUpRequest(string UserId, string Password, string Name);
    public class SignUpRequestValidator : AbstractValidator<SignUpRequest> {
        public SignUpRequestValidator() {
            RuleFor(x => x.UserId).NotNull().NotEmpty().Length(3, 15);
            RuleFor(x => x.Password).NotNull().NotEmpty().Length(3, 20);
            RuleFor(x => x.Name).NotNull().NotEmpty();

        }
    }

    public record SignInRequest(string UserId, string Password,bool KeepLoggedIn);
    public class SignInRequestValidator : AbstractValidator<SignInRequest> {
        public SignInRequestValidator() {
            RuleFor(x => x.UserId).NotNull().NotEmpty();
            RuleFor(x => x.Password).NotNull().NotEmpty();
        }
    }

    public record UpdateProfileRequest(
        string UserId,
        string? Password,
        string? NewPassword,
        string Name,
        Gender Gender,
        string? Province,
        string? City,
        string? Address,
        string? Phone,
        string? Email
    );
    public class UpdateProfileRequestValidator : AbstractValidator<UpdateProfileRequest> {
        public UpdateProfileRequestValidator() {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
            RuleFor(x => x.Gender).IsInEnum();
            RuleFor(x => x.Province).Length(2, 50).When(x => !string.IsNullOrEmpty(x.Province));
            RuleFor(x => x.City).Length(2, 50).When(x => !string.IsNullOrEmpty(x.City));
            RuleFor(x => x.Address).Length(5, 100).When(x => !string.IsNullOrEmpty(x.Address));
            RuleFor(x => x.Phone).Length(6, 20).When(x => !string.IsNullOrEmpty(x.Phone));
            RuleFor(x => x.Email).Length(5, 50).When(x => !string.IsNullOrEmpty(x.Email));
        }
    }

    //public record SignOutRequest(string UserId);
    //public class SignOutRequestValidator : AbstractValidator<SignOutRequest> {
    //    public SignOutRequestValidator() {
    //        RuleFor(x => x.UserId).NotEmpty();
    //    }
    //}

    public record SearchFriendRequest(string SearchKeyword);
    //public class SearchFriendRequestValidator : AbstractValidator<SearchFriendRequest> {
    //    public SearchFriendRequestValidator() {
    //        RuleFor(x => x.SearchKeyword).NotEmpty();
    //    }
    //}
}
