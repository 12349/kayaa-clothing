import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'C:\\Users\\mahab\\.gemini\\antigravity-ide\\brain\\b0e46265-01b6-4b5d-a3c8-c257c99bea81\\screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Find local chrome or edge
const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];

const executablePath = chromePaths.find(p => fs.existsSync(p));
if (!executablePath) {
  console.error('No Chrome or Edge executable found.');
  process.exit(1);
}

console.log(`Using browser executable: ${executablePath}`);

async function run() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Helper for taking screenshot
  const shot = async (name) => {
    const dest = path.join(SCREENSHOT_DIR, name);
    await page.screenshot({ path: dest, fullPage: false });
    console.log(`Saved screenshot: ${name}`);
  };

  // 1. DESKTOP PASS (1280 x 900)
  await page.setViewport({ width: 1280, height: 900 });

  // 1. Home
  console.log('Navigating to Home...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot('01_home_desktop.png');

  // 2. Shop
  console.log('Navigating to Shop...');
  await page.goto('http://localhost:5173/shop', { waitUntil: 'networkidle0' });
  await shot('02_shop_desktop.png');

  // 3. Product Detail (Gulab Chanderi Anarkali)
  console.log('Navigating to Product Detail...');
  await page.goto('http://localhost:5173/product/gulab-chanderi-anarkali', { waitUntil: 'networkidle0' });
  // Click Made to Measure button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const m2mBtn = buttons.find(b => b.textContent.includes('Cut to My Exact Measurements'));
    if (m2mBtn) m2mBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => window.scrollTo(0, 320));
  await shot('03_product_detail_desktop.png');

  // Add to bag
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const addBtn = buttons.find(b => b.textContent.includes('Add Made-to-Measure Piece to Bag'));
    if (addBtn) addBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 4. Size Guide
  console.log('Navigating to Size Guide...');
  await page.goto('http://localhost:5173/size-guide', { waitUntil: 'networkidle0' });
  // Calculate size in helper
  await page.type('#calc-bust', '35');
  await page.type('#calc-waist', '29');
  await page.type('#calc-hips', '40');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Calculate Recommendation'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => window.scrollTo(0, 400));
  await shot('04_size_guide_desktop.png');

  // 5. Bag
  console.log('Navigating to Bag...');
  await page.goto('http://localhost:5173/bag', { waitUntil: 'networkidle0' });
  // Expand submitted measurements
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('submitted measurements'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await shot('05_bag_desktop.png');

  // 6. Checkout
  console.log('Navigating to Checkout...');
  await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle0' });
  await page.type('#full-name', 'Diya Sengupta');
  await page.type('#whatsapp-phone', '+91 98200 12345');
  await page.type('#email-address', 'diya.sengupta@example.com');
  await page.type('#address-1', 'Flat 4B, Gulmohar Enclave, 12th Cross Road');
  await page.type('#city', 'Mumbai');
  await page.type('#postal-code', '400050');
  await page.type('#event-occasion', 'Sister\'s Sangeet Ceremony');
  await page.evaluate(() => window.scrollTo(0, 200));
  await shot('06_checkout_desktop.png');

  // Submit Order
  console.log('Submitting Order...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Confirm & Place Order'));
    if (btn) btn.click();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  const confirmationUrl = page.url();
  console.log(`Landed on: ${confirmationUrl}`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot('07_order_confirmation_desktop.png');

  // Extract order ID
  const orderId = confirmationUrl.split('/').pop();
  console.log(`Issued Order ID: ${orderId}`);

  // 8. Order Receipt (Packing Slip)
  console.log('Viewing Order Receipt...');
  await page.goto(`http://localhost:5173/order/${orderId}/receipt`, { waitUntil: 'networkidle0' });
  await shot('08_order_receipt_desktop.png');

  // 9. Order Worksheet
  console.log('Viewing Order Worksheet...');
  await page.goto(`http://localhost:5173/order/${orderId}/worksheet`, { waitUntil: 'networkidle0' });
  await shot('09_order_worksheet_desktop.png');

  // 10. Verify Valid Order
  console.log('Testing Verify Route (Valid ID)...');
  await page.goto(`http://localhost:5173/verify?id=${orderId}`, { waitUntil: 'networkidle0' });
  await shot('10_verify_order_valid_desktop.png');

  // 11. Verify Fraud Order Alert
  console.log('Testing Verify Route (Fraudulent ID)...');
  await page.goto('http://localhost:5173/verify?id=KY-9999-FAKE', { waitUntil: 'networkidle0' });
  await shot('11_verify_order_fraud_desktop.png');

  // 12. Admin Panel (Unlock & Kanban)
  console.log('Accessing Admin Panel...');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });
  // Enter PIN
  await page.type('#admin-pin-input', '1984');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Unlock Studio Panel'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await shot('12_admin_kanban_desktop.png');

  // Switch to Customers CRM Tab
  console.log('Switching to Admin Customers CRM Tab...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Customer CRM & Fits'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await shot('13_admin_customer_crm_desktop.png');

  // 2. MOBILE RESPONSIVE PASS (390 x 844)
  console.log('Testing Mobile View (390x844)...');
  await page.setViewport({ width: 390, height: 844 });

  // Home mobile
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot('14_home_mobile.png');

  // Product detail mobile
  await page.goto('http://localhost:5173/product/gulab-chanderi-anarkali', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 200));
  await shot('15_product_mobile.png');

  // Size Guide mobile
  await page.goto('http://localhost:5173/size-guide', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 300));
  await shot('16_size_guide_mobile.png');

  // Checkout mobile
  await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 100));
  await shot('17_checkout_mobile.png');

  console.log('All screenshots captured successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('Error running capture script:', err);
  process.exit(1);
});
