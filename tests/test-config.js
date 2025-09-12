/**
 * Test Configuration for Excellence Sprint Interactive Playbook
 * Using MCP Playwright Server for browser automation
 */

export const TEST_CONFIG = {
    // Application URL - using VS Code Live Server
    baseUrl: 'http://localhost:5501/workshop-manual-v1.html',
    
    // Test timeouts
    defaultTimeout: 10000,
    extendedTimeout: 30000,
    
    // Browser configurations to test
    browsers: ['chromium', 'firefox', 'webkit'],
    
    // Screen sizes for responsive testing
    viewports: {
        desktop: { width: 1920, height: 1080 },
        laptop: { width: 1366, height: 768 },
        tablet: { width: 768, height: 1024 },
        mobile: { width: 390, height: 844 }
    },
    
    // Timer test scenarios
    timerScenarios: {
        milestones: [
            { minutes: 0, seconds: 15, message: '15-second test milestone' },
            { minutes: 1, seconds: 0, message: '1-minute test milestone' },
            { minutes: 2, seconds: 0, message: '2-minute test milestone' }
        ],
        solutionTimer: {
            duration: 40 * 60, // 40 minutes in seconds
            testDuration: 10 // Accelerated test duration in seconds
        }
    },
    
    // Workshop module structure
    modules: {
        'excellence-preparation': {
            phases: ['Space Design', 'Toolkit Preparation', 'Mindset Calibration']
        },
        'hour-1': {
            phases: ['Potential Revelation', 'Collaboration Mapping', 'Excellence Commitment']
        },
        'hour-2': {
            phases: ['Context Mastery', 'Solution Building', 'Success Showcase']
        },
        'hour-3': {
            phases: ['Excellence Challenge', 'Commitment Ceremony']
        }
    },
    
    // Alert testing configuration
    alerts: {
        autoCloseDuration: 5000, // 5 seconds
        types: ['info', 'success', 'warning', 'error']
    },
    
    // Performance thresholds
    performance: {
        loadTime: 3000, // 3 seconds max
        memoryUsage: 50 * 1024 * 1024, // 50MB max
        timerAccuracy: 100 // 100ms tolerance
    }
};

// Test utilities and helper functions
export const TestUtils = {
    
    /**
     * Wait for application to fully initialize
     */
    async waitForAppReady(page) {
        // Wait for DOM content to be loaded
        await page.evaluate(() => {
            return new Promise(resolve => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve);
                }
            });
        });
        
        // Wait for main timer display to be present
        await page.waitForSelector('#timerDisplay', { timeout: 5000 });
    },
    
    /**
     * Get current timer value from display
     */
    async getTimerDisplay(page) {
        const timerText = await page.locator('#timerDisplay').textContent();
        return timerText.trim();
    },
    
    /**
     * Parse timer display into seconds
     */
    parseTimerToSeconds(timerDisplay) {
        const [minutes, seconds] = timerDisplay.split(':').map(Number);
        return minutes * 60 + seconds;
    },
    
    /**
     * Format seconds to MM:SS display format
     */
    formatSecondsToTimer(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    /**
     * Take screenshot with timestamp for debugging
     */
    async takeDebugScreenshot(page, testName, step = '') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `debug-${testName}-${step}-${timestamp}.png`;
        await page.screenshot({ path: `tests/screenshots/${filename}`, fullPage: true });
        return filename;
    },
    
    /**
     * Verify element is visible and clickable
     */
    async verifyElementReady(page, selector) {
        const element = page.locator(selector);
        await element.waitFor({ state: 'visible' });
        await element.waitFor({ state: 'attached' });
        return element;
    },
    
    /**
     * Get all console messages during test execution
     */
    setupConsoleLogging(page) {
        const messages = [];
        page.on('console', msg => {
            messages.push({
                type: msg.type(),
                text: msg.text(),
                timestamp: new Date().toISOString()
            });
        });
        return messages;
    },
    
    /**
     * Check for JavaScript errors
     */
    async checkForJavaScriptErrors(consoleMessages) {
        const errors = consoleMessages.filter(msg => msg.type === 'error');
        if (errors.length > 0) {
            console.warn('JavaScript errors detected:', errors);
            return errors;
        }
        return [];
    }
};

// Test data for various scenarios
export const TEST_DATA = {
    
    sampleNotes: {
        short: "Quick test note",
        medium: "This is a medium-length note that might be typical for a facilitator during a workshop session.",
        long: "This is a longer note that a facilitator might take during an extended workshop session. It includes multiple sentences and covers various aspects of the workshop progress, participant engagement, and technical observations that might be important to remember for future sessions."
    },
    
    excellenceMessages: [
        'Excellence check: How is the room feeling?',
        'Remember: your energy sets the ceiling',
        'Quick wins create momentum - celebrate small victories'
    ],
    
    moduleTestFlow: [
        'excellence-preparation-space-design',
        'excellence-preparation-toolkit',
        'hour-1-potential-revelation',
        'hour-2-solution-building',
        'hour-3-commitment-ceremony'
    ]
};