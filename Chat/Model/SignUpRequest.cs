using FluentValidation;
using System;

namespace Chat.Model {
    public record SignUpRequest (string UserId,string Password,string Name, string Email);


    public class SignUpRequestValidator : AbstractValidator<SignUpRequest> {
        public SignUpRequestValidator() {
            RuleFor(x => x.UserId).NotNull().Length(6,15);
            RuleFor(x => x.Password).NotNull();
            RuleFor(x => x.Name).NotNull();
            RuleFor(x => x.Email).EmailAddress();        
        }
    }
}
