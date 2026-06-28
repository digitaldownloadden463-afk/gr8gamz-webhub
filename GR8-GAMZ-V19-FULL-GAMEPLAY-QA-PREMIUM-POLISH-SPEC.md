# GR8 GAMZ V19 — Full Gameplay QA + Premium Polish Plan

## Purpose

V19 is the full quality pass after the V18 gameplay/art update.

The target is simple: every existing GR8 GAMZ game must feel stable, premium, playable, understandable and worth replaying.

V19 should not add more games first. It should make the current 15 games stronger.

## V19 headline goals

1. Test all 15 games one by one.
2. Improve every weak gameplay loop.
3. Make every game work properly on desktop and mobile.
4. Improve in-game HUD visibility.
5. Make start menus, pause/restart and game-over states clearer.
6. Tune difficulty so games feel fair, not random.
7. Improve collision detection where needed.
8. Make scoring feel rewarding.
9. Ensure every game sends score/results properly to the GR8 GAMZ host.
10. Make the last 10 games feel closer to the first 5 premium launch games.

## Full 15-game QA list

### Benchmark games
These should remain the standard:
- Neon Snake Rush
- Stack Tower Rush
- Turbo Drift Grid
- Pixel Goal Hero
- Space Tap Survival

### Second-drop games needing deeper polish
- Neon Breakout Rush: paddle feel, bounce control, brick-hit feedback, speed balancing.
- Cyber Basketball Shots: drag/shot feel, hoop detection, miss feedback, mobile drag response.
- Zombie Lane Runner: lane controls, obstacle spacing, clear hazard/collectable visuals.
- Bubble Pop Blitz: chain feedback, grid clarity, combo scoring, mobile tap accuracy.
- Neon Air Hockey: puck physics, AI balance, goal detection, mobile dragging.
- Alien Invader Swarm: ship movement, wave readability, hit effects, fair collision.
- Crystal Match Quest: match clarity, objective cues, combo loop, tap accuracy.
- Dungeon Door Dash: more depth, risk/reward, progressive levels, better trap/treasure feedback.
- Traffic Tap Chaos: clearer rules, vehicle direction, fair collisions, traffic-light feedback.
- Rocket Fuel Frenzy: smooth movement, fuel/hazard clarity, fair collision, fuel tuning.

## V19 game shell targets

### Arcade page viewport
- Keep V18 larger arcade viewport.
- Confirm no important menu/HUD gets clipped.
- Confirm iframe is usable in Chrome desktop.
- Confirm iframe is usable on mobile portrait.
- Confirm iframe is usable on mobile landscape.

### GR8 Focus Mode
- Fullscreen should keep all controls visible.
- Pause should not break games.
- Play again should restart cleanly.
- Result overlay should not appear too early.
- Next-game link should remain visible and useful.

### In-game menus
Every game should have:
- clear title
- short instruction line
- control explanation
- selectable mode/character/vehicle where relevant
- obvious start button
- game-over state
- play-again state

## V19 scoring and retention targets

Every game should:
- save best score locally
- post score back to the host page
- trigger XP progression
- show meaningful in-game feedback
- reward short repeat sessions
- feel fair enough to retry immediately

## V19 artwork standard

The last ten games have now had a V18 artwork refresh, but V19 should still inspect:

- thumbnail contrast
- subject clarity
- neon premium feel
- consistency with first five games
- title/card readability
- WebP compression
- mobile display quality

## V19 implementation order

### Phase 1 — Game shell QA
- Test bigger viewport.
- Test GR8 Focus Mode.
- Test pause/restart/play-again.
- Test result overlay.
- Fix any iframe clipping.

### Phase 2 — Critical controls
- Zombie Lane Runner
- Traffic Tap Chaos
- Rocket Fuel Frenzy
- Neon Air Hockey
- Cyber Basketball Shots

### Phase 3 — Gameplay depth
- Dungeon Door Dash
- Crystal Match Quest
- Bubble Pop Blitz
- Alien Invader Swarm
- Neon Breakout Rush

### Phase 4 — Benchmark comparison
Compare all 15 games against:
- Neon Snake Rush
- Turbo Drift Grid
- Space Tap Survival

No second-drop game should feel dramatically weaker than those.

### Phase 5 — Final QA
For every game:
- desktop keyboard test
- desktop mouse test
- mobile touch test
- mobile portrait test
- landscape test
- restart test
- score save test
- result postMessage test
- no console-breaking errors

## Done criteria

V19 is complete only when:

- All 15 games start properly.
- All 15 games can be restarted.
- All 15 games have clear controls.
- All 15 games are playable on mobile.
- All 15 games have fair scoring.
- All 15 games save best score.
- All 15 games feel visually consistent.
- No game has a clipped menu or hidden HUD.
- No game feels unfinished compared with the first five.
