# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a wealth inequality simulation (資産格差シミュレーション) built with p5.js that visualizes how wealth inequality naturally emerges through random economic transactions. It's an agent-based model inspired by statistical physics approaches like the Yard-Sale model and Boltzmann wealth distribution.

**Language**: The UI and documentation are in Japanese. Code comments and variable names are primarily in English.

**Core Concept**: Agents with equal initial wealth engage in random economic transactions with nearby agents. Over time, wealth inequality emerges naturally, demonstrating that "equality of opportunity" does not guarantee "equality of outcome."

## Running the Simulation

**Quick Start**:
```bash
# Open directly in browser
firefox index.html
# or
google-chrome index.html
```

**Using Local Server** (recommended for development):
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

Then navigate to `http://localhost:8000`

**Dependencies**: p5.js 1.7.0 is loaded via CDN from the HTML file. No build process required.

## Architecture

### File Structure

- `index.html`: Main HTML file with embedded CSS and UI controls
- `sketch.js`: Core simulation logic using p5.js
- `README.md`: Comprehensive documentation in Japanese

### Core Components (sketch.js)

**Person Class** (sketch.js:5-84):
- Represents individual economic agents
- Properties: position (x, y), velocity (vx, vy), wealth, radius
- Methods:
  - `update()`: Handles movement and boundary collision
  - `display()`: Renders agent with color/size based on wealth (red=poor, blue=rich)
  - `trade()`: Executes probabilistic wealth transfer with another agent

**Simulation Loop** (sketch.js:92-117):
- `setup()`: Initializes canvas and agents
- `draw()`: Main loop (runs at 60fps)
  - Updates agent positions
  - Performs trades every 2 frames
  - Updates statistics every 60 frames
  - Draws real-time histogram

**Key Algorithms**:

1. **Trade Mechanism** (sketch.js:56-83):
   - Finds nearby agents within interaction range (100px)
   - Calculates trade amount as percentage of both agents' wealth
   - 50/50 probability determines winner
   - Ensures wealth never goes negative

2. **Gini Coefficient Calculation** (sketch.js:213-231):
   - Sorts agents by wealth
   - Computes inequality metric (0=perfect equality, 1=maximum inequality)
   - Formula: `(2 * sumOfDifferences) / (n * sumOfWealth) - (n + 1) / n`

3. **Spatial Proximity Trading** (sketch.js:147-163):
   - Agents only trade with others within 100px range
   - Finds closest agent for each trade opportunity

### UI Controls (index.html)

Sliders control simulation parameters:
- **Population** (50-500): Number of agents
- **Initial Wealth** (50-200): Starting wealth per agent
- **Trade Probability** (0-100%): Chance of trade per frame
- **Trade Amount** (1-50%): Max percentage of wealth per transaction

Statistics displayed:
- Gini coefficient
- Top 10% wealth share
- Bottom 10% wealth share
- Average wealth
- Median wealth

## Development Guidelines

### Making Changes to Simulation Logic

**Physics/Movement** - Modify `Person.update()` (sketch.js:15-31)

**Visual Representation** - Edit `Person.display()` (sketch.js:33-54)
- Color mapping uses RGB interpolation based on wealth ratio
- Size mapping: `map(wealth, 0, maxWealth, 3, 12)`

**Trading Rules** - Adjust `Person.trade()` (sketch.js:56-83)
- To change win probability: modify line 72 (`if (random() < 0.5)`)
- To change trade amount calculation: edit lines 62-65

**Adding New Statistics** - Update `updateStatistics()` (sketch.js:233-260)
- Add calculation logic
- Update corresponding HTML element in index.html

### Testing Changes

Since there's no automated testing:
1. Open in browser after changes
2. Verify agents move and change colors/sizes
3. Check that statistics update correctly
4. Test different parameter combinations with sliders
5. Ensure Gini coefficient trends upward over time (expected behavior)

### Performance Considerations

- Simulation runs at 60fps
- Trade calculations occur every 2 frames
- Statistics update every 60 frames (once per second)
- With 500 agents, proximity search is O(n²) - this is the main bottleneck
- Consider optimizing `findClosestPerson()` with spatial partitioning if adding many more agents

## Common Tasks

**Change initial wealth distribution**:
Edit `initializePeople()` at line 128 to modify the random variation range

**Adjust interaction range**:
Change `interactionRange` value in `findClosestPerson()` at line 150

**Modify color scheme**:
Edit RGB calculations in `Person.display()` at lines 38-48

**Add new parameters**:
1. Add slider to index.html controls section
2. Add `updateLabel()` case in sketch.js:273-287
3. Use parameter value with `document.getElementById('yourId').value`

## Theoretical Background

Based on econophysics models:
- Yard-Sale Model (also called Yard-Poker Model)
- Boltzmann wealth distribution
- Demonstrates emergence of Pareto distribution from random transactions

Key insight: Even with fair rules (50/50 probability), wealth naturally concentrates over time due to multiplicative dynamics.
