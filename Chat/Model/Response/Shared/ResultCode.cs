
namespace Chat.Model.Response.Shared {
    public enum ResultCode {
        Success = 2000,
        Failed = 4000,
        UserExisted = 4001,
        UserNotFound = 4002,
        UserFriendExisted = 4003,
        UserFriendNotFound = 4004,
        ValidationFailed = 4005,
        BadDataRequest = 4006,
        UnAutherized = 4010,
        NoDataFound = 4999,
        Error = 5000
    }

    public static class ResultCodeExtensions {
        public static string GetMessage(this ResultCode code) {
            switch (code) {

                case ResultCode.Success:
                    return "Success";
                case ResultCode.Failed:
                    return "Failed";
                case ResultCode.UserExisted:
                    return "User's already existed";
                case ResultCode.UserNotFound:
                    return "User Not Found";
                case ResultCode.UserFriendExisted:
                    return "User-Friend relation's already existed";
                case ResultCode.UserFriendNotFound:
                    return "User-Friend relation Not found";
                case ResultCode.ValidationFailed:
                    return "Validation failed";
                case ResultCode.BadDataRequest:
                    return "BadDataRequest";
                case ResultCode.UnAutherized:
                    return "UnAuthrized";
                case ResultCode.NoDataFound:
                    return "No Data Found";
                case ResultCode.Error:
                    return "Unexcepted error";
            }

            return $"{code} - Unknow";
        }

    }

}
