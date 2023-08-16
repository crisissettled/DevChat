namespace Chat.Model.Response {
    public enum ResultCode {
        Success = 2000,
        Failed = 4000,
        UserExisted = 4001,
        NoDataFound = 4002,
        Error = 5000
    }

    public static class ResultCodeExtensions {
        public static string GetMessage(this ResultCode code) {
            switch (code) {
                case ResultCode.UserExisted:
                    return "User's already existed";
                case ResultCode.Success:
                    return "Success";
                case ResultCode.NoDataFound:
                    return "No Data Found";
            }

            return $"{code} - Unknow";
        }
      
    }
     
}
