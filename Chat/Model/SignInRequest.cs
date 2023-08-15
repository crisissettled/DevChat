using FluentValidation;

namespace Chat.Model {
    public record SignInRequest (string UserId,string Password);

    public class SignInRequestValidator : AbstractValidator<SignInRequest> {
        public SignInRequestValidator() {
            RuleFor(x => x.UserId).NotNull();
            RuleFor(x => x.Password).NotNull();            
        }
    }
}
