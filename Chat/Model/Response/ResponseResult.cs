namespace Chat.Model.Response {
    public class ResponseResult {
        public ResultCode code { get; set; }
        public string message { get; set; }
        public object? data { get; set; }

        public ResponseResult(ResultCode ResultCode) {
            code = ResultCode;
            message = code.GetMessage();
        }
    }
}
