GUARDIANS OF LIGHT

Open index.html in Edge, Chrome or Firefox. The game is self-contained and
runs offline; educational source links need internet access.

Choose Puppy, Kitty, Guinea pig or Cockatiel. Move with WASD, arrow keys or
the on-screen arrows. Press E at a marked building's front door to enter.
Only five buildings with character pins contain encounters. Other buildings
are decorative. The gold H on the minimap is your owner's home.

Visit Ice, Heroin, Weed, Ecstasy and Ketamine in ANY ORDER. Inside a room,
approach the character and press E. Answer all three questions correctly
to collect its key piece. Correct answers persist when leaving a room.
Use Exit room or press E at the room exit to return to the city.

Wrong answers cause an attack, remove one spark and darken the flame.
Read the feedback and retry the question. Five hits end the run.
Collect all five pieces to unlock home. Press E at its door to transfer
the flame to your owner and finish the rescue.

ROOMS
Ice: vibration and randomly changing camera angles. Motion: reduced
turns these off. System reduced-motion preferences are respected.
Heroin: branching walls with green-purple symbolic injury markings.
Weed: warped, melting clocks inspired by the supplied reference.
Ecstasy: layers of drifting fog and reduced scene visibility.
Ketamine: movement slows near its building and inside its hall, with
a playful character taunt on entry. Speed recovers outside its vicinity.

Effects are artistic metaphors, not exact simulations or diagnostic signs.
Marks alone cannot identify substance use. The rescue is a fantasy;
recovery requires care and support, and loved ones are not responsible
for curing someone. The Field guide includes sources and support ideas.
Drug facts use CNB; time perception and dissociation references include
NIDA. Checked 18 September 2026.

TECHNICAL
Single-file Three.js 0.160.1 / WebGL game. No installation or server needed.
Three.js MIT licence is provided in THREE-LICENSE.txt.
No accounts, analytics or personal data collection. Progress lasts for
the current run and resets when the file is closed or restarted.
Turquoise flame: #27C1BB, sampled from the supplied drug-free ribbon.
Original procedural city, room artwork, pet models and flame.

VALIDATION
Browser checks cover all 15 questions in non-sequential order, partial
room progress, key awards, duplicate prevention, locked/unlocked home,
reunion, damage, retries, defeat, speed changes, reduced-motion control,
all pet choices and mobile width. Desktop and mobile layouts inspected.

KIRO CHARACTER INTEGRATION — 19 September 2026
The five OBJ meshes in generated_characters are embedded in index.html.
Use index.html for the complete working game. The separate enhanced-index
and enhanced-game files are retained as supplied, but are not its entry point.
The conflicting second game script has been disconnected from index.html.
Materials and idle animations follow characters_manifest.json; visible
faces, a powder fill, zip seam, pill score and roots supplement the meshes.
The supplied OBJ files remain unchanged. No Python scripts were present
in this folder; the exported OBJ assets are what the browser now displays.

After editing the OBJ files or manifest, rebuild the offline game with:
node outputs/generated_characters/rebuild-characters.cjs
Run from the task directory. The script updates the embedded assets without
requiring a local server or fetch requests. Refresh the game after rebuilding.

MIND CITY UPDATE
The city is now a connected set of floating personality islands:
Family / Ice; Friends / Heroin; Hobbies / Weed; Values / Ecstasy;
Humour / Ketamine. Hobbies includes basketball, badminton and dance;
Values includes honesty, integrity and reliability.
The world starts in grey-blue gloom. Five wrong answers end the rescue
and leave the city gloomy. All five key pieces restore the flame to
its original turquoise; the player must then bring it home. The owner
rises from sleep and the city transitions to colour. View restored city
keeps the colourful panorama visible. Restart returns the world to gloom.
The editable exterior/ending source is mind-city.js, embedded in index.html.
