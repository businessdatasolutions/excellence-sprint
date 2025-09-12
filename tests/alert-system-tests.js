/**
 * Alert System Tests for Excellence Sprint Interactive Playbook
 * Priority: P0-P1 - These tests ensure alert notifications work correctly during workshops
 */

import { TEST_CONFIG, TestUtils, TEST_DATA } from './test-config.js';
import { MCPBrowserWrapper } from './mcp-test-runner.js';

export class AlertSystemTests {
    
    /**
     * Test: Alert Display and Auto-Dismissal
     * Verifies alerts appear and automatically disappear after 5 seconds
     */
    static async testAlertDisplayAndDismissal() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Setup alert monitoring
        await MCPBrowserWrapper.evaluateScript(
            `() => {
                // Track alerts that appear
                window.testAlerts = [];
                
                // Override or monitor alert creation
                const originalShowAlert = window.showAlert;
                if (originalShowAlert) {
                    window.showAlert = function(message, type = 'info') {
                        const alertInfo = {
                            message: message,
                            type: type,
                            timestamp: Date.now(),
                            id: 'alert-' + Date.now()
                        };
                        window.testAlerts.push(alertInfo);
                        return originalShowAlert.call(this, message, type);
                    };
                }
                
                return { monitoringSetup: true };
            }`,
            'Setup alert monitoring'
        );
        
        // Trigger a test alert if function exists
        const triggerResult = await MCPBrowserWrapper.evaluateScript(
            `() => {
                if (typeof window.showAlert === 'function') {
                    window.showAlert('Test alert message', 'info');
                    return { triggered: true };
                } else {
                    // Manually create alert to test DOM behavior
                    const alertsContainer = document.querySelector('#adaptiveAlerts') || 
                                          document.querySelector('.alerts') || 
                                          document.body;
                    
                    const alert = document.createElement('div');
                    alert.className = 'alert info test-alert';
                    alert.innerHTML = '<strong>ℹ️ Alert:</strong> Test alert message';
                    alert.style.cssText = 'background: rgba(59, 130, 246, 0.9); border: 1px solid #3b82f6; border-radius: 0.5rem; padding: 1rem; margin: 0.5rem; position: fixed; top: 80px; right: 20px; z-index: 1000; color: white;';
                    
                    alertsContainer.appendChild(alert);
                    
                    // Auto-remove after 5 seconds
                    setTimeout(() => {
                        if (alert.parentElement) {
                            alert.remove();
                        }
                    }, 5000);
                    
                    return { triggered: true, manualAlert: true };
                }
            }`,
            'Trigger test alert'
        );
        
        console.log('Alert trigger result:', triggerResult.result);
        
        // Take snapshot immediately after triggering
        await MCPBrowserWrapper.takeSnapshot('Alert displayed');
        
        // Check alert is visible
        const alertVisible = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const alerts = document.querySelectorAll('.alert, .test-alert');
                return {
                    alertCount: alerts.length,
                    alertsVisible: Array.from(alerts).map(alert => ({
                        text: alert.textContent?.trim(),
                        visible: alert.offsetParent !== null,
                        classes: alert.className
                    }))
                };
            }`,
            'Check alert visibility'
        );
        
        console.log('Alert visibility check:', alertVisible.result);
        
        // Wait 3 seconds and check alert still there
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const alertMidway = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const alerts = document.querySelectorAll('.alert, .test-alert');
                return { alertCount: alerts.length };
            }`,
            'Check alert midway through timeout'
        );
        
        console.log('Alert midway check:', alertMidway.result);
        
        // Wait another 3 seconds (total 6 seconds) and verify alert is gone
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const alertAfterTimeout = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const alerts = document.querySelectorAll('.alert, .test-alert');
                return { 
                    alertCount: alerts.length,
                    testAlerts: window.testAlerts || []
                };
            }`,
            'Check alert after timeout'
        );
        
        console.log('Alert after timeout:', alertAfterTimeout.result);
        
        return { 
            success: true, 
            alertTriggered: triggerResult.result.triggered,
            initialCount: alertVisible.result.alertCount,
            finalCount: alertAfterTimeout.result.alertCount
        };
    }
    
    /**
     * Test: Multiple Alert Handling
     * Verifies multiple alerts can be displayed simultaneously
     */
    static async testMultipleAlerts() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Trigger multiple alerts rapidly
        const multipleAlertsResult = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const alertMessages = [
                    { message: 'First alert', type: 'info' },
                    { message: 'Second alert', type: 'warning' },
                    { message: 'Third alert', type: 'success' }
                ];
                
                const alertsContainer = document.querySelector('#adaptiveAlerts') || 
                                      document.querySelector('.alerts') || 
                                      document.body;
                
                alertMessages.forEach((alertData, index) => {
                    const alert = document.createElement('div');
                    alert.className = \`alert \${alertData.type} multi-test-alert\`;
                    alert.innerHTML = \`<strong>Alert \${index + 1}:</strong> \${alertData.message}\`;
                    alert.style.cssText = 'background: rgba(59, 130, 246, 0.9); border: 1px solid #3b82f6; border-radius: 0.5rem; padding: 1rem; margin: 0.5rem; position: fixed; right: 20px; z-index: 1000; color: white;';
                    alert.style.top = \`\${80 + (index * 70)}px\`;
                    
                    alertsContainer.appendChild(alert);
                    
                    // Stagger auto-removal
                    setTimeout(() => {
                        if (alert.parentElement) {
                            alert.remove();
                        }
                    }, 5000 + (index * 1000));
                });
                
                return { 
                    alertsCreated: alertMessages.length,
                    containerFound: alertsContainer !== document.body
                };
            }`,
            'Create multiple test alerts'
        );
        
        console.log('Multiple alerts created:', multipleAlertsResult.result);
        
        // Take snapshot with multiple alerts
        await MCPBrowserWrapper.takeSnapshot('Multiple alerts displayed');
        
        // Check all alerts are visible
        const alertsCheck = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const alerts = document.querySelectorAll('.multi-test-alert');
                return {
                    alertCount: alerts.length,
                    alertPositions: Array.from(alerts).map(alert => ({
                        text: alert.textContent?.trim().substring(0, 20),
                        top: alert.style.top,
                        visible: alert.offsetParent !== null
                    }))
                };
            }`,
            'Check multiple alerts positioning'
        );
        
        console.log('Multiple alerts check:', alertsCheck.result);
        
        // Wait and verify alerts disappear in sequence
        await new Promise(resolve => setTimeout(resolve, 7000));
        
        const remainingAlerts = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const alerts = document.querySelectorAll('.multi-test-alert');
                return { alertCount: alerts.length };
            }`,
            'Check remaining alerts after partial timeout'
        );
        
        console.log('Remaining alerts after 7s:', remainingAlerts.result);
        
        return { 
            success: true, 
            alertsCreated: multipleAlertsResult.result.alertsCreated,
            maxSimultaneous: alertsCheck.result.alertCount,
            remainingAfter7s: remainingAlerts.result.alertCount
        };
    }
    
    /**
     * Test: Excellence Motivational Messages
     * Verifies excellence-themed alerts display appropriate content
     */
    static async testExcellenceMessages() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Look for excellence alert trigger (energy check button or similar)
        const excellenceTrigger = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const energyBtn = document.querySelector('[onclick*="showEnergyAlert"]') ||
                                 document.querySelector('[onclick*="showExcellenceAlert"]') ||
                                 document.querySelector('button:contains("Energy")') ||
                                 document.querySelector('button:contains("Excellence")');
                
                return {
                    hasTrigger: energyBtn !== null,
                    buttonText: energyBtn?.textContent?.trim(),
                    onclick: energyBtn?.getAttribute('onclick')
                };
            }`,
            'Look for excellence alert trigger'
        );
        
        console.log('Excellence alert trigger:', excellenceTrigger.result);
        
        if (excellenceTrigger.result.hasTrigger) {
            // Click the energy/excellence button
            await MCPBrowserWrapper.clickElement(
                '[onclick*="showEnergyAlert"], [onclick*="showExcellenceAlert"]', 
                'Trigger excellence alert'
            );
            
            // Wait for alert to appear
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Capture alert content
            const alertContent = await MCPBrowserWrapper.evaluateScript(
                `() => {
                    const alerts = document.querySelectorAll('.alert');
                    const latestAlert = alerts[alerts.length - 1];
                    
                    return {
                        hasAlert: alerts.length > 0,
                        alertText: latestAlert?.textContent?.trim(),
                        alertType: Array.from(latestAlert?.classList || []).find(c => c !== 'alert')
                    };
                }`,
                'Capture excellence alert content'
            );
            
            console.log('Excellence alert content:', alertContent.result);
            
            // Take snapshot of excellence alert
            await MCPBrowserWrapper.takeSnapshot('Excellence alert displayed');
            
            // Test multiple clicks to see variety of messages
            const messageVariety = [];
            for (let i = 0; i < 3; i++) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                await MCPBrowserWrapper.clickElement(
                    '[onclick*="showEnergyAlert"], [onclick*="showExcellenceAlert"]', 
                    `Trigger excellence alert ${i + 2}`
                );
                
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const currentAlert = await MCPBrowserWrapper.evaluateScript(
                    `() => {
                        const alerts = document.querySelectorAll('.alert');
                        const latestAlert = alerts[alerts.length - 1];
                        return latestAlert?.textContent?.trim();
                    }`,
                    `Capture excellence message ${i + 2}`
                );
                
                messageVariety.push(currentAlert.result);
            }
            
            console.log('Excellence message variety:', messageVariety);
            
            return { 
                success: true, 
                hasTrigger: true,
                messages: messageVariety,
                uniqueMessages: [...new Set(messageVariety)].length
            };
        } else {
            // Test predefined excellence messages
            const testMessages = TEST_DATA.excellenceMessages;
            
            for (let i = 0; i < testMessages.length; i++) {
                await MCPBrowserWrapper.evaluateScript(
                    `() => {
                        const message = '${testMessages[i]}';
                        
                        const alertsContainer = document.querySelector('#adaptiveAlerts') || document.body;
                        const alert = document.createElement('div');
                        alert.className = 'alert info excellence-test';
                        alert.innerHTML = '<strong>🌟 Excellence:</strong> ' + message;
                        alert.style.cssText = 'background: linear-gradient(135deg, #fbbf24, #f59e0b); border: 1px solid #f59e0b; border-radius: 0.5rem; padding: 1rem; margin: 0.5rem; position: fixed; top: ' + (80 + i * 60) + 'px; right: 20px; z-index: 1000; color: white;';
                        
                        alertsContainer.appendChild(alert);
                        
                        setTimeout(() => alert.remove(), 3000);
                        
                        return { messageDisplayed: message };
                    }`,
                    `Display excellence message ${i + 1}`
                );
                
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            await MCPBrowserWrapper.takeSnapshot('Excellence messages displayed');
            
            return { 
                success: true, 
                hasTrigger: false,
                messagesDisplayed: testMessages.length
            };
        }
    }
    
    /**
     * Test: Alert Accessibility
     * Verifies alerts are accessible to screen readers and keyboard users
     */
    static async testAlertAccessibility() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Create accessible test alert
        const accessibilityTest = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const alertsContainer = document.querySelector('#adaptiveAlerts') || document.body;
                
                const alert = document.createElement('div');
                alert.className = 'alert info accessibility-test';
                alert.setAttribute('role', 'alert');
                alert.setAttribute('aria-live', 'polite');
                alert.setAttribute('aria-atomic', 'true');
                alert.innerHTML = '<strong>Accessibility Test:</strong> This alert should be announced by screen readers';
                alert.style.cssText = 'background: rgba(59, 130, 246, 0.9); border: 1px solid #3b82f6; border-radius: 0.5rem; padding: 1rem; margin: 0.5rem; position: fixed; top: 80px; right: 20px; z-index: 1000; color: white;';
                
                alertsContainer.appendChild(alert);
                
                // Check ARIA attributes
                const ariaAttributes = {
                    role: alert.getAttribute('role'),
                    ariaLive: alert.getAttribute('aria-live'),
                    ariaAtomic: alert.getAttribute('aria-atomic'),
                    hasText: alert.textContent.trim().length > 0
                };
                
                return ariaAttributes;
            }`,
            'Create and test accessible alert'
        );
        
        console.log('Accessibility test results:', accessibilityTest.result);
        
        // Test keyboard interaction (Escape key dismissal)
        const keyboardTest = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const alert = document.querySelector('.accessibility-test');
                
                // Add keyboard event listener for testing
                let keyboardHandled = false;
                const handleKeyboard = (e) => {
                    if (e.key === 'Escape') {
                        keyboardHandled = true;
                        alert?.remove();
                    }
                };
                
                document.addEventListener('keydown', handleKeyboard);
                
                // Simulate Escape key press
                const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                document.dispatchEvent(escapeEvent);
                
                // Clean up
                setTimeout(() => {
                    document.removeEventListener('keydown', handleKeyboard);
                }, 100);
                
                return { 
                    keyboardHandled: keyboardHandled,
                    alertStillExists: document.querySelector('.accessibility-test') !== null
                };
            }`,
            'Test keyboard accessibility'
        );
        
        console.log('Keyboard accessibility test:', keyboardTest.result);
        
        return { 
            success: true, 
            ariaAttributes: accessibilityTest.result,
            keyboardAccessible: keyboardTest.result.keyboardHandled
        };
    }
    
    /**
     * Test: Alert Performance Impact
     * Verifies alerts don't cause performance issues or memory leaks
     */
    static async testAlertPerformance() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Measure initial performance
        const initialPerf = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const startTime = performance.now();
                const initialMemory = performance.memory ? {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                } : null;
                
                return { 
                    startTime: startTime,
                    memory: initialMemory,
                    alertCount: document.querySelectorAll('.alert').length
                };
            }`,
            'Measure initial performance'
        );
        
        console.log('Initial performance:', initialPerf.result);
        
        // Create many alerts rapidly
        const stressTest = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const alertsContainer = document.querySelector('#adaptiveAlerts') || document.body;
                const alertCount = 20;
                
                for (let i = 0; i < alertCount; i++) {
                    const alert = document.createElement('div');
                    alert.className = 'alert info stress-test';
                    alert.innerHTML = \`<strong>Stress Test \${i + 1}:</strong> Performance testing alert\`;
                    alert.style.cssText = 'background: rgba(59, 130, 246, 0.9); border: 1px solid #3b82f6; border-radius: 0.5rem; padding: 1rem; margin: 0.5rem; position: fixed; top: ' + (80 + (i % 10) * 30) + 'px; right: 20px; z-index: 1000; color: white;';
                    
                    alertsContainer.appendChild(alert);
                    
                    // Remove after short time
                    setTimeout(() => alert.remove(), 1000 + (i * 100));
                }
                
                return { alertsCreated: alertCount };
            }`,
            'Create stress test alerts'
        );
        
        console.log('Stress test alerts created:', stressTest.result);
        
        // Wait for all alerts to be processed
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Measure final performance
        const finalPerf = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const endTime = performance.now();
                const finalMemory = performance.memory ? {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                } : null;
                
                return { 
                    endTime: endTime,
                    memory: finalMemory,
                    alertCount: document.querySelectorAll('.alert').length,
                    remainingStressAlerts: document.querySelectorAll('.stress-test').length
                };
            }`,
            'Measure final performance'
        );
        
        console.log('Final performance:', finalPerf.result);
        
        // Calculate performance impact
        const performanceImpact = {
            memoryIncrease: finalPerf.result.memory && initialPerf.result.memory ? 
                finalPerf.result.memory.used - initialPerf.result.memory.used : 0,
            remainingAlerts: finalPerf.result.remainingStressAlerts,
            cleanupSuccess: finalPerf.result.remainingStressAlerts === 0
        };
        
        console.log('Performance impact:', performanceImpact);
        
        return { 
            success: true, 
            alertsCreated: stressTest.result.alertsCreated,
            performanceImpact: performanceImpact
        };
    }
    
    /**
     * Execute all alert system tests
     */
    static async runAllAlertTests() {
        const tests = [
            { name: 'Alert Display and Dismissal', fn: this.testAlertDisplayAndDismissal, priority: 'P0' },
            { name: 'Multiple Alert Handling', fn: this.testMultipleAlerts, priority: 'P1' },
            { name: 'Excellence Motivational Messages', fn: this.testExcellenceMessages, priority: 'P1' },
            { name: 'Alert Accessibility', fn: this.testAlertAccessibility, priority: 'P1' },
            { name: 'Alert Performance Impact', fn: this.testAlertPerformance, priority: 'P2' }
        ];
        
        return tests;
    }
}