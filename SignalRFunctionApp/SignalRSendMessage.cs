using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;

namespace SignalRFunctionApp
{
    public static class SignalRSendMessage
    {
        [FunctionName("SignalRSendMessage")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", "options")] HttpRequest req,
            [SignalR(HubName = "mudischat")] IAsyncCollector<SignalRMessage> signalRMessages)
        {
            var notification = new JsonSerializer()
                .Deserialize<SignalRNotification>(
                    new JsonTextReader(new StreamReader(req.Body))
                );

            await signalRMessages
                .AddAsync(
                new SignalRMessage
                {
                    Target = notification.Target,
                    Arguments = new[] { notification.Message }
                });

            return new OkResult();
        }
    }
}
