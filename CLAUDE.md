# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Liberation Sprint is an interactive workshop platform designed to help organizations become self-sufficient in AI adoption without consultant dependency. The workshop transforms learned helplessness around technology into empowered capability through hands-on context engineering and rapid solution prototyping.

## High-Level Architecture

The project consists of interactive HTML applications that serve as facilitation tools for workshop delivery:

1. **Workshop Manual v1 - English** (`workshop-manual-v1.html`) - Enhanced Excellence Sprint facilitator interface with:
   - Sidebar navigation for workshop phases (Excellence Preparation, Hour 1-3)
   - Count-up timer system with milestone alerts at 15min, 30min, 1hr, 90min, 2hr
   - Solution tracker for "3-for-lunch" promise (40-minute countdown)
   - Excellence-themed content with empowerment focus
   - Note-taking capability (but no localStorage implementation yet)
   - Excellence alerts and randomized motivational messages
   - Blue/gold color scheme for positive psychology

2. **Workshop Manual v1 - Dutch Complete** (`workshop-manual-v1-dutch-complete.html`) - **NEW: Complete Dutch version**:
   - **PRODUCTION READY**: Full feature parity with English version
   - **Professional Dutch**: Business terminology suitable for healthcare executives
   - **Complete Content**: All 11 modules with comprehensive Dutch translations
   - **Functional Solution Counter**: Working "3-voor-lunch" tracking (0/3 → 1/3 → 2/3 → 3/3)
   - **Dutch UI Controls**: "Timer Starten", "Pauzeer", "Hervat" timer system
   - **Mobile Optimized**: WCAG-compliant touch targets (44px+)
   - **Healthcare Context**: Targeted for Carinova, Amarant, Inovum organizations
   - **Quality Assured**: Comprehensive UX testing completed

3. **Workshop Manual v1 - Dutch Basic** (`workshop-manual-v1-nl.html`) - Simplified Dutch version with:
   - Basic module structure and navigation
   - Limited content compared to complete versions
   - Missing collaboration quadrants (resolved in Issue 003)
   - Mobile-responsive design improvements completed

4. **Workshop Manual** (`workshop-manual.html`) - Original Liberation Sprint interface with:
   - Countdown timer per module with time warnings
   - Problem marketplace and context revolution modules
   - Adaptive response strategies for various scenarios
   - Mobile-responsive design with overlay system

5. **Room Layout Visualizer** (`room-layout.html`) - Interactive room configuration tool
   - Visual representation of optimal workshop space setup
   - Dynamic layout adjustment for different room sizes

6. **Background Materials** (`background-material/`) - Workshop design documentation
   - Detailed workshop flow and psychology
   - Liberation methodology principles

## Key Commands

### Development & Testing

```bash
# Start local development server (VS Code Live Server configured)
# Right-click on HTML file and select "Open with Live Server"
# Or use VS Code Live Server extension on port 5501

# Test in browser
open workshop-manual-v1.html              # Excellence Sprint version (English)
open workshop-manual-v1-dutch-complete.html  # Excellence Sprint version (Dutch Complete) - RECOMMENDED
open workshop-manual-v1-nl.html           # Excellence Sprint version (Dutch Basic)
open workshop-manual.html                 # Original Liberation Sprint
open room-layout.html

# No build process required - pure HTML/CSS/JavaScript
```

### Git Operations

```bash
# Check changes
git status
git diff

# Stage and commit
git add .
git commit -m "message"

# View history
git log --oneline
```

## Workshop Versions & Flow

### Excellence Sprint (v1) - Empowerment Focus

The Excellence Sprint follows a positive psychology approach with three distinct hours:

1. **Excellence Preparation** (30min)
   - Excellence Space Design with three empowerment zones
   - Empowerment Toolkit preparation
   - Excellence Mindset calibration

2. **Hour 1: Discovering Our Potential** (60min)
   - Potential Revelation (15min) - Live capability demonstration
   - Collaboration Mapping (20min) - Building bridges across expertise
   - Excellence Commitment (25min) - Public declaration of goals

3. **Hour 2: Building Excellence** (75min)
   - Context Mastery Method (10min) - The empowerment secret
   - Excellence Solution Building (40min) - "3-for-lunch" promise tracking
   - Success Showcase (25min) - Victory lap competition

4. **Hour 3: Sustaining Excellence** (75min)
   - 30-Day Excellence Challenge (35min) - Personal mission design
   - Commitment Ceremony (40min) - Manifesto signing and certification

### Original Liberation Sprint - Revolution Focus

The original Liberation Sprint uses a more direct "revolution against consultants" approach with adaptive responses for various scenarios.

## Technical Implementation Details

### State Management

**Excellence Sprint (v1):**
- Currently no localStorage implementation
- Note textareas present but data not persisted
- Checkboxes for checklists but no state saving
- Timer state maintained only during session

**Original Sprint:**
- Full localStorage implementation for:
  - Module notes (key: `notes-{moduleId}`)
  - Checklist states (key: `check-{checkboxId}`)
- Auto-save with 500ms debouncing on note inputs
- No backend required - fully client-side application

### Timer Systems

**Excellence Sprint (v1):**
- Count-up timer starting from 00:00
- No pause functionality - only start/stop via button text toggle
- Milestone alerts at key intervals (15min, 30min, 1hr, 90min, 2hr)
- Separate 40-minute countdown for solution building module
- Solution tracker with incrementing counter (0/3 to 3/3)
- Timer persists across module changes (continues running)

