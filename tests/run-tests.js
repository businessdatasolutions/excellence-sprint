/**
 * Main Test Runner for Excellence Sprint Interactive Playbook
 * Executes comprehensive test suite using MCP Playwright server
 */

import { testRunner, MCPBrowserWrapper } from './mcp-test-runner.js';
import { TimerSystemTests } from './timer-system-tests.js';
import { NavigationSystemTests } from './navigation-system-tests.js';
import { AlertSystemTests } from './alert-system-tests.js';
import { TEST_CONFIG } from './test-config.js';

class ExcellenceSprintTestSuite {
    
    async runFullTestSuite() {
        console.log('🚀 Starting Excellence Sprint Interactive Playbook Test Suite');
        console.log('=' .repeat(70));
        
        try {
            // Initialize test environment
            await testRunner.initialize();
            await testRunner.validateEnvironment();
            
            // Collect all tests from different modules
            const allTests = [
                ...await TimerSystemTests.runAllTimerTests(),
                ...await NavigationSystemTests.runAllNavigationTests(),
                ...await AlertSystemTests.runAllAlertTests()
            ];
            
            console.log(`\n📋 Total tests to execute: ${allTests.length}`);
            console.log('Test breakdown:');
            const p0Tests = allTests.filter(t => t.priority === 'P0').length;
            const p1Tests = allTests.filter(t => t.priority === 'P1').length;
            const p2Tests = allTests.filter(t => t.priority === 'P2').length;
            
            console.log(`   P0 (Critical): ${p0Tests} tests`);
            console.log(`   P1 (Important): ${p1Tests} tests`);
            console.log(`   P2 (Nice-to-have): ${p2Tests} tests`);
            
            // Execute tests by priority
            const results = {
                p0: await this.runTestsByPriority(allTests, 'P0'),
                p1: await this.runTestsByPriority(allTests, 'P1'),
                p2: await this.runTestsByPriority(allTests, 'P2')
            };
            
            // Generate comprehensive report
            const finalReport = testRunner.generateReport([
                ...results.p0,
                ...results.p1,
                ...results.p2
            ]);
            
            // Additional analysis
            this.analyzeTestResults(finalReport);
            
            return finalReport;
            
        } catch (error) {
            console.error('❌ Test suite execution failed:', error);
            throw error;
        } finally {
            await testRunner.cleanup();
        }
    }
    
    async runTestsByPriority(allTests, priority) {
        const priorityTests = allTests.filter(test => test.priority === priority);
        
        if (priorityTests.length === 0) {
            return [];
        }
        
        console.log(`\n🎯 Executing ${priority} Tests (${priorityTests.length} tests)`);
        console.log('-'.repeat(50));
        
        const results = await testRunner.runTestSuite(priorityTests);
        
        const passed = results.filter(r => r.status === 'passed').length;
        const failed = results.filter(r => r.status === 'failed').length;
        
        console.log(`${priority} Results: ${passed} passed, ${failed} failed`);
        
        // For P0 tests, any failure is critical
        if (priority === 'P0' && failed > 0) {
            console.log('⚠️  CRITICAL: P0 test failures detected!');
            console.log('   Workshop reliability may be compromised.');
        }
        
        return results;
    }
    
