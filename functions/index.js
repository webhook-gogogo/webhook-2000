const functions = require("firebase-functions");
const bodyParser = require("body-parser");
const app = require("express")();
const request = require("request");
const page_token =
  "EAALQ7mxZB30EBAGEyD7HUmuBurXBMIBFOxsVJcWufM5DJlhlbocNZB2FYJ99aZAq2f7jG6qA4j4vkpZCNv95R3AaLAoLgKZCQJaffgCrZBSZC2jlOAM8delefh4iQSHxIQZBN4vwCwyg8IvDrvpXc4GCwIvzHhyJIO2Iekw63uZCzYdsjINZBxAO5i";
let qusestion = [
  {
    Q: "1KB = ? Bytes",
    A: "1024"
  },
  {
    Q: "新生茶會日期?",
    A: "9/17"
  },
  {
    Q: "社費多少?",
    A: "500"
  },
  {
    Q: "世界上最大的搜尋引擎?",
    A: "google"
  },
  {
    Q: " 手機有哪兩大主流作業系統?(中間用逗號隔開)",
    A: "android,ios"  
  },
  {
    Q: "晚會什麼時間?",
    A: "9/12"
  },
  {
    Q: "AI的中文？",
    A: "人工智慧"
  },
  {
    Q: "史上首位程式設計師是男的還是女的？",
    A: "女"
  },
  {
    Q: "社辦在中正館幾樓？(阿拉伯數字)",
    A: "3"
  },
  {
    Q: "C語言的前身是A語言還是B語言?(只需回答A或B)",
    A: "B"
  }
];


exports.app = functions.https.onRequest(app);

app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
  let messaging_events = req.body.entry[0].messaging;
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i];
    let sender = event.sender.id;
    if (event.message && event.message.text) {
      let text = event.message.text;
      sendTextMessage(sender,"Text received, echo: " + text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

app.get("/webhook", (req, res) => {
  let VERIFY_TOKEN = "hello";
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

sendTextMessage = (sender, text) => {
  let messageData = {
    text: text
  };
  request(
    {
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: {
        access_token: page_token
      },
      method: "POST",
      json: {
        recipient: {
          id: sender
        },
        message: messageData
      }
    },
    (error, response, body) => {
      if (error) {
        console.log("Error sending messages: ", error);
      } else if (response.body.error) {
        console.log("Error: ", response.body.error);
      }
    }
  );
};
