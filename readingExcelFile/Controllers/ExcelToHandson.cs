using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO.Packaging;
using OfficeOpenXml;
using System.Diagnostics.Contracts;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ExcelToHandson.Controllers
{
    public class ExcelToHandson : Controller
    {

        // GET: /<controller>/
        [HttpPost]
        public IActionResult Index(IList<IFormFile> files)
        {
            Contract.Ensures(Contract.Result<IActionResult>() != null);
            string text="";
            foreach (IFormFile item in files)
            {
                using (MemoryStream targetStream = new MemoryStream())
                {
                    Stream sourceStream = item.OpenReadStream();
                    try
                    {
                        byte[] buffer = new byte[sourceStream.Length + 1];
                        int read = 0;
                        while ((read = sourceStream.Read(buffer, 0, buffer.Length)) > 0)
                        {
                            targetStream.Write(buffer, 0, read);
                        }
                        ExcelPackage package = new ExcelPackage(targetStream);
                        ExcelWorksheet sheet = package.Workbook.Worksheets[0];

                        string[] columnsArray = new string[sheet.Dimension.End.Column+1];
                        text += "{";
                        //loop all rows in the sheet
                        for (int i = sheet.Dimension.Start.Row; i <= sheet.Dimension.End.Row;)
                        {
                            text += "\"columns\": [";
                            //loop all columns in a row
                            for (int j = sheet.Dimension.Start.Column; j <= sheet.Dimension.End.Column; j++)
                            {
                                //do something with the current cell value
                                text +=   "\""+sheet.Cells[i, j].Value.ToString() + "\",";
                                columnsArray[j] = sheet.Cells[i, j].Value.ToString();
                            }
                            text = text.Substring(0, text.Length - 1);
                            text += "],";
                            break;
                        }
                        text += "\"data\":[";

                        for (int i = sheet.Dimension.Start.Row + 1; i <= sheet.Dimension.End.Row;i++)
                        {
                            text += "{";
                            //loop all columns in a row
                            for (int j = sheet.Dimension.Start.Column; j <= sheet.Dimension.End.Column; j++)
                            {
                                //do something with the current cell value
                                text += "\"" + columnsArray[j] + "\":";
                                text += "\"" + sheet.Cells[i, j].Value.ToString() + "\",";
                            }
                            text = text.Substring(0, text.Length - 1);
                            text += "},";

                        }
                        text = text.Substring(0, text.Length - 1);
                        text += "]}";

                        //long size = files.Sum(f => f.Length);

                        //// full path to file in temp location
                        //var filePath = Path.GetTempFileName();
                        //text = item.FileName;
                        //var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", item.FileName);
                        //using (var stream = new FileStream(path, FileMode.Create)){
                        //        item.CopyTo(stream);

                        //}
                    }
                    catch (Exception ex){
                        text = ex.Message;
                    }
                }
              
            }
            return this.Content(text);
        }
    }
}