    analyzeTestResults(report) {
        console.log('\n📊 Test Analysis');
        console.log('=' .repeat(50));
        
        // Overall health assessment
        const successRate = parseFloat(report.summary.successRate);
        
        let healthStatus;
        let recommendation;
        
        if (successRate >= 95) {
            healthStatus = '🟢 EXCELLENT';
            recommendation = 'Workshop-ready! All critical systems functioning properly.';
        } else if (successRate >= 90) {
            healthStatus = '🟡 GOOD';
            recommendation = 'Minor issues detected. Review failed tests before workshop.';
        } else if (successRate >= 80) {
            healthStatus = '🟠 CONCERNING';
            recommendation = 'Multiple issues found. Address failures before facilitating.';
        } else {
            healthStatus = '🔴 CRITICAL';
            recommendation = 'Significant problems detected. Do NOT use for workshops until fixed.';
        }
        
        console.log(`Application Health: ${healthStatus}`);
        console.log(`Success Rate: ${successRate}%`);
        console.log(`Recommendation: ${recommendation}`);
        
        // Detailed failure analysis
        if (report.errors.length > 0) {
            console.log('\n❌ Failed Tests Analysis:');
            report.errors.forEach(error => {
                console.log(`   • ${error.test}: ${error.error}`);
            });
        }
        
        // System readiness assessment
        const p0Tests = report.details.filter(t => t.priority === 'P0');
        const p0Failures = p0Tests.filter(t => t.status === 'failed').length;
        
        console.log(`\n🎯 Workshop Readiness Assessment:`);
        console.log(`   Critical System Failures (P0): ${p0Failures}`);
        console.log(`   Timer System: ${p0Failures === 0 ? '✅ Ready' : '❌ Issues detected'}`);
        console.log(`   Navigation System: ${p0Failures === 0 ? '✅ Ready' : '❌ Issues detected'}`);
        console.log(`   Alert System: ${p0Failures === 0 ? '✅ Ready' : '❌ Issues detected'}`);
        
        if (p0Failures === 0) {
            console.log('\n🎉 WORKSHOP CERTIFIED');
            console.log('   All critical systems validated.');
            console.log('   Safe for facilitator use in live sessions.');
        } else {
            console.log('\n⚠️  WORKSHOP NOT READY');
            console.log('   Critical issues must be resolved first.');
        }
    }
    
    async runQuickHealthCheck() {
        console.log('🏥 Running Quick Health Check...\n');
        
        try {
            await testRunner.initialize();
            
            // Basic connectivity and load test
            const loadTest = {
                name: 'Application Load Test',
                fn: async () => {
                    await MCPBrowserWrapper.navigateToApp();
                    const loadResult = await MCPBrowserWrapper.evaluateScript(
                        `() => ({
                            loaded: document.readyState === 'complete',
                            timerExists: document.querySelector('#timerDisplay') !== null,
                            navigationExists: document.querySelectorAll('.phase-header').length > 0,
                            timestamp: Date.now()
                        })`,
                        'Basic application health check'
                    );
                    
                    if (!loadResult.result.loaded || !loadResult.result.timerExists) {
                        throw new Error('Application failed to load properly');
                    }
                    
                    return loadResult;
                },
                priority: 'P0'
            };
            
            const quickTests = [loadTest];
            const results = await testRunner.runTestSuite(quickTests);
            
            if (results[0].status === 'passed') {
                console.log('✅ Quick Health Check: PASSED');
                console.log('   Application loads and core elements present');
            } else {
                console.log('❌ Quick Health Check: FAILED');
                console.log('   Application has loading issues');
            }
            
            return results[0].status === 'passed';
            
        } catch (error) {
            console.log('❌ Quick Health Check: ERROR');
            console.log(`   ${error.message}`);
            return false;
        } finally {
            await testRunner.cleanup();
        }
    }
}

// Export test suite instance
const testSuite = new ExcellenceSprintTestSuite();

// Command-line interface
if (typeof process !== 'undefined' && process.argv) {
    const command = process.argv[2];
    
    switch (command) {
        case 'quick':
            testSuite.runQuickHealthCheck()
                .then(passed => {
                    process.exit(passed ? 0 : 1);
                })
                .catch(error => {
                    console.error('Health check failed:', error);
                    process.exit(1);
                });
            break;
            
        case 'full':
        default:
            testSuite.runFullTestSuite()
                .then(report => {
                    const successRate = parseFloat(report.summary.successRate);
                    process.exit(successRate >= 90 ? 0 : 1);
                })
                .catch(error => {
                    console.error('Test suite failed:', error);
                    process.exit(1);
                });
            break;
    }
}

export { testSuite, ExcellenceSprintTestSuite };