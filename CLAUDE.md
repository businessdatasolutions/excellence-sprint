# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Liberation Sprint is an interactive workshop platform designed to help organizations become self-sufficient in AI adoption without consultant dependency. The workshop transforms learned helplessness around technology into empowered capability through hands-on context engineering and rapid solution prototyping.

## High-Level Architecture

The project consists of interactive HTML applications that serve as facilitation tools for workshop delivery:

1. **Workshop Manual v1** (`workshop-manual-v1.html`) - Enhanced Excellence Sprint facilitator interface with:
   - Sidebar navigation for workshop phases (Excellence Preparation, Hour 1-3)
   - Count-up timer system with milestone alerts at 15min, 30min, 1hr, 90min, 2hr
   - Solution tracker for "3-for-lunch" promise (40-minute countdown)
   - Excellence-themed content with empowerment focus
   - Note-taking capability (but no localStorage implementation yet)
   - Excellence alerts and randomized motivational messages
   - Simplified timer without pause functionality
   - Blue/gold color scheme for positive psychology

2. **Workshop Manual** (`workshop-manual.html`) - Original Liberation Sprint interface with:
   - Countdown timer per module with time warnings
   - Problem marketplace and context revolution modules
   - Adaptive response strategies for various scenarios
   - Mobile-responsive design with overlay system

3. **Room Layout Visualizer** (`room-layout.html`) - Interactive room configuration tool
   - Visual representation of optimal workshop space setup
   - Dynamic layout adjustment for different room sizes

4. **Background Materials** (`background-material/`) - Workshop design documentation
   - Detailed workshop flow and psychology
   - Liberation methodology principles

## Key Commands

### Development & Testing

```bash
# Start local development server (VS Code Live Server configured)
# Right-click on HTML file and select "Open with Live Server"
# Or use VS Code Live Server extension on port 5501

# Test in browser
open workshop-manual-v1.html  # Excellence Sprint version
open workshop-manual.html     # Original Liberation Sprint
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

**Excellence Sprint (v1):**
- `loadModuleContent()`: Loads content dynamically from `getModuleContent()`
- `getModuleContent()`: Returns HTML content for each module
- `selectModule()`: Updates navigation state and loads module content
- `togglePhase()`: Expands/collapses workshop phase sections
- `startTimer()`: Single-button timer control (no pause function)
- `showExcellenceAlert()`: Displays randomized excellence-themed messages
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
- **Progress visualization**: Live solution tracker, milestone alerts
- **Sustained momentum**: 30-day challenge with personal missions

**Original Sprint - Revolution Psychology:**
- **Urgency creation**: "Consultant dependency" framing
- **Physical movement**: Spectrum exercises reveal dynamics
- **Public commitment**: Social pressure drives follow-through
- **Time pressure**: Constraints force action over analysis
- **Peer learning**: Mixed IT/business teams break silos

## Security Considerations

Workshop emphasizes security-first approach for healthcare context:

- Never process real patient data
- Use synthetic data for all demonstrations
- GDPR/AVG compliance built into context templates
- Clear boundaries between learning and production

## Implementation Gaps & Future Enhancements

### Current Gaps in v1 (Excellence Sprint):

- **Missing localStorage**: Note-taking and checklist state not persisted
- **No pause functionality**: Timer can only start/stop, not pause
- **Limited content**: Only partial module content implemented
- **No mobile responsiveness**: Missing mobile overlay and menu toggle
- **No progress tracking**: No visual progress bar across modules

### Recommended Enhancements:

- Port localStorage functionality from original to v1
- Add pause/resume capability to Excellence Sprint timer
- Complete all module content definitions in v1
- Export functionality for notes and commitments
- Multi-language support (Dutch/English toggle)
- Analytics dashboard for tracking workshop outcomes
- Template library for common problem/solution patterns
- Integration with collaboration platforms (Teams, Slack)
- Unified timer system across both workshop versions
- Progressive web app capabilities for offline use
- Mobile-responsive design for v1