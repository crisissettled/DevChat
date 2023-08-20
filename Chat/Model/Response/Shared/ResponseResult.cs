namespace Chat.Model.Response.Shared
{
    public class ResponseResult
    {
        public ResultCode code { get; set; }
        public string message { get; set; }
        public object? data { get; set; }

        public ResponseResult(ResultCode ResultCode,bool IsDevelopment = false)
        {
            code = ResultCode;
            message = ResultCode.ToString();
            if (IsDevelopment == true) message = code.GetMessage();
        }
    }
}
