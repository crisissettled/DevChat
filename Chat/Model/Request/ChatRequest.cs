using FluentValidation;

namespace Chat.Model.Request {
    public record ChatMessageRequest(string toUserId, string message);
    public class ChatMessageRequestValidator : AbstractValidator<ChatMessageRequest> {
        public ChatMessageRequestValidator() {
            RuleFor(x => x.toUserId).NotEmpty();
            RuleFor(x => x.message).NotEmpty();
        }
    }


    public record ChatMessageUpdateReadStatusRequest(string id);
    public class ChatMessageUpdateReadStatusRequestValidator : AbstractValidator<ChatMessageUpdateReadStatusRequest> {
        public ChatMessageUpdateReadStatusRequestValidator() {
            RuleFor(x => x.id).NotEmpty();             
        }
    }
}
