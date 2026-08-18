/* ============================================
   Daily Grind — Data Layer
   ============================================ */

function slug(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

const RAW_EXERCISES = [
  // CHEST
  ["Push-ups","Chest","Beginner","None","3 × 10-15","60s","Keep your body in a straight line from head to heels. Lower until elbows hit ~90°, press back up.","Letting hips sag or piking the hips up; flaring elbows too wide."],
  ["Incline Push-ups","Chest","Beginner","None","3 × 12-15","45s","Hands on a raised surface like a bench or step. Easier variation to build pushing strength.","Placing hands too high, removing most of the challenge."],
  ["Decline Push-ups","Chest","Intermediate","None","3 × 8-12","60s","Feet raised on a step or chair, hands on floor. Increases load on upper chest and shoulders.","Feet too high causing shoulder strain; sagging lower back."],
  ["Diamond Push-ups","Chest","Intermediate","None","3 × 8-12","60s","Hands together under chest forming a diamond shape. Targets triceps and inner chest.","Elbows flaring out instead of tracking back."],
  ["Bench Press","Chest","Intermediate","Barbell","3 × 8-10","90s","Lower the bar to mid-chest with control, press up without locking out aggressively.","Bouncing the bar off the chest; arching the back excessively."],
  ["Dumbbell Fly","Chest","Intermediate","Dumbbells","3 × 10-12","60s","Slight bend in elbows, lower dumbbells out to sides, squeeze chest to bring them back up.","Using too much weight and losing control at the bottom."],
  ["Chest Dip","Chest","Advanced","Dip Bar","3 × 8-12","90s","Lean forward slightly, lower until shoulders are just below elbows, press back up.","Going too deep and straining the shoulder joint."],

  // BACK
  ["Pull-ups","Back","Advanced","Pull-up Bar","3 × 5-10","90s","Pull chest toward the bar, squeeze shoulder blades together, lower with control.","Using momentum/kipping; not achieving full range of motion."],
  ["Chin-ups","Back","Intermediate","Pull-up Bar","3 × 5-10","90s","Palms facing you, pull up until chin clears the bar, control the descent.","Half reps; shrugging shoulders up toward ears."],
  ["Inverted Rows","Back","Beginner","Bar/Table","3 × 10-12","60s","Body straight under a bar, pull chest to the bar squeezing shoulder blades.","Sagging hips; pulling with arms only instead of the back."],
  ["Bent-over Row","Back","Intermediate","Dumbbells","3 × 10-12","75s","Hinge at hips, flat back, pull weights to your ribs, squeeze shoulder blades.","Rounding the lower back; using momentum to swing weights up."],
  ["Lat Pulldown","Back","Beginner","Cable Machine","3 × 10-12","60s","Pull the bar to upper chest, lead with elbows, control the return.","Leaning back excessively; using arms instead of lats."],
  ["Superman","Back","Beginner","None","2 × 10-15","45s","Lie face down, lift arms and legs simultaneously, squeeze lower back and glutes.","Jerky movement; lifting too high causing lower back strain."],
  ["Reverse Snow Angels","Back","Beginner","None","2 × 10-15","45s","Face down, sweep arms from hips to overhead like a snow angel, engaging upper back.","Rushing the movement instead of controlling it."],

  // SHOULDERS
  ["Pike Push-ups","Shoulders","Intermediate","None","3 × 6-12","60s","Hips high forming an inverted V, lower head toward the floor, press back up.","Not achieving enough hip hinge; flaring elbows too wide."],
  ["Shoulder Press","Shoulders","Intermediate","Dumbbells","3 × 8-12","75s","Press dumbbells overhead without arching the lower back, lower with control.","Excessive back arch; not fully extending arms at the top."],
  ["Lateral Raise","Shoulders","Beginner","Dumbbells","3 × 12-15","45s","Raise arms out to sides to shoulder height, slight bend in elbows.","Using momentum/swinging; raising above shoulder height."],
  ["Front Raise","Shoulders","Beginner","Dumbbells","3 × 12-15","45s","Raise weights forward to shoulder height, keep core tight.","Swinging the torso to generate momentum."],
  ["Arnold Press","Shoulders","Advanced","Dumbbells","3 × 8-10","75s","Start palms facing you, rotate as you press overhead.","Rotating too fast; losing control of the weights."],
  ["Handstand Hold","Shoulders","Advanced","Wall","3 × 15-30s","60s","Kick up against a wall, hold a straight line from hands to heels, breathe steadily.","Collapsing the lower back; attempting without a spotter or wall for support first."],

  // ARMS
  ["Bicep Curl","Arms","Beginner","Dumbbells","3 × 10-12","45s","Curl weights up keeping elbows pinned to your sides, lower slowly.","Swinging the body to lift the weight; flaring elbows forward."],
  ["Hammer Curl","Arms","Beginner","Dumbbells","3 × 10-12","45s","Palms facing each other throughout the curl, targets forearms too.","Using momentum instead of controlled reps."],
  ["Tricep Dip","Arms","Intermediate","Bench/Chair","3 × 10-15","60s","Lower body by bending elbows to ~90°, press back up using triceps.","Letting shoulders roll forward; going too low and straining shoulders."],
  ["Tricep Extension","Arms","Intermediate","Dumbbells","3 × 10-12","45s","Lower weight behind head with control, extend arms fully without locking out hard.","Flaring elbows outward; arching the back."],
  ["Close-grip Push-ups","Arms","Intermediate","None","3 × 8-12","60s","Hands closer than shoulder-width, elbows track close to the body.","Hands too close causing wrist strain."],
  ["Concentration Curl","Arms","Beginner","Dumbbells","3 × 10-12","45s","Elbow braced against inner thigh, curl with strict control.","Using the shoulder to help lift instead of isolating the bicep."],

  // LEGS
  ["Bodyweight Squats","Legs","Beginner","None","3 × 15-20","60s","Feet shoulder-width, sit hips back and down, keep chest up, knees tracking over toes.","Knees caving inward; heels lifting off the ground."],
  ["Jump Squats","Legs","Intermediate","None","3 × 10-15","60s","Squat down then explode upward into a jump, land softly.","Landing stiff-legged; not controlling the landing."],
  ["Lunges","Legs","Beginner","None","3 × 10-12 each leg","60s","Step forward, lower back knee toward the floor, push back to start.","Front knee traveling past the toes excessively; short, unstable steps."],
  ["Reverse Lunges","Legs","Beginner","None","3 × 8-12 each leg","60s","Step backward instead of forward, lower with control, drive through the front heel.","Leaning the torso too far forward."],
  ["Bulgarian Split Squat","Legs","Advanced","Bench","3 × 8-12 each leg","75s","Rear foot elevated on a bench, lower the front leg until thigh is near parallel.","Placing the front foot too close, limiting depth and balance."],
  ["Glute Bridge","Legs","Beginner","None","3 × 12-20","45s","Drive hips up squeezing glutes at the top, lower with control.","Overarching the lower back instead of using the glutes."],
  ["Calf Raises","Legs","Beginner","None","3 × 15-25","30s","Rise onto the balls of your feet, pause, lower slowly.","Bouncing through reps instead of a controlled tempo."],
  ["Wall Sit","Legs","Beginner","Wall","3 × 30-60s","45s","Back against wall, thighs parallel to the floor, hold the position.","Sliding too low or too high; not keeping the back flat against the wall."],
  ["Goblet Squat","Legs","Intermediate","Dumbbell","3 × 10-15","60s","Hold a dumbbell at chest height, squat down keeping the weight close to your body.","Letting the weight pull you forward; rounding the back."],

  // CORE
  ["Plank","Core","Beginner","None","3 × 30-60s","45s","Forearms and toes on the ground, body in a straight line, brace the core.","Hips sagging or piking up too high."],
  ["Side Plank","Core","Intermediate","None","2 × 20-40s each side","45s","Stack feet, prop up on one forearm, hips lifted in a straight line.","Hips dropping toward the floor mid-hold."],
  ["Dead Bug","Core","Beginner","None","3 × 8-12 each side","45s","Lower opposite arm and leg toward the floor while keeping lower back pressed down.","Letting the lower back arch off the floor."],
  ["Bicycle Crunch","Core","Beginner","None","3 × 15-20 each side","45s","Alternate bringing elbow to opposite knee with a controlled twist.","Pulling on the neck instead of rotating the torso."],
  ["Russian Twist","Core","Intermediate","None","3 × 15-20 each side","45s","Lean back slightly, rotate the torso side to side, feet can stay grounded for beginners.","Moving only the arms instead of rotating through the torso."],
  ["Leg Raises","Core","Intermediate","None","3 × 10-15","45s","Lie flat, raise straight legs to vertical, lower with control without arching the back.","Using momentum to swing the legs up."],
  ["Mountain Climbers","Core","Beginner","None","3 × 20-30s","30s","In a plank position, drive knees toward the chest alternately at a quick pace.","Hips bouncing up too high, losing the plank position."],
  ["Hollow Body Hold","Core","Advanced","None","3 × 15-30s","45s","Lower back pressed to the floor, arms and legs extended and lifted slightly.","Lower back arching off the ground."],

  // FULL BODY
  ["Burpees","Full Body","Intermediate","None","3 × 8-12","60s","Squat, kick back to a plank, push-up optional, jump feet in, jump up.","Skipping the plank position; sloppy landing on the jump."],
  ["Bear Crawl","Full Body","Intermediate","None","3 × 20-30s","45s","Hands and feet on the ground, knees hovering, crawl forward with opposite arm/leg.","Hips rising too high, turning it into a downward-dog position."],
  ["Turkish Get-up","Full Body","Advanced","Dumbbell","3 × 3-5 each side","90s","A slow multi-step movement from lying to standing while holding a weight overhead.","Rushing the steps; losing the overhead lockout."],
  ["Thrusters","Full Body","Advanced","Dumbbells","3 × 8-12","75s","Squat down, then explode up while pressing the weights overhead.","Not fully standing before initiating the press."],
  ["Man Makers","Full Body","Advanced","Dumbbells","3 × 6-10","90s","Combine a renegade row, burpee, and overhead press in one flowing rep.","Rushing through and losing form on the row portion."],

  // CARDIO
  ["Jumping Jacks","Cardio","Beginner","None","3 × 30-45s","30s","Jump feet out while raising arms overhead, return to start.","Landing flat-footed; not fully extending arms."],
  ["High Knees","Cardio","Beginner","None","3 × 20-30s","30s","Drive knees up toward chest height at a running pace, stay light on your feet.","Leaning back too far; slow, low knee drive."],
  ["Jump Rope","Cardio","Beginner","Jump Rope","3 × 60s","45s","Small, quick hops, wrists doing most of the rope rotation.","Jumping too high; using the whole arm instead of the wrist."],
  ["Sprint Intervals","Cardio","Advanced","None","6 × 20-30s","60s","Short all-out sprints followed by walking recovery.","Not warming up first; poor pacing leading to early fatigue."],
  ["Star Jumps","Cardio","Beginner","None","3 × 30-45s","30s","Jump into a star shape with arms and legs spread, land softly.","Landing hard/locked knees."],

  // MOBILITY
  ["Cat-Cow","Mobility","Beginner","None","2 × 10 reps","20s","On hands and knees, alternate arching and rounding the spine slowly.","Moving too fast instead of syncing with breath."],
  ["Hip Flexor Stretch","Mobility","Beginner","None","2 × 30s each side","20s","Kneeling lunge position, gently push hips forward until a stretch is felt.","Overarching the lower back instead of pushing through the hip."],
  ["Hamstring Stretch","Mobility","Beginner","None","2 × 30s each side","20s","Sit or stand and hinge forward with a straight leg until a gentle stretch is felt.","Bouncing into the stretch instead of holding it steady."],
  ["Shoulder Mobility Circles","Mobility","Beginner","None","2 × 10 each direction","15s","Slow, controlled arm circles that gradually increase in size.","Rushing the circles instead of moving with control."],
  ["World's Greatest Stretch","Mobility","Intermediate","None","2 × 5 each side","30s","Lunge, drop the back knee, rotate the torso toward the front leg with arm reaching up.","Rushing through instead of holding each position briefly."],
  ["Child's Pose","Mobility","Beginner","None","2 × 30-45s","15s","Sit back on heels, arms extended forward, relax the shoulders and lower back.","Holding tension in the shoulders instead of relaxing."]
];

const EXERCISES = RAW_EXERCISES.map(([name,muscle,difficulty,equipment,sets,rest,form,mistakes])=>({
  id:slug(name), name, muscle, difficulty, equipment, sets, rest, form, mistakes
}));
function getEx(id){ return EXERCISES.find(e=>e.id===id); }

/* Workout templates */
const WORKOUTS = {
  "full-body-a":{ name:"Full Body A", category:"Home Workout", difficulty:"Beginner", duration:"30-40 min",
    exercises:["push-ups","bodyweight-squats","glute-bridge","pike-push-ups","reverse-snow-angels","plank"] },
  "full-body-b":{ name:"Full Body B", category:"Home Workout", difficulty:"Beginner", duration:"30-40 min",
    exercises:["push-ups","reverse-lunges","glute-bridge","superman","calf-raises","dead-bug","side-plank"] },
  "push-day":{ name:"Push Day", category:"Gym Workout", difficulty:"Intermediate", duration:"40-50 min",
    exercises:["bench-press","shoulder-press","dumbbell-fly","lateral-raise","tricep-dip","close-grip-push-ups"] },
  "pull-day":{ name:"Pull Day", category:"Gym Workout", difficulty:"Intermediate", duration:"40-50 min",
    exercises:["pull-ups","bent-over-row","lat-pulldown","bicep-curl","hammer-curl","superman"] },
  "leg-day":{ name:"Leg Day", category:"Legs", difficulty:"Intermediate", duration:"40-50 min",
    exercises:["goblet-squat","bulgarian-split-squat","lunges","glute-bridge","calf-raises","wall-sit"] },
  "chest-focus":{ name:"Chest Focus", category:"Chest", difficulty:"Intermediate", duration:"30-40 min",
    exercises:["push-ups","incline-push-ups","bench-press","dumbbell-fly","chest-dip"] },
  "back-focus":{ name:"Back Focus", category:"Back", difficulty:"Intermediate", duration:"30-40 min",
    exercises:["pull-ups","inverted-rows","bent-over-row","lat-pulldown","superman"] },
  "arms-focus":{ name:"Arms Focus", category:"Arms", difficulty:"Beginner", duration:"25-35 min",
    exercises:["bicep-curl","hammer-curl","tricep-dip","tricep-extension","diamond-push-ups"] },
  "fat-loss-circuit":{ name:"Fat-Loss Circuit", category:"Fat-loss", difficulty:"Intermediate", duration:"25-30 min",
    exercises:["jumping-jacks","burpees","high-knees","mountain-climbers","jump-squats","star-jumps"] },
  "strength-builder":{ name:"Strength Builder", category:"Strength", difficulty:"Advanced", duration:"45-55 min",
    exercises:["bench-press","bent-over-row","goblet-squat","shoulder-press","thrusters"] },
  "mobility-flow":{ name:"Mobility Flow", category:"Mobility & Stretching", difficulty:"Beginner", duration:"15-20 min",
    exercises:["cat-cow","hip-flexor-stretch","hamstring-stretch","shoulder-mobility-circles","worlds-greatest-stretch","childs-pose"] },
  "quick-15":{ name:"Quick 15", category:"Home Workout", difficulty:"Beginner", duration:"15 min",
    exercises:["jumping-jacks","push-ups","bodyweight-squats","plank"] }
};

/* Workout category tiles for Workouts page */
const CATEGORIES = [
  {key:"Home Workout", icon:"🏠"},
  {key:"Gym Workout", icon:"🏋️"},
  {key:"Full Body", icon:"💪"},
  {key:"Fat-loss", icon:"🔥"},
  {key:"Strength", icon:"💥"},
  {key:"Legs", icon:"🦵"},
  {key:"Chest", icon:"🫸"},
  {key:"Back", icon:"🪽"},
  {key:"Arms", icon:"💪"},
  {key:"Mobility & Stretching", icon:"🧘"}
];

/* Plans */
const PLANS = {
  "7-day":{ name:"7-Day Starter Plan", desc:"A balanced first week to build the habit.", days:{
    Mon:"full-body-a", Tue:"mobility-flow", Wed:"full-body-b", Thu:"mobility-flow", Fri:"full-body-a", Sat:"fat-loss-circuit", Sun:"rest" } },
  "30-day":{ name:"30-Day Progression Plan", desc:"Four weeks, same structure, small weekly progression.", days:{
    Mon:"full-body-a", Tue:"mobility-flow", Wed:"full-body-b", Thu:"mobility-flow", Fri:"full-body-a", Sat:"fat-loss-circuit", Sun:"rest" } },
  "beginner":{ name:"Beginner Plan", desc:"Low-impact, form-first introduction to training.", days:{
    Mon:"full-body-a", Tue:"rest", Wed:"full-body-b", Thu:"mobility-flow", Fri:"full-body-a", Sat:"rest", Sun:"rest" } },
  "strength":{ name:"Strength Plan", desc:"Heavier compound-focused sessions for building strength.", days:{
    Mon:"push-day", Tue:"pull-day", Wed:"rest", Thu:"leg-day", Fri:"strength-builder", Sat:"mobility-flow", Sun:"rest" } },
  "home":{ name:"Home Workout Plan", desc:"No equipment needed, built for small spaces.", days:{
    Mon:"full-body-a", Tue:"quick-15", Wed:"full-body-b", Thu:"mobility-flow", Fri:"full-body-a", Sat:"fat-loss-circuit", Sun:"rest" } },
  "gym":{ name:"Gym Plan", desc:"Equipment-based split for those training in a gym.", days:{
    Mon:"push-day", Tue:"pull-day", Wed:"leg-day", Thu:"rest", Fri:"chest-focus", Sat:"back-focus", Sun:"rest" } }
};

/* Quotes — original lines, rotates daily */
const QUOTES = [
  "Discipline is choosing what you want most over what you want now.",
  "Small consistent reps beat occasional heroic ones.",
  "You don't need to feel motivated. You just need to show up.",
  "Progress hides inside boring, repeated days.",
  "The workout you almost skipped is usually the one you're proudest of.",
  "Strength is built quietly, one ordinary session at a time.",
  "Showing up on the hard days is what actually changes you.",
  "You're not behind. You're building something that takes time.",
  "One more rep than yesterday is still progress.",
  "Rest is part of training, not a break from it.",
  "Nobody regrets the workout they finished.",
  "Your only competition is who you were last week.",
  "Consistency turns effort into identity.",
  "The habit matters more than the highlight.",
  "Every session banked is a session your future self thanks you for.",
  "Discipline feels heavy today and light for the rest of your life.",
  "You're allowed to go slow, just don't stop.",
  "Good form now saves you setbacks later.",
  "A short workout done is worth more than a perfect one skipped.",
  "Trust the process on the days it's hard to see it working."
];

/* Achievements */
const ACHIEVEMENTS = [
  {id:"first-step", icon:"🥇", title:"First Step", desc:"Complete your first workout.", check:(s)=>Object.values(s.log).filter(d=>d.type==='workout').length>=1},
  {id:"consistency", icon:"📅", title:"Consistency", desc:"Complete 7 workouts.", check:(s)=>Object.values(s.log).filter(d=>d.type==='workout').length>=7},
  {id:"iron-week", icon:"⚙️", title:"Iron Week", desc:"Log activity 7 days in a row.", check:(s)=>s.bestStreak>=7},
  {id:"hundred-sets", icon:"💯", title:"100 Sets", desc:"Complete 100 exercise sets total.", check:(s)=>s.totalSets>=100},
  {id:"personal-best", icon:"🏆", title:"Personal Best", desc:"Beat one of your previous records.", check:(s)=>Object.keys(s.prs).length>=1}
];

/* Levels — meaningful gates, not click-farming */
const LEVELS = [
  {level:1, name:"Starter", xp:0},
  {level:5, name:"Consistent", xp:1200},
  {level:10, name:"Dedicated", xp:3200},
  {level:20, name:"Advanced", xp:9500},
  {level:30, name:"Elite", xp:20000}
];
function xpForLevel(n){ return Math.round(100 * n * (n+1) / 1.4); }
function levelFromXP(xp){
  let lvl=1;
  while(xpForLevel(lvl+1) <= xp && lvl<50){ lvl++; }
  return lvl;
}
function levelName(lvl){
  let name="Starter";
  for(const l of LEVELS){ if(lvl>=l.level) name=l.name; }
  return name;
}
