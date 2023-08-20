namespace Chat.Model.Response.Shared
{
    public class InternalError
    {
        public InternalError(ResultCode code)
        {
            this.code = code;
            message = code.GetMessage();
        }
        public ResultCode code { get; set; }
        public string message { get; set; }

        public string ErrorInfo()
        {
            return $"{code} - {message}";
        }
    }
}
