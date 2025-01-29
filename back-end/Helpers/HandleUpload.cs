using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace SocialNetwork.Helpers
{
    public class HandleUpload
    {
        public static async Task<string> UploadImage(IFormFile file)
        {

            string fileName = file.FileName;
            var path = Path.Combine(Directory.GetCurrentDirectory(), "UploadFiles", "Images", fileName);

            // Kiểm tra nếu tệp đã tồn tại
            if (!File.Exists(path))
            {
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            }

            return $"UploadFiles/Images/{fileName}";
        }

        public static async Task<string> UploadImages(List<IFormFile> files)
        {
            List<string> imagePaths = new List<string>();

            if (files.Count > 0)
            {
                foreach (IFormFile file in files)
                {
                    //string fileName = DateTime.Now.ToString("yyyyMMddHHmmssfff") + "_" + file.FileName;
                    string fileName = file.FileName;
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "UploadFiles", "Images", fileName);

                    // Kiểm tra nếu tệp đã tồn tại
                    if (!File.Exists(path))
                    {
                        using (var stream = new FileStream(path, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                    }

                    string returnPath = $"UploadFiles/Images/{fileName}";
                    imagePaths.Add(returnPath);
                }
            }

            return JsonConvert.SerializeObject(imagePaths);
        }
    }
}
