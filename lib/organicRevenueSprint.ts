export type OrganicProfileEditorial = {
  slug: string;
  displayTitle: string;
  summary: string;
  controls: string;
  deviceFit: string;
  howToPlay: string;
  whyPlay: string;
  highlights: string[];
};

const profiles: OrganicProfileEditorial[] = [
  {
    slug: 'the-speed-ninja',
    displayTitle: 'The Speed Ninja',
    summary: 'Run across rooftops as a ninja, time single and double jumps, throw shuriken and land cleanly as the pace builds.',
    controls: 'Use the Up Arrow or the right side of the screen to jump. Use the Right Arrow or the left side to throw a shuriken, and use Down or swipe down to land.',
    deviceFit: 'Supports keyboard input on desktop and touch or swipe input on compatible phones and tablets.',
    howToPlay: 'Keep the ninja moving, jump over gaps and obstacles, and use a second jump when one is not enough. Throw a shuriken when a target blocks the route, then land in time for the next move.',
    whyPlay: 'A useful pick for players who want a fast runner with several actions to learn rather than a single-button obstacle course.',
    highlights: ['Rooftop running', 'Single and double jumps', 'Keyboard and touch controls']
  },
  {
    slug: 'mr-bullet-puzzles-d-espion',
    displayTitle: "Mr Bullet - Puzzles d'espion",
    summary: 'Solve compact shooting puzzles by choosing an angle carefully and using each shot to reach the target.',
    controls: 'Use the pointer or the on-screen aiming control shown by the game to line up and take a shot.',
    deviceFit: 'Pointer and touch support depend on the controls presented after the game loads.',
    howToPlay: 'Study the obstacle layout before firing. Aim for a direct route or use the level geometry when the target is not in a straight line.',
    whyPlay: 'This is a puzzle-led shooting game: planning the shot matters more than firing quickly.',
    highlights: ['Aim-based puzzles', 'Short level format', 'Planning before each shot']
  },
  {
    slug: 'sugar-eyes',
    displayTitle: 'Sugar Eyes',
    summary: 'Combine small monsters that share a colour or the same number of eyes to create more advanced creatures.',
    controls: 'Drag and drop a monster onto a valid match.',
    deviceFit: 'The drag control is suited to a mouse, trackpad or compatible touchscreen.',
    howToPlay: 'Look for monsters with either the same colour or the same eye count. Drag one onto a valid partner and continue building higher-level creatures without crowding the board.',
    whyPlay: 'The two matching rules add a little more choice than a standard pair-matching puzzle.',
    highlights: ['Colour and eye-count matching', 'Drag-and-drop play', 'Board-management puzzle']
  },
  {
    slug: 'flying-football-flapper-soccer-game',
    displayTitle: 'Flying Football: Flapper Soccer Game',
    summary: 'Keep a football in the air with carefully timed taps and guide it through gaps without touching the pipes.',
    controls: 'Click or tap to make the football rise; release between taps to let it fall.',
    deviceFit: 'The single-action control is suitable for mouse and touchscreen play.',
    howToPlay: 'Use short, measured taps instead of holding the control. Watch the next gap, adjust the ball height early and avoid over-correcting near a pipe.',
    whyPlay: 'A short football-themed timing challenge for players who enjoy retrying to improve a run.',
    highlights: ['One-button timing', 'Pipe-avoidance challenge', 'Mouse and touch play']
  },
  {
    slug: 'popcorn-run-3d',
    displayTitle: 'Popcorn Run 3D',
    summary: 'Guide a bare corn cob along the course, collect loose kernels and try to reach the finish with the cob rebuilt.',
    controls: 'Use the movement control shown in the game to steer along the course and collect kernels.',
    deviceFit: 'The game is designed around a simple course-running control; exact input guidance appears after loading.',
    howToPlay: 'Follow the course and move toward groups of kernels while avoiding hazards that interrupt the run. The immediate objective is to gather the missing kernels and reach the end.',
    whyPlay: 'The visible collect-and-grow objective makes each short run easy to understand from the opening moments.',
    highlights: ['Collect-and-grow runner', 'Short 3D course', 'Immediate visual objective']
  },
  {
    slug: 'thief-ro',
    displayTitle: 'Thief.ro',
    summary: 'Move through an escape course, find a route around obstacles and keep the thief moving for as long as possible.',
    controls: 'Click and drag with a mouse, or swipe on a compatible touchscreen, to move.',
    deviceFit: 'Supports drag or swipe input on compatible desktop and touch devices.',
    howToPlay: 'Drag or swipe in the direction you want to move. Read the route ahead before committing so the thief does not become trapped by the next obstacle.',
    whyPlay: 'A compact escape game with straightforward movement and an endless-play structure.',
    highlights: ['Escape-route play', 'Drag or swipe movement', 'Endless format']
  },
  {
    slug: 'quiz-goose-math',
    displayTitle: 'Quiz Goose Math',
    summary: 'Roll the dice, move across the board and answer maths questions when the goose lands on a quiz space.',
    controls: 'Click or tap the on-screen controls to roll, move and choose an answer.',
    deviceFit: 'The point-and-tap controls suit mouse and compatible touchscreen play.',
    howToPlay: 'Roll the dice and follow the board. When a move ends on a quiz space, solve the maths question before continuing.',
    whyPlay: 'It combines a simple board-game journey with short maths questions instead of presenting a continuous worksheet.',
    highlights: ['Dice-and-board format', 'Short maths questions', 'Mouse and touch controls']
  },
  {
    slug: 'jungle-adventure-run-3d',
    displayTitle: 'Jungle Adventure Run 3D',
    summary: 'Guide a cougar through a 3D jungle run, respond to obstacles and continue through the open environment.',
    controls: 'Use the one-touch control shown in the game to guide the run.',
    deviceFit: 'The source describes a one-touch control intended for compatible pointer or touchscreen devices.',
    howToPlay: 'Watch the route ahead and use the single control when the cougar needs to respond to the next obstacle or encounter.',
    whyPlay: 'A direct animal runner for players who prefer simple input and a 3D jungle setting.',
    highlights: ['3D jungle setting', 'Cougar runner', 'One-touch input']
  },
  {
    slug: 'scrap-brawl',
    displayTitle: 'Scrap Brawl',
    summary: 'Fight through a 2D papercraft brawl, use attacks and dodges, and collect power-ups that change the next exchange.',
    controls: 'Move with WASD or the Arrow Keys, attack with Space and dodge with Shift. Touch controls are shown on supported devices.',
    deviceFit: 'Keyboard controls are available on desktop; the game also describes on-screen touch actions.',
    howToPlay: 'Keep enough space to react, attack when an opponent is open and dodge away from incoming hits. Pick up power-ups when the route is clear.',
    whyPlay: 'A short action game with separate movement, attack and dodge controls rather than automatic combat.',
    highlights: ['2D papercraft fighting', 'Attack and dodge actions', 'Collectible power-ups']
  },
  {
    slug: 'street-rush-running-game',
    displayTitle: 'Street Rush: Running Game',
    summary: 'Lead a runner through street and subway hazards, switch position and dodge obstacles as the route changes.',
    controls: 'Swipe in the direction needed to move or dodge; follow the on-screen introduction for any additional actions.',
    deviceFit: 'Swipe-led play is intended for compatible touchscreens; other controls are shown by the loaded game.',
    howToPlay: 'Read the next lane early and swipe before the runner reaches an obstacle. Keep a clear route through street and subway sections rather than reacting at the last moment.',
    whyPlay: 'A forward-moving runner with changing urban obstacles and quick retries.',
    highlights: ['Street and subway course', 'Swipe-to-dodge controls', 'Runner progression']
  },
  {
    slug: 'car-avoid-game',
    displayTitle: 'Car Avoid Game',
    summary: 'Change lanes to keep the car clear of oncoming traffic and pedestrians for as long as the road remains open.',
    controls: 'Move left or right with touch or the mouse to change lanes.',
    deviceFit: 'Supports mouse and compatible touchscreen input through a left-or-right lane control.',
    howToPlay: 'Watch the traffic pattern ahead, move into a clear lane and leave enough space to change back when another car or pedestrian appears.',
    whyPlay: 'A direct traffic-dodging challenge built around quick lane decisions instead of lap racing.',
    highlights: ['Lane-changing challenge', 'Traffic and pedestrian hazards', 'Mouse and touch input']
  },
  {
    slug: 'green-battle',
    displayTitle: 'Green Battle',
    summary: 'Guide Handit the frog through a bee-catching arcade challenge and keep the feeding run going.',
    controls: 'Use the controls shown inside the game after it loads.',
    deviceFit: 'Best on desktop, tablet or landscape mobile screens, subject to the controls shown by the game.',
    howToPlay: 'Follow the opening control prompt, move the frog toward the bees and avoid breaking the current run.',
    whyPlay: 'A bright, focused arcade game with a clear frog-and-bee objective.',
    highlights: ['Frog arcade challenge', 'Bee-catching objective', 'Short repeatable runs']
  },
  {
    slug: 'parking-jam-2d',
    displayTitle: 'Parking Jam 2D',
    summary: 'Shift parked vehicles to clear a route for the white ambulance and solve each traffic-jam layout.',
    controls: 'Swipe a vehicle left, right, up or down when space allows it to move.',
    deviceFit: 'The four-direction swipe control suits compatible touchscreens and drag input.',
    howToPlay: 'Identify which vehicles block the ambulance, then move them in an order that creates enough space. A move can open one route while closing another, so plan beyond the first car.',
    whyPlay: 'A traffic puzzle with a specific rescue vehicle to free and a clear move-by-move objective.',
    highlights: ['Sliding traffic puzzle', 'Free the ambulance', 'Four-direction movement']
  },
  {
    slug: 'monster-truck-mountain-climb',
    displayTitle: 'Monster Truck Mountain Climb',
    summary: 'Drive a monster truck up steep mountain tracks, balance its movement and jump when the route demands it.',
    controls: 'Use A and D or the Left and Right Arrow Keys to control the truck. Use W or the Up Arrow to jump.',
    deviceFit: 'The supplied controls are keyboard-based, making desktop or a device with a physical keyboard the clearest fit.',
    howToPlay: 'Build enough momentum for each slope without losing control on the landing. Use the jump action when the terrain cannot be crossed by driving alone.',
    whyPlay: 'A side-on climbing challenge that combines truck control with timed jumps.',
    highlights: ['Monster-truck climbing', 'Keyboard steering', 'Timed jumps']
  },
  {
    slug: 'tangram-king',
    displayTitle: 'Tangram King',
    summary: 'Arrange seven flat tangram pieces to recreate each target shape without leaving pieces outside the outline.',
    controls: 'Use the mouse to select and position the tangram pieces.',
    deviceFit: 'The supplied control guidance is mouse-based, so desktop is the clearest documented fit.',
    howToPlay: 'Study the target outline, place the largest pieces first and use the smaller shapes to complete the remaining gaps.',
    whyPlay: 'A traditional spatial puzzle built around fitting a fixed set of seven pieces into new silhouettes.',
    highlights: ['Seven-piece tangrams', 'Spatial reasoning', 'Mouse-based placement']
  }
];