**Original Sprint:**
- Countdown timer per module with configurable durations
- Full pause/resume functionality
- Visual alerts at 50%, 25%, and 1-minute marks
- Color-coded display based on remaining time
- Timer resets when switching modules

### Content Architecture

- Workshop Manual v1: Content embedded directly in `getModuleContent()` function
- Original Manual: Content in `workshopContent` JavaScript object
- Dynamic content loading based on module selection
- Responsive design with mobile-specific overlay system

### Key JavaScript Functions

**Excellence Sprint (v1 - English & Dutch Complete):**
- `loadModuleContent()`: Loads content dynamically from `getModuleContent()`
- `getModuleContent()`: Returns HTML content for each module
- `selectModule()`: Updates navigation state and loads module content
- `togglePhase()`: Expands/collapses workshop phase sections
- `startTimer()`: Timer control with Dutch UI ("Timer Starten", "Pauzeer", "Hervat")
- `addSolution()`: **NEW**: Solution counter for "3-voor-lunch" tracking
- `updateSolutionDisplay()`: **NEW**: Updates solution progress (0/3 → 1/3 → 2/3 → 3/3)
- `showExcellenceAlert()`: Displays randomized excellence-themed messages (Dutch)
- `showAlert()`: Creates temporary alerts with auto-dismiss (5 seconds)

**Original Sprint:**
- `selectModule()`: Loads content and sets countdown timer
- `startTimer()`, `pauseTimer()`, `resetTimer()`: Full timer controls
- `showAlert()`, `showEnergyAlert()`: Contextual notifications
- `loadContent()`: Renders module content with proper event listeners
- `storage` wrapper: Safe localStorage access with error handling

## Workshop Psychology & Facilitation

The codebase implements specific psychological triggers:

**Excellence Sprint (v1) - Positive Psychology Approach:**
- **Empowerment language**: "Excellence", "capability", "potential" vs "liberation"
- **Celebration focus**: Victory laps, certificates, achievement tracking
- **Collaborative framing**: Building together vs breaking dependencies
- **Progress visualization**: Live solution tracker, milestone alerts, "3-voor-lunch" counter
- **Sustained momentum**: 30-day challenge with personal missions
- **Dutch Adaptation**: Professional healthcare terminology for Nederlandse zorgorganisaties

**Original Sprint - Revolution Psychology:**
- **Urgency creation**: "Consultant dependency" framing
- **Physical movement**: Spectrum exercises reveal dynamics
- **Public commitment**: Social pressure drives follow-through
- **Time pressure**: Constraints force action over analysis
- **Peer learning**: Mixed IT/business teams break silos

## Translation Implementation - Nederlandse Versie ✅ VOLTOOID

### Complete Dutch Workshop Manual (2025-09-12)

**Production Ready File**: `workshop-manual-v1-dutch-complete.html`

**Implementatie Highlights**:
- ✅ **Complete Feature Parity**: Exact copy of English version with full functionality
- ✅ **Professional Dutch**: 200+ elements professionally translated for healthcare context
- ✅ **Solution Counter System**: Working "3-voor-lunch" tracker with Dutch alerts
- ✅ **Dutch UI Controls**: "Timer Starten" → "Pauzeer" → "Hervat" button cycle
- ✅ **Mobile Optimization**: WCAG-compliant touch targets (44px minimum)
- ✅ **Healthcare Terminology**: Specialized for Carinova, Amarant, Inovum organizations
- ✅ **Quality Assurance**: Comprehensive UX testing by specialized agents

**Translation Strategy Documentation**:
- `docs/translation_strategy_nl.md` - Professional Dutch business language strategy
- `docs/terminology_nl.md` - Healthcare-specific terminology database  
- `docs/translation_guidelines_nl.md` - Professional language guidelines
- `dutch-translation-requirements.json` - Systematic translation mapping

**Testing & Quality Assurance**:
- `issues/005-junior-developer-task-list-dutch-workshop.md` - Detailed implementation tasks
- `testing-results-005-junior-dev-tasks.md` - Complete validation results
- Playwright automated testing framework implemented
- Professional language review for healthcare executives

## Security Considerations

Workshop emphasizes security-first approach for healthcare context:

- Never process real patient data
- Use synthetic data for all demonstrations
- GDPR/AVG compliance built into context templates
- Clear boundaries between learning and production

## Implementation Status & Future Enhancements

### ✅ RESOLVED Implementation Gaps:

- ✅ **Complete Dutch Translation**: Professional healthcare terminology implemented
- ✅ **Full Content Implementation**: All 11 modules with comprehensive content
- ✅ **Mobile Responsiveness**: WCAG-compliant touch targets and responsive design
- ✅ **Solution Tracking**: Functional "3-voor-lunch" promise counter
- ✅ **Professional UI**: Dutch business language throughout interface

### Current Gaps Remaining in v1:

- **Missing localStorage**: Note-taking and checklist state not persisted
- **No pause functionality**: Timer can only start/stop, not pause
- **Limited collaboration features**: No real-time sharing capabilities

### Recommended Future Enhancements:

- Port localStorage functionality from original to v1
- Add pause/resume capability to Excellence Sprint timer
- Export functionality for notes and commitments
- **PDF Certificate Generation**: Implement Issue 004 - Modal-based certificate creation
- Analytics dashboard for tracking workshop outcomes
- Template library for common problem/solution patterns
- Integration with collaboration platforms (Teams, Slack)
- Progressive web app capabilities for offline use
- Multi-language toggle (Dutch/English switching)