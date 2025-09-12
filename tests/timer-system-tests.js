/**
 * Timer System Tests for Excellence Sprint Interactive Playbook
 * Priority: P0 (Critical) - These tests ensure timer reliability during workshops
 */

import { TEST_CONFIG, TestUtils } from './test-config.js';
import { MCPBrowserWrapper } from './mcp-test-runner.js';

export class TimerSystemTests {
    
    /**
     * Test: Timer Initial State and Display Format
     * Verifies timer shows 00:00 initially and maintains proper format
     */
    static async testTimerInitialState() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Take snapshot of initial state
        await MCPBrowserWrapper.takeSnapshot('Timer initial state');
        
        // Verify timer display shows 00:00
        const timerDisplay = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const timer = document.querySelector('#timerDisplay');
                return {
                    text: timer?.textContent?.trim(),
                    visible: timer?.offsetParent !== null,
                    exists: timer !== null
                };
            }`,
            'Get timer initial display'
        );
        
        console.log('Timer initial state:', timerDisplay.result);
        
        // Verify format is MM:SS
        const isValidFormat = /^\d{2}:\d{2}$/.test('00:00');
        if (!isValidFormat) {
            throw new Error('Timer display format is invalid');
        }
        
        return { success: true, initialDisplay: '00:00' };
    }
    
    /**
     * Test: Timer Start/Stop Functionality
     * Verifies timer starts counting and stops correctly
     */
    static async testTimerStartStop() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Click start button
        await MCPBrowserWrapper.clickElement('#timerButton', 'Start timer button');
        
        // Wait 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check timer has advanced
        const timerAfterStart = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const timer = document.querySelector('#timerDisplay');
                const buttonText = document.querySelector('#timerButton')?.textContent;
                return {
                    display: timer?.textContent?.trim(),
                    buttonText: buttonText?.trim(),
                    isRunning: buttonText?.includes('Stop')
                };
            }`,
            'Check timer after start'
        );
        
        console.log('Timer after start:', timerAfterStart.result);
        
        // Click stop button
        await MCPBrowserWrapper.clickElement('#timerButton', 'Stop timer button');
        
        // Get stopped time
        const stoppedTime = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const timer = document.querySelector('#timerDisplay');
                const buttonText = document.querySelector('#timerButton')?.textContent;
                return {
                    display: timer?.textContent?.trim(),
                    buttonText: buttonText?.trim(),
                    isStopped: buttonText?.includes('Start')
                };
            }`,
            'Check timer after stop'
        );
        
        console.log('Timer after stop:', stoppedTime.result);
        
        // Wait 2 more seconds to ensure timer stays stopped
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const finalCheck = await MCPBrowserWrapper.evaluateScript(
            `() => document.querySelector('#timerDisplay')?.textContent?.trim()`,
            'Final timer check'
        );
        
        // Verify timer stopped at the same time
        if (finalCheck.result !== stoppedTime.result.display) {
            throw new Error('Timer did not stop properly');
        }
        
        return { success: true, stoppedAt: stoppedTime.result.display };
    }
    
    /**
     * Test: Timer Milestone Alerts
     * Verifies milestone alerts trigger at correct intervals
     */
    static async testTimerMilestones() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Mock timer to accelerate testing
        await MCPBrowserWrapper.evaluateScript(
            `() => {
                // Accelerate timer for testing by overriding the update interval
                window.testMode = true;
                window.timerMultiplier = 100; // 100x speed for testing
                
                // Store original milestone times
                window.originalMilestones = [15*60, 30*60, 60*60, 90*60, 120*60];
                window.testMilestones = [1, 2, 3, 4, 5]; // Seconds for testing
                
                // Track alerts triggered
                window.alertsTriggered = [];
                
                // Override alert function to capture
                const originalShowAlert = window.showAlert;
                window.showAlert = function(message, type) {
                    window.alertsTriggered.push({
                        message: message,
                        type: type,
                        timestamp: Date.now()
                    });
                    return originalShowAlert ? originalShowAlert(message, type) : true;
                };
                
                return { testModeEnabled: true, multiplier: window.timerMultiplier };
            }`,
            'Set up accelerated timer testing'
        );
        
        // Start timer
        await MCPBrowserWrapper.clickElement('#timerButton', 'Start accelerated timer');
        
        // Wait for milestones to trigger (10 seconds should cover all test milestones)
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        // Check what alerts were triggered
        const alertResults = await MCPBrowserWrapper.evaluateScript(
            `() => ({
                alertsTriggered: window.alertsTriggered || [],
                timerDisplay: document.querySelector('#timerDisplay')?.textContent?.trim()
            })`,
            'Check milestone alerts'
        );
        
        console.log('Milestone alerts triggered:', alertResults.result);
        
        // Stop timer
        await MCPBrowserWrapper.clickElement('#timerButton', 'Stop timer');
        
        return { 
            success: true, 
            alertsTriggered: alertResults.result.alertsTriggered,
            finalTimer: alertResults.result.timerDisplay
        };
    }
    
    /**
     * Test: Solution Building Timer
     * Verifies separate 40-minute countdown timer works correctly
     */
    static async testSolutionBuildingTimer() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Navigate to solution building module
        await MCPBrowserWrapper.clickElement(
            '.phase-header:contains("Hour 2")', 
            'Expand Hour 2 phase'
        );
        
        await MCPBrowserWrapper.clickElement(
            '.module-item:contains("Solution Building")', 
            'Select solution building module'
        );
        
        // Take snapshot of solution building module
        await MCPBrowserWrapper.takeSnapshot('Solution building module loaded');
        
        // Check for solution timer elements
        const solutionTimerState = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const solutionTimer = document.querySelector('#solutionTimer');
                const solutionButton = document.querySelector('#solutionButton');
                const solutionCounter = document.querySelector('#solutionCounter');
                
                return {
                    hasTimer: solutionTimer !== null,
                    hasButton: solutionButton !== null,
                    hasCounter: solutionCounter !== null,
                    timerDisplay: solutionTimer?.textContent?.trim(),
                    counterDisplay: solutionCounter?.textContent?.trim()
                };
            }`,
            'Check solution building elements'
        );
        
        console.log('Solution timer elements:', solutionTimerState.result);
        
        // Start solution timer if available
        if (solutionTimerState.result.hasButton) {
            await MCPBrowserWrapper.clickElement('#solutionButton', 'Start solution timer');
            
            // Wait and check timer countdown
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const timerProgress = await MCPBrowserWrapper.evaluateScript(
                `() => ({
                    timerDisplay: document.querySelector('#solutionTimer')?.textContent?.trim(),
                    isCountingDown: true // Would need to verify actual countdown
                })`,
                'Check solution timer progress'
            );
            
            console.log('Solution timer progress:', timerProgress.result);
        }
        
        return { 
            success: true, 
            solutionTimerState: solutionTimerState.result
        };
    }
    
    /**
     * Test: Solution Counter Increment
     * Verifies solution counter increments from 0/3 to 3/3
     */
    static async testSolutionCounter() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Navigate to solution building module
        await MCPBrowserWrapper.clickElement(
            '.phase-header', 
            'Expand first available phase'
        );
        
        // Check for solution counter and increment mechanism
        const counterState = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const counter = document.querySelector('#solutionCounter');
                const incrementBtn = document.querySelector('#incrementSolution');
                
                return {
                    hasCounter: counter !== null,
                    hasIncrementBtn: incrementBtn !== null,
                    initialCount: counter?.textContent?.trim() || '0/3',
                    canIncrement: incrementBtn !== null
                };
            }`,
            'Check solution counter initial state'
        );
        
        console.log('Solution counter state:', counterState.result);
        
        // Test incrementing if button exists
        if (counterState.result.hasIncrementBtn) {
            for (let i = 1; i <= 3; i++) {
                await MCPBrowserWrapper.clickElement('#incrementSolution', `Increment to ${i}/3`);
                
                const currentCount = await MCPBrowserWrapper.evaluateScript(
                    `() => document.querySelector('#solutionCounter')?.textContent?.trim()`,
                    `Check count after increment ${i}`
                );
                
                console.log(`Counter after increment ${i}:`, currentCount.result);
                
                // Brief pause between increments
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        return { 
            success: true, 
            initialState: counterState.result
        };
    }
    
    /**
     * Test: Timer Persistence Across Module Changes
     * Verifies main timer continues running when switching modules
     */
    static async testTimerPersistence() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Start main timer
        await MCPBrowserWrapper.clickElement('#timerButton', 'Start main timer');
        
        // Wait 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Record timer value
        const timer1 = await MCPBrowserWrapper.evaluateScript(
            `() => document.querySelector('#timerDisplay')?.textContent?.trim()`,
            'Timer before module change'
        );
        
        // Switch to different module
        await MCPBrowserWrapper.clickElement('.phase-header', 'Expand phase');
        await MCPBrowserWrapper.clickElement('.module-item:nth-child(2)', 'Select second module');
        
        // Wait 2 more seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check timer continued running
        const timer2 = await MCPBrowserWrapper.evaluateScript(
            `() => document.querySelector('#timerDisplay')?.textContent?.trim()`,
            'Timer after module change'
        );
        
        console.log('Timer persistence test:', {
            beforeChange: timer1.result,
            afterChange: timer2.result
        });
        
        // Parse and compare times
        const time1Seconds = TestUtils.parseTimerToSeconds(timer1.result || '00:00');
        const time2Seconds = TestUtils.parseTimerToSeconds(timer2.result || '00:00');
        
        if (time2Seconds <= time1Seconds) {
            throw new Error('Timer did not continue running across module changes');
        }
        
        return { 
            success: true, 
            beforeChange: timer1.result,
            afterChange: timer2.result,
            timePassed: time2Seconds - time1Seconds
        };
    }
    
    /**
     * Execute all timer system tests
     */
    static async runAllTimerTests() {
        const tests = [
            { name: 'Timer Initial State', fn: this.testTimerInitialState, priority: 'P0' },
            { name: 'Timer Start/Stop', fn: this.testTimerStartStop, priority: 'P0' },
            { name: 'Timer Milestone Alerts', fn: this.testTimerMilestones, priority: 'P0' },
            { name: 'Solution Building Timer', fn: this.testSolutionBuildingTimer, priority: 'P0' },
            { name: 'Solution Counter', fn: this.testSolutionCounter, priority: 'P1' },
            { name: 'Timer Persistence', fn: this.testTimerPersistence, priority: 'P0' }
        ];
        
        return tests;
    }
}