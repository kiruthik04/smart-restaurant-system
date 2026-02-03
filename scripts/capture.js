const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/ACER/.gemini/antigravity/brain/40b9dcbe-6e13-4a20-b655-0bce71757554';

(async () => {
    console.log('Starting script (Sidebar Navigation Mode)...');
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });

        // Login
        console.log('Navigating to Login...');
        try {
            await page.goto('http://localhost:3001/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
            await page.type('input[placeholder="Enter your username"]', 'admin');
            await page.type('input[placeholder="••••••••"]', 'admin123');
            await page.click('.login-btn');
            console.log('Clicked login...');

            // Wait for dashboard navigation
            try {
                await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
            } catch (e) { console.log("Nav wait timeout, checking url..."); }

            await new Promise(r => setTimeout(r, 2000));
            console.log(`Current URL: ${page.url()}`);

            await page.screenshot({ path: path.join(ARTIFACTS_DIR, '03_Admin_Dashboard.png'), fullPage: true });
            console.log('Captured Dashboard');

        } catch (e) {
            console.error('Login/Dashboard failed:', e.message);
            throw e; // Cannot proceed without login
        }

        // Define Pages to Capture (Direct Navigation)
        const pages = [
            { url: '/admin/tables', name: '05_Admin_Tables.png' },
            { url: '/admin/orders', name: '06_Admin_Orders.png' },
            { url: '/admin/kitchen', name: '07_Admin_Kitchen.png' },
            { url: '/admin/events', name: '08_Admin_Events.png' },
            { url: '/admin/halls', name: '09_Admin_Halls.png' },
            { url: '/admin/menu', name: '04_Admin_Menu.png' },
            { url: '/admin/staff', name: '10_Admin_Staff.png' }
        ];

        for (const item of pages) {
            const fullUrl = `http://localhost:3001${item.url}`;
            console.log(`Navigating to ${item.name} via URL ${fullUrl}...`);
            try {
                await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
                // Wait for content to render
                await new Promise(r => setTimeout(r, 3000));

                console.log(`Navigated. Current URL: ${page.url()}`);
                await page.screenshot({ path: path.join(ARTIFACTS_DIR, item.name), fullPage: true });
                console.log(`Captured ${item.name}`);
            } catch (e) {
                console.error(`Failed to capture ${item.name}:`, e.message);
            }
        }

    } catch (error) {
        console.error('Fatal error:', error);
    } finally {
        if (browser) await browser.close();
        console.log('Browser closed.');
    }
})();
