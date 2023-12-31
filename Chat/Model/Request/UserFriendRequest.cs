﻿using FluentValidation;

namespace Chat.Model.Request {
    public record GetUserFriendsRequest (string UserId,bool? Blocked =null);
    public class UserFriendRequestValidator : AbstractValidator<GetUserFriendsRequest> {
        public UserFriendRequestValidator() {
            RuleFor(x => x.UserId).NotEmpty();
        }
    }

    public record AddUserFriendRequest(string UserId, string FriendUserId, string? message);
    public class AddUserFriendRequestValidator: AbstractValidator<AddUserFriendRequest> {
        public AddUserFriendRequestValidator() {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.FriendUserId).NotEmpty();
        }
    }

    public record AddUserFriendMessageRequest(string UserId,string FriendUserId,string Message, UserFriendMessageType MessageType);
    public class AddUserFriendMessageRequestValidator : AbstractValidator<AddUserFriendMessageRequest> {
        public AddUserFriendMessageRequestValidator() {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.FriendUserId).NotEmpty();
            RuleFor(x => x.Message).NotNull().NotEmpty();
            RuleFor(x => x.MessageType).IsInEnum();
        }
    }


    public record AcceptOrDenyFriendRequest(string UserId, string FriendUserId,FriendRequestStatus AcceptOrDeny);
    public class AcceptOrDenyFriendRequestValidator :AbstractValidator<AcceptOrDenyFriendRequest> {
        public AcceptOrDenyFriendRequestValidator() {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.FriendUserId).NotEmpty();
            RuleFor(x => x.AcceptOrDeny).Must(x => x == FriendRequestStatus.Accepted || x == FriendRequestStatus.Denied)
                .WithMessage("Invalid Accept or Deny operation");
        }
    }
}
