// auto-play-adv.js  ← macOS Compatible Version - using nodemailer
const https = require("https");
const nodemailer = require("nodemailer");

// ==== 使用环境变量 (Environment Variables) ====
const GMAIL = process.env.GMAIL;
const APP_PASS = process.env.APP_PASS;
const RECIPIENT = process.env.RECIPIENT;
const TOKEN = process.env.API_TOKEN;
// ============================================
const HOST = "cdz.dianlvchongdian.com";

const headers = {
  Authorization: "Bearer " + TOKEN,
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0",
};

let finalMinutes = "Unknown";

function httpGet(path) {
  return new Promise((r) => {
    https
      .get({ hostname: HOST, path: path, headers: headers }, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => r(d));
      })
      .on("error", () => r(""));
  });
}

function httpPost(path, body) {
  return new Promise((r) => {
    const opt = {
      hostname: HOST,
      path: path,
      method: "POST",
      headers: { ...headers, "Content-Length": Buffer.byteLength(body) },
    };
    const req = https.request(opt, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => r(d));
    });
    req.write(body);
    req.end();
  });
}

async function sendGmail(title, body) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: GMAIL,
      pass: APP_PASS,
    },
  });

  await transporter.sendMail({
    from: GMAIL,
    to: RECIPIENT,
    subject: title,
    text: body,
  });
}

(async () => {
  console.log("Fetching adv list...");
  const listJson = await httpGet("/api/adv/getAdvInPool");
  const list = JSON.parse(listJson).data || [];
  if (!list.length) {
    console.log("No adv found");
    process.exit();
  }

  for (let i = 0; i < list.length; i++) {
    const adv = list[i];
    console.log(`Playing #${i + 1} ${adv.advName} (${adv.advTime}s)`);
    await new Promise((r) => setTimeout(r, adv.advTime * 1000));
    await httpPost(
      "/api/adv/adv-over",
      JSON.stringify({ advId: adv.id.toString(), rank: i + 1 })
    );
    console.log("Reported");
  }

  console.log("Getting final free time...");
  const userJson = await httpGet("/api/member/userInfo");
  const freeSec = JSON.parse(userJson)?.data?.freeTime || 0;
  finalMinutes = Math.round(freeSec / 60);

  const title = `Adv Done - Free ${finalMinutes} min (${new Date().toLocaleString()})`;
  const body = `All ads finished!\nFree minutes: ${finalMinutes}\nSeconds: ${freeSec}\nTime: ${new Date()}`;
  await sendGmail(title, body);

  console.log(`All done! Free ${finalMinutes} minutes. Email sent.`);
})();