const bySlug = new Map(profiles.map((profile) => [profile.slug, profile]));

export const organicRevenueSprintProfileSlugs = profiles.map((profile) => profile.slug);

export const organicRevenueCategoryTargets: Record<string, string[]> = {
  action: ['scrap-brawl', 'the-speed-ninja', 'green-battle'],
  adventure: ['mr-bullet-puzzles-d-espion', 'jungle-adventure-run-3d', 'street-rush-running-game'],
  arcade: ['the-speed-ninja', 'popcorn-run-3d', 'thief-ro', 'green-battle'],
  puzzle: ['sugar-eyes', 'quiz-goose-math', 'parking-jam-2d', 'tangram-king'],
  racing: ['car-avoid-game', 'monster-truck-mountain-climb'],
  sports: ['flying-football-flapper-soccer-game']
};

export const organicRevenueMobileTargets = [
  'sugar-eyes',
  'flying-football-flapper-soccer-game',
  'thief-ro',
  'quiz-goose-math',
  'jungle-adventure-run-3d',
  'street-rush-running-game',
  'car-avoid-game',
  'parking-jam-2d'
];

export function getOrganicProfileEditorial(slug: string) {
  return bySlug.get(slug);
}

export function getOrganicProfilesForCategory(slug: string) {
  return (organicRevenueCategoryTargets[slug] || []).map((profileSlug) => bySlug.get(profileSlug)).filter(Boolean) as OrganicProfileEditorial[];
}

export function getOrganicProfileEditorials(slugs: string[]) {
  return slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as OrganicProfileEditorial[];
}
