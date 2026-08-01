const { chromium } = require("playwright");
const path = require("path");

const root = __dirname;
const out = path.join(root, "screenshots");
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const fileUrl = name => "file://" + path.join(root, name);

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const checks = [];

  async function makePage(name, viewport) {
    const page = await browser.newPage({ viewportSize: viewport });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(fileUrl(name), { waitUntil: "load" });
    return { page, errors };
  }

  const app = await makePage("angola-app.html", { width: 1440, height: 1000 });
  await app.page.locator('[data-phone="0"] [data-testid="login-submit"]').click();
  if (!(await app.page.locator('[data-phone="0"] .screen-title').isVisible())) throw new Error("App login did not open the workday");
  await app.page.locator('[data-phone="1"] [data-testid="app-open-customer"]').click();
  if (!(await app.page.locator('[data-phone="1"] .profile-block').isVisible())) throw new Error("App did not open the customer context");
  await app.page.locator('[data-phone="3"] [data-testid="app-call"]').click();
  await app.page.locator('[data-phone="3"] .call-hero').waitFor();
  await app.page.locator('[data-phone="3"] [data-testid="app-end-call"]').click();
  await app.page.locator('[data-phone="3"] [data-result-grid]').waitFor();
  await app.page.locator('[data-phone="3"] [data-result="retorno"]').click();
  if (!(await app.page.locator('[data-phone="3"] .callback-fields.show').isVisible())) throw new Error("App callback schedule did not open");
  await app.page.locator('[data-phone="3"] [data-testid="app-save-result"]').click();
  if (!(await app.page.locator('[data-phone="3"] .queue-head').isVisible())) throw new Error("App did not advance to the assigned queue");
  await app.page.locator('[data-phone="8"] [data-testid="nav-more"]').click();
  await app.page.locator('[data-phone="8"] [data-testid="more-scripts"]').click();
  if (!((await app.page.locator('[data-phone="8"] .screen-title').textContent()).includes("Guiões"))) throw new Error("App tab navigation did not open scripts");
  await app.page.reload({ waitUntil: "load" });
  await app.page.screenshot({ path: path.join(out, "angola-app.png"), fullPage: true });
  checks.push({ page: "Angola App", errors: app.errors.length });

  const appZh = await makePage("angola-app-zh.html", { width: 1440, height: 1000 });
  if (!((await appZh.page.locator(".page-head h1").textContent()).includes("完整坐席"))) throw new Error("Chinese App explanation header is missing");
  if ((await appZh.page.locator(".device-slot").count()) !== 15) throw new Error("Chinese App explanation does not contain 15 screens");
  await appZh.page.locator('[data-phone="1"] [data-testid="app-open-customer"]').click();
  if (!((await appZh.page.locator('[data-phone="1"] .app-top').textContent()).includes("拨号前"))) throw new Error("Chinese App interaction was not translated");
  await appZh.page.reload({ waitUntil: "load" });
  await appZh.page.screenshot({ path: path.join(out, "angola-app-zh.png"), fullPage: true });
  checks.push({ page: "Angola App Chinese", errors: appZh.errors.length });

  const web = await makePage("bangladesh-web.html", { width: 1440, height: 900 });
  await web.page.locator('[data-go="customer"]').first().click();
  if (!(await web.page.locator(".case-hero").isVisible())) throw new Error("Bangladesh agent desk did not open the assigned customer");
  await web.page.locator('[data-go="call"]').first().click();
  await web.page.locator("#callButton").click();
  if (!(await web.page.locator("#callButton.end").isVisible())) throw new Error("Bangladesh desk call state did not start");
  await web.page.locator("#callButton").click();
  await web.page.locator('[data-result="callback"]').click();
  if (!(await web.page.locator('#conditional input[type="datetime-local"]').isVisible())) throw new Error("Bangladesh callback time did not open");
  await web.page.locator("#saveResult").click();
  if (!((await web.page.locator(".head h1").textContent()).includes("আজকের"))) throw new Error("Bangladesh desk did not return to the assigned work queue");
  await web.page.screenshot({ path: path.join(out, "bangladesh-web.png"), fullPage: true });
  checks.push({ page: "Bangladesh Agent Web", errors: web.errors.length });

  const webZh = await makePage("bangladesh-web-zh.html", { width: 1440, height: 900 });
  if (!((await webZh.page.locator(".head h1").textContent()).includes("今日工作台"))) throw new Error("Bangladesh Chinese explanation did not load");
  await webZh.page.locator('[data-go="customer"]').first().click();
  await webZh.page.locator("#requestRelease").click();
  if (!(await webZh.page.locator("#releaseModal.show").isVisible())) throw new Error("Bangladesh Chinese release request did not open");
  await webZh.page.locator("#releaseConfirm").click();
  await webZh.page.screenshot({ path: path.join(out, "bangladesh-web-zh.png"), fullPage: true });
  checks.push({ page: "Bangladesh Agent Web Chinese", errors: webZh.errors.length });

  const indonesia = await makePage("../docs/indonesia-web.html", { width: 1440, height: 900 });
  if (!((await indonesia.page.locator(".head h1").textContent()).includes("Dasbor"))) throw new Error("Indonesia business language did not load");
  if ((await indonesia.page.locator("#countrySelect").inputValue()) !== "id") throw new Error("Indonesia country profile was not selected");
  await indonesia.page.locator('[data-go="customer"]').first().click();
  if (!((await indonesia.page.locator(".case-hero").textContent()).includes("+62"))) throw new Error("Indonesia phone localization is missing");
  if ((await indonesia.page.locator(".priority").textContent()).includes("88")) throw new Error("Indonesia desk still exposes a priority score");
  await indonesia.page.locator('[data-go="call"]').first().click();
  await indonesia.page.locator("#callButton").click();
  await indonesia.page.locator("#callButton").click();
  await indonesia.page.locator('[data-result="callback"]').click();
  await indonesia.page.locator("#saveResult").click();
  await indonesia.page.screenshot({ path: path.join(out, "indonesia-web.png"), fullPage: true });
  checks.push({ page: "Indonesia Agent Web", errors: indonesia.errors.length });

  const indonesiaZh = await makePage("../docs/indonesia-web-zh.html", { width: 1440, height: 900 });
  if (!((await indonesiaZh.page.title()).includes("印尼"))) throw new Error("Indonesia Chinese explanation did not load");
  if (!((await indonesiaZh.page.locator(".crumb").textContent()).includes("印尼"))) throw new Error("Indonesia Chinese country context is missing");
  await indonesiaZh.page.screenshot({ path: path.join(out, "indonesia-web-zh.png"), fullPage: true });
  checks.push({ page: "Indonesia Agent Web Chinese", errors: indonesiaZh.errors.length });

  const admin = await makePage("unified-admin.html", { width: 1440, height: 900 });
  await admin.page.locator("#marketSelect").selectOption("id");
  if (!((await admin.page.locator(".head p").textContent()).includes("印尼"))) throw new Error("Admin market switch did not update the Indonesia overview");
  await admin.page.locator('[data-go="cases"]').click();
  if (!((await admin.page.locator("tbody").textContent()).includes("ID-0921"))) throw new Error("Admin Indonesia case routing is missing");
  await admin.page.locator(".case-check").first().check();
  await admin.page.locator("#releaseSelected").click();
  if (!(await admin.page.locator("#actionModal.show").isVisible())) throw new Error("Admin release confirmation did not open");
  await admin.page.locator("#modalConfirm").click();
  await admin.page.locator('[data-go="transfer"]').click();
  await admin.page.locator("#confirmTransfer").click();
  await admin.page.locator("#modalConfirm").click();
  await admin.page.locator('[data-go="rules"]').click();
  if ((await admin.page.locator('input[type="range"]').count()) !== 0) throw new Error("Admin still contains priority weight sliders");
  if (!((await admin.page.locator("#main").textContent()).includes("容量公平轮询"))) throw new Error("Admin fair allocation rule is missing");
  await admin.page.locator("#publishRule").click();
  await admin.page.locator("#modalConfirm").click();
  if (!((await admin.page.locator("#publishRule").textContent()).includes("已发布"))) throw new Error("Admin allocation rule did not publish");
  await admin.page.screenshot({ path: path.join(out, "unified-admin.png"), fullPage: true });
  checks.push({ page: "Unified Admin", errors: admin.errors.length });

  const hub = await makePage("index.html", { width: 1440, height: 1000 });
  if ((await hub.page.locator(".card").count()) !== 3) throw new Error("Prototype hub does not show all three surfaces");
  if (!(await hub.page.locator('a[href="indonesia-web.html"]').isVisible())) throw new Error("Indonesia Web entry is missing from prototype hub");
  await hub.page.screenshot({ path: path.join(out, "prototype-hub.png"), fullPage: true });
  checks.push({ page: "Prototype Hub", errors: hub.errors.length });

  const chooser = await makePage("../index.html", { width: 1440, height: 900 });
  if (!(await chooser.page.locator('a[href="prototype/index.html"]').isVisible())) throw new Error("Prototype entry is missing from direction page");
  checks.push({ page: "Direction Entry", errors: chooser.errors.length });

  const totalErrors = [...app.errors, ...appZh.errors, ...web.errors, ...webZh.errors, ...indonesia.errors, ...indonesiaZh.errors, ...admin.errors, ...hub.errors, ...chooser.errors];
  console.log(JSON.stringify({ checks, totalErrors }, null, 2));
  await browser.close();
  if (totalErrors.length) process.exit(1);
})().catch(async error => {
  console.error(error);
  process.exit(1);
});
