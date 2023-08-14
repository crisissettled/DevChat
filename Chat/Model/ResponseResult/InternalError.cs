namespace Chat.Model.ResponseResult {
    public class InternalError {
        public InternalError(ResultCode code) {
            this.code = code;
            this.message = code.GetMessage();
        }
        public ResultCode code { get; set; }
        public string message { get; set; }

        public string ErrorInfo() {
            return $"{code} - {message}";
        }
    }
}
