namespace Chat.Model.ResponseResult {
    public class ResponseResult {
        public ResultCode code {  get; set; }
        public string? message { get; set; }
        public object? data { get; set; }

    }
}
