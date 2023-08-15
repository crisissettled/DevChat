using System.Security.Cryptography;
using System.Text;

namespace Chat.Utils.Crypto {
    public class Crypto : ICrypto {
        public string SHA256Encrypt(string data) {
            var result = "";
            var bytes = Encoding.UTF8.GetBytes(data);

            using (var sha = SHA256.Create()) {
                var hash = sha.ComputeHash(bytes);
                result = Convert.ToBase64String(hash);
            }

            return result;
        }
    }
}
