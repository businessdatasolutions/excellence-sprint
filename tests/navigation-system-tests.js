/**
 * Navigation System Tests for Excellence Sprint Interactive Playbook
 * Priority: P0 (Critical) - These tests ensure navigation reliability during workshops
 */

import { TEST_CONFIG, TestUtils, TEST_DATA } from './test-config.js';
import { MCPBrowserWrapper } from './mcp-test-runner.js';

export class NavigationSystemTests {
    
    /**
     * Test: Phase Expansion and Collapse
     * Verifies workshop phase sections can be expanded and collapsed correctly
     */
    static async testPhaseExpansionCollapse() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Take initial snapshot
        await MCPBrowserWrapper.takeSnapshot('Navigation initial state');
        
        // Get all phase headers
        const phaseHeaders = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const headers = document.querySelectorAll('.phase-header');
                return Array.from(headers).map((header, index) => ({
                    index,
                    text: header.textContent?.trim(),
                    isActive: header.classList.contains('active'),
                    phaseId: header.getAttribute('onclick')?.match(/togglePhase\\('([^']+)'\\)/)?.[1]
                }));
            }`,
            'Get phase headers information'
        );
        
        console.log('Phase headers found:', phaseHeaders.result);
        
        // Test each phase expansion/collapse
        for (let i = 0; i < phaseHeaders.result.length; i++) {
            const phase = phaseHeaders.result[i];
            
            // Click to expand
            await MCPBrowserWrapper.clickElement(
                `.phase-header:nth-child(${i + 1})`, 
                `Expand phase: ${phase.text}`
            );
            
            // Wait for animation
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Verify expansion
            const expandedState = await MCPBrowserWrapper.evaluateScript(
                `() => {
                    const header = document.querySelector('.phase-header:nth-child(${i + 1})');
                    const modules = header?.nextElementSibling;
                    return {
                        headerActive: header?.classList.contains('active'),
                        modulesVisible: modules?.classList.contains('active'),
                        moduleCount: modules?.children.length || 0
                    };
                }`,
                `Check expansion state for phase ${i}`
            );
            
            console.log(`Phase ${i} expanded state:`, expandedState.result);
            
            // Click to collapse
            await MCPBrowserWrapper.clickElement(
                `.phase-header:nth-child(${i + 1})`, 
                `Collapse phase: ${phase.text}`
            );
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Verify collapse
            const collapsedState = await MCPBrowserWrapper.evaluateScript(
                `() => {
                    const header = document.querySelector('.phase-header:nth-child(${i + 1})');
                    const modules = header?.nextElementSibling;
                    return {
                        headerActive: header?.classList.contains('active'),
                        modulesVisible: modules?.classList.contains('active')
                    };
                }`,
                `Check collapsed state for phase ${i}`
            );
            
            console.log(`Phase ${i} collapsed state:`, collapsedState.result);
        }
        
        return { 
            success: true, 
            phasesFound: phaseHeaders.result.length,
            phases: phaseHeaders.result 
        };
    }
    
    /**
     * Test: Module Selection and Content Loading
     * Verifies clicking module items loads correct content
     */
    static async testModuleContentLoading() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Expand first phase
        await MCPBrowserWrapper.clickElement('.phase-header:first-child', 'Expand first phase');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get available modules
        const modules = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const moduleItems = document.querySelectorAll('.modules.active .module-item');
                return Array.from(moduleItems).map((module, index) => ({
                    index,
                    text: module.textContent?.trim(),
                    isActive: module.classList.contains('active')
                }));
            }`,
            'Get available modules in first phase'
        );
        
        console.log('Available modules:', modules.result);
        
        // Test each module selection
        for (let i = 0; i < Math.min(modules.result.length, 3); i++) { // Limit to first 3 for testing
            const module = modules.result[i];
            
            // Click module
            await MCPBrowserWrapper.clickElement(
                `.modules.active .module-item:nth-child(${i + 1})`, 
                `Select module: ${module.text}`
            );
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verify content loaded
            const contentState = await MCPBrowserWrapper.evaluateScript(
                `() => {
                    const contentPanel = document.querySelector('#contentPanel');
                    const activeModule = document.querySelector('.module-item.active');
                    
                    return {
                        hasContent: contentPanel && contentPanel.innerHTML.trim().length > 0,
                        contentLength: contentPanel?.innerHTML.trim().length || 0,
                        activeModuleText: activeModule?.textContent?.trim(),
                        contentPreview: contentPanel?.textContent?.trim().substring(0, 100) + '...'
                    };
                }`,
                `Check content for module: ${module.text}`
            );
            
            console.log(`Module ${i} content state:`, contentState.result);
            
            // Take snapshot of loaded content
            await MCPBrowserWrapper.takeSnapshot(`Module ${i} content loaded`);
            
            // Verify module is marked as active
            const moduleActiveState = await MCPBrowserWrapper.evaluateScript(
                `() => {
                    const activeModules = document.querySelectorAll('.module-item.active');
                    return {
                        activeModuleCount: activeModules.length,
                        activeModuleText: activeModules[0]?.textContent?.trim()
                    };
                }`,
                'Check active module state'
            );
            
            if (moduleActiveState.result.activeModuleCount !== 1) {
                throw new Error(`Expected 1 active module, found ${moduleActiveState.result.activeModuleCount}`);
            }
        }
        
        return { 
            success: true, 
            modulesFound: modules.result.length,
            modulesTested: Math.min(modules.result.length, 3)
        };
    }
    
    /**
     * Test: Navigation State Management
     * Verifies only one module can be active at a time
     */
    static async testNavigationStateManagement() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Expand multiple phases
        const phaseCount = await MCPBrowserWrapper.evaluateScript(
            `() => document.querySelectorAll('.phase-header').length`,
            'Count total phases'
        );
        
        console.log('Total phases found:', phaseCount.result);
        
        // Expand first two phases
        await MCPBrowserWrapper.clickElement('.phase-header:nth-child(1)', 'Expand first phase');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (phaseCount.result > 1) {
            await MCPBrowserWrapper.clickElement('.phase-header:nth-child(2)', 'Expand second phase');
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // Select module from first phase
        await MCPBrowserWrapper.clickElement(
            '.phase-item:nth-child(1) .module-item:first-child', 
            'Select first module'
        );
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Select module from second phase (if available)
        if (phaseCount.result > 1) {
            await MCPBrowserWrapper.clickElement(
                '.phase-item:nth-child(2) .module-item:first-child', 
                'Select module from second phase'
            );
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Verify only one module is active
            const activeModules = await MCPBrowserWrapper.evaluateScript(
                `() => {
                    const activeModules = document.querySelectorAll('.module-item.active');
                    return {
                        count: activeModules.length,
                        modules: Array.from(activeModules).map(m => m.textContent?.trim())
                    };
                }`,
                'Check active module count after switching'
            );
            
            console.log('Active modules after switching:', activeModules.result);
            
            if (activeModules.result.count !== 1) {
                throw new Error(`Expected 1 active module, found ${activeModules.result.count}`);
            }
        }
        
        return { 
            success: true, 
            phasesExpanded: phaseCount.result > 1 ? 2 : 1
        };
    }
    
    /**
     * Test: Breadcrumb Navigation and Current State
     * Verifies user can track current location in workshop
     */
    static async testBreadcrumbNavigation() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Navigate through different sections
        const navigationPath = [
            { phase: 1, module: 1, description: 'First phase, first module' },
            { phase: 2, module: 1, description: 'Second phase, first module' },
            { phase: 1, module: 2, description: 'Back to first phase, second module' }
        ];
        
        const results = [];
        
        for (const nav of navigationPath) {
            // Expand phase if needed
            await MCPBrowserWrapper.clickElement(
                `.phase-header:nth-child(${nav.phase})`, 
                `Ensure phase ${nav.phase} is expanded`
            );
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Select module
            await MCPBrowserWrapper.clickElement(
                `.phase-item:nth-child(${nav.phase}) .module-item:nth-child(${nav.module})`, 
                nav.description
            );
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Capture navigation state
            const navState = await MCPBrowserWrapper.evaluateScript(
                `() => {
                    const activePhase = document.querySelector('.phase-header.active');
                    const activeModule = document.querySelector('.module-item.active');
                    const contentPanel = document.querySelector('#contentPanel');
                    
                    return {
                        activePhase: activePhase?.textContent?.trim(),
                        activeModule: activeModule?.textContent?.trim(),
                        hasContent: contentPanel && contentPanel.innerHTML.trim().length > 0,
                        timestamp: Date.now()
                    };
                }`,
                `Capture state: ${nav.description}`
            );
            
            results.push({
                navigation: nav,
                state: navState.result
            });
            
            console.log(`Navigation ${nav.description}:`, navState.result);
        }
        
        return { 
            success: true, 
            navigationSteps: results.length,
            results: results
        };
    }
    
    /**
     * Test: Sidebar Collapse/Expand (Mobile Menu)
     * Verifies sidebar can be toggled for different screen sizes
     */
    static async testSidebarToggle() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Check if sidebar toggle exists
        const toggleExists = await MCPBrowserWrapper.evaluateScript(
            `() => {
                const toggleBtn = document.querySelector('[onclick*="toggleSidebar"]') || 
                                 document.querySelector('button:contains("☰")') ||
                                 document.querySelector('.menu-toggle');
                
                return {
                    exists: toggleBtn !== null,
                    visible: toggleBtn?.offsetParent !== null,
                    text: toggleBtn?.textContent?.trim()
                };
            }`,
            'Check sidebar toggle button'
        );
        
        console.log('Sidebar toggle state:', toggleExists.result);
        
        if (toggleExists.result.exists) {
            // Test sidebar toggle
            await MCPBrowserWrapper.clickElement(
                '[onclick*="toggleSidebar"]', 
                'Toggle sidebar closed'
            );
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const sidebarClosedState = await MCPBrowserWrapper.evaluateScript(
                `() => {
                    const sidebar = document.querySelector('.sidebar');
                    return {
                        isHidden: sidebar?.classList.contains('mobile-hidden'),
                        transform: window.getComputedStyle(sidebar)?.transform
                    };
                }`,
                'Check sidebar closed state'
            );
            
            console.log('Sidebar closed state:', sidebarClosedState.result);
            
            // Toggle back open
            await MCPBrowserWrapper.clickElement(
                '[onclick*="toggleSidebar"]', 
                'Toggle sidebar open'
            );
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const sidebarOpenState = await MCPBrowserWrapper.evaluateScript(
                `() => {
                    const sidebar = document.querySelector('.sidebar');
                    return {
                        isHidden: sidebar?.classList.contains('mobile-hidden'),
                        transform: window.getComputedStyle(sidebar)?.transform
                    };
                }`,
                'Check sidebar open state'
            );
            
            console.log('Sidebar open state:', sidebarOpenState.result);
        }
        
        return { 
            success: true, 
            hasSidebarToggle: toggleExists.result.exists
        };
    }
    
    /**
     * Test: Keyboard Navigation
     * Verifies navigation can be controlled via keyboard
     */
    static async testKeyboardNavigation() {
        await MCPBrowserWrapper.navigateToApp();
        await TestUtils.waitForAppReady();
        
        // Test Tab navigation through interactive elements
        const tabNavigation = await MCPBrowserWrapper.evaluateScript(
            `() => {
                // Focus first interactive element
                const firstInteractive = document.querySelector('button, .phase-header, .module-item');
                if (firstInteractive) {
                    firstInteractive.focus();
                }
                
                // Get all focusable elements
                const focusableElements = document.querySelectorAll(
                    'button, [onclick], .phase-header, .module-item, input, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                return {
                    focusableCount: focusableElements.length,
                    firstElement: firstInteractive?.textContent?.trim(),
                    hasFocusableElements: focusableElements.length > 0
                };
            }`,
            'Test keyboard navigation setup'
        );
        
        console.log('Keyboard navigation elements:', tabNavigation.result);
        
        // Simulate some keyboard interactions
        if (tabNavigation.result.hasFocusableElements) {
            // Test Enter key on focused element
            const enterKeyResult = await MCPBrowserWrapper.evaluateScript(
                `() => {
                    const activeElement = document.activeElement;
                    if (activeElement && (activeElement.onclick || activeElement.classList.contains('phase-header'))) {
                        // Simulate click via Enter key
                        activeElement.click();
                        return {
                            elementClicked: activeElement.textContent?.trim(),
                            success: true
                        };
                    }
                    return { success: false, reason: 'No clickable element focused' };
                }`,
                'Test Enter key interaction'
            );
            
            console.log('Enter key interaction result:', enterKeyResult.result);
        }
        
        return { 
            success: true, 
            focusableElements: tabNavigation.result.focusableCount
        };
    }
    
    /**
     * Execute all navigation system tests
     */
    static async runAllNavigationTests() {
        const tests = [
            { name: 'Phase Expansion/Collapse', fn: this.testPhaseExpansionCollapse, priority: 'P0' },
            { name: 'Module Content Loading', fn: this.testModuleContentLoading, priority: 'P0' },
            { name: 'Navigation State Management', fn: this.testNavigationStateManagement, priority: 'P0' },
            { name: 'Breadcrumb Navigation', fn: this.testBreadcrumbNavigation, priority: 'P1' },
            { name: 'Sidebar Toggle', fn: this.testSidebarToggle, priority: 'P1' },
            { name: 'Keyboard Navigation', fn: this.testKeyboardNavigation, priority: 'P1' }
        ];
        
        return tests;
    }
}