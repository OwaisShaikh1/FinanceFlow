const puppeteer = require('puppeteer');

class PDFGenerator {
  constructor() {
    this.browser = null;
  }

  async initBrowser() {
    if (!this.browser) {
      console.log('PDF Generator: Initializing new browser instance');
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-features=VizDisplayCompositor'
        ],
        timeout: 30000
      });
      console.log('PDF Generator: Browser initialized successfully');
    }
    return this.browser;
  }

  async generateFromURL(url, options = {}) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      console.log('PDF Generator: Starting PDF generation for URL:', url);
      
      // Set viewport and user agent
      await page.setViewport({ width: 1200, height: 800 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      // Navigate to page with better error handling
      try {
        await page.goto(url, {
          waitUntil: 'networkidle0',
          timeout: 30000
        });
        console.log('PDF Generator: Page loaded successfully');
      } catch (navError) {
        console.error('PDF Generator: Navigation failed:', navError.message);
        throw new Error(`Failed to load page: ${navError.message}`);
      }

      // Wait for dynamic content and charts
      await page.waitForTimeout(5000);

      // Clean up page content for PDF  
      await page.evaluate(() => {
        console.log('PDF Generator: Starting page cleanup');
        
        // Remove unwanted elements
        const unwantedSelectors = [
          'nav', 'aside', 'header', 'footer',
          'button', 'a[href*="back"]', 'a[href*="dashboard"]',
          '.sidebar', '.navigation', '.nav-menu',
          '[class*="sidebar"]', '[class*="nav"]', '[class*="button"]',
          '.no-print', '.print-hide', '[data-print-hide]'
        ];
        
        unwantedSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            console.log('Removing element:', selector);
            el.remove();
          });
        });
        
        // Convert all canvas elements to images
        const canvases = document.querySelectorAll('canvas');
        console.log(`PDF Generator: Converting ${canvases.length} canvas elements`);
        
        canvases.forEach((canvas, index) => {
          try {
            const img = document.createElement('img');
            img.src = canvas.toDataURL('image/png');
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            canvas.parentNode.replaceChild(img, canvas);
            console.log(`Converted canvas ${index + 1}`);
          } catch (e) {
            console.error(`Failed to convert canvas ${index + 1}:`, e);
          }
        });
        
        // Clean up body styling
        document.body.style.margin = '0';
        document.body.style.padding = '20px';
        document.body.style.fontFamily = 'Arial, sans-serif';
        
        console.log('PDF Generator: Page cleanup completed');
      });

      // Wait for DOM updates
      await page.waitForTimeout(1000);

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          bottom: '0.5in',
          left: '0.5in',
          right: '0.5in'
        },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
            <span>Generated on ${new Date().toLocaleDateString('en-IN')} | FinanceFlow | Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
          </div>
        `,
        ...options
      });

      return pdfBuffer;
    } finally {
      await page.close();
    }
  }

  async generateFromHTML(html, options = {}) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      await page.setViewport({ width: 1200, height: 800 });
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.waitForTimeout(2000);

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          bottom: '0.5in',
          left: '0.5in',
          right: '0.5in'
        },
        ...options
      });

      return pdfBuffer;
    } finally {
      await page.close();
    }
  }

  async capturePageAsPDF(url, options = {}) {
    return await this.generateFromURL(url, options);
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = new PDFGenerator();
