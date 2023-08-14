namespace Chat.Model.ResponseResult {
    public enum ResultCode {
        Success = 2000,
        Failed = 4000,
        UserExisted = 4001,
        Error = 5000
    }

    public static class ResultCodeExtensions {
        public static string GetMessage(this ResultCode code) {
            switch (code) {
                case ResultCode.UserExisted:
                    return "User's already existed";
            }

            return $"{code} - Unknow";
        }
      
    }
     
}
