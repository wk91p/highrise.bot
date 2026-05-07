const emotes = [
    {
        name: "Rest",
        id: "sit-idle-cute",
        duration: 17.06
    },
    {
        name: "Zombie",
        id: "idle_zombie",
        duration: 28.75
    },
    {
        name: "Relaxed",
        id: "idle_layingdown2",
        duration: 21.55
    },
    {
        name: "Attentive",
        id: "idle_layingdown",
        duration: 24.59
    },
    {
        name: "Sleepy",
        id: "idle-sleep",
        duration: 22.62
    },
    {
        name: "Pouty Face",
        id: "idle-sad",
        duration: 24.38
    },
    {
        name: "Posh",
        id: "idle-posh",
        duration: 21.85
    },
    {
        name: "Sleepy Loop",
        id: "idle-loop-tired",
        duration: 21.96
    },
    {
        name: "Tap Loop",
        id: "idle-loop-tapdance",
        duration: 6.26
    },
    {
        name: "Sit",
        id: "idle-loop-sitfloor",
        duration: 22.32
    },
    {
        name: "Shy",
        id: "idle-loop-shy",
        duration: 16.47
    },
    {
        name: "Bummed",
        id: "idle-loop-sad",
        duration: 28
    },
    {
        name: "Chillin'",
        id: "idle-loop-happy",
        duration: 18.8
    },
    {
        name: "Annoyed",
        id: "idle-loop-annoyed",
        duration: 17.06
    },
    {
        name: "Aerobics",
        id: "idle-loop-aerobics",
        duration: 8.51
    },
    {
        name: "Ponder",
        id: "idle-lookup",
        duration: 22.34
    },
    {
        name: "Hero Pose",
        id: "idle-hero",
        duration: 21.88
    },
    {
        name: "Relaxing",
        id: "idle-floorsleeping2",
        duration: 17.25
    },
    {
        name: "Cozy Nap",
        id: "idle-floorsleeping",
        duration: 13.94
    },
    {
        name: "Enthused",
        id: "idle-enthusiastic",
        duration: 15.94
    },
    {
        name: "Boogie Swing",
        id: "idle-dance-swinging",
        duration: 13.2
    },
    {
        name: "Feel The Beat",
        id: "idle-dance-headbobbing",
        duration: 25.37
    },
    {
        name: "Irritated",
        id: "idle-angry",
        duration: 25.43
    },
    {
        name: "Yes",
        id: "emote-yes",
        duration: 2.57
    },
    {
        name: "I Believe I Can Fly",
        id: "emote-wings",
        duration: 13.13
    },
    {
        name: "The Wave",
        id: "emote-wave",
        duration: 2.69
    },
    {
        name: "Tired",
        id: "emote-tired",
        duration: 4.61
    },
    {
        name: "Think",
        id: "emote-think",
        duration: 3.69
    },
    {
        name: "Theatrical",
        id: "emote-theatrical",
        duration: 8.59
    },
    {
        name: "Tap Dance",
        id: "emote-tapdance",
        duration: 11.06
    },
    {
        name: "Super Run",
        id: "emote-superrun",
        duration: 6.27
    },
    {
        name: "Super Punch",
        id: "emote-superpunch",
        duration: 3.75
    },
    {
        name: "Sumo Fight",
        id: "emote-sumo",
        duration: 10.87
    },
    {
        name: "Thumb Suck",
        id: "emote-suckthumb",
        duration: 4.19
    },
    {
        name: "Splits Drop",
        id: "emote-splitsdrop",
        duration: 4.47
    },
    {
        name: "Snowball Fight!",
        id: "emote-snowball",
        duration: 5.23
    },
    {
        name: "Snow Angel",
        id: "emote-snowangel",
        duration: 6.22
    },
    {
        name: "Shy Loop",
        id: "emote-shy",
        duration: 4.48
    },
    {
        name: "Secret Handshake",
        id: "emote-secrethandshake",
        duration: 3.88
    },
    {
        name: "Sad",
        id: "emote-sad",
        duration: 5.41
    },
    {
        name: "Rope Pull",
        id: "emote-ropepull",
        duration: 8.77
    },
    {
        name: "Roll",
        id: "emote-roll",
        duration: 3.56
    },
    {
        name: "ROFL!",
        id: "emote-rofl",
        duration: 6.31
    },
    {
        name: "Robot",
        id: "emote-robot",
        duration: 7.61
    },
    {
        name: "Rainbow",
        id: "emote-rainbow",
        duration: 2.81
    },
    {
        name: "Proposing",
        id: "emote-proposing",
        duration: 4.28
    },
    {
        name: "Peekaboo!",
        id: "emote-peekaboo",
        duration: 3.63
    },
    {
        name: "Peace",
        id: "emote-peace",
        duration: 5.76
    },
    {
        name: "Panic",
        id: "emote-panic",
        duration: 2.85
    },
    {
        name: "No",
        id: "emote-no",
        duration: 2.7
    },
    {
        name: "Ninja Run",
        id: "emote-ninjarun",
        duration: 4.75
    },
    {
        name: "Night Fever",
        id: "emote-nightfever",
        duration: 5.49
    },
    {
        name: "Monster Fail",
        id: "emote-monster_fail",
        duration: 4.63
    },
    {
        name: "Model",
        id: "emote-model",
        duration: 6.49
    },
    {
        name: "Flirty Wave",
        id: "emote-lust",
        duration: 4.66
    },
    {
        name: "Level Up!",
        id: "emote-levelup",
        duration: 6.05
    },
    {
        name: "Amused",
        id: "emote-laughing2",
        duration: 5.06
    },
    {
        name: "Laugh",
        id: "emote-laughing",
        duration: 2.69
    },
    {
        name: "Kiss",
        id: "emote-kiss",
        duration: 2.39
    },
    {
        name: "Super Kick",
        id: "emote-kicking",
        duration: 4.87
    },
    {
        name: "Jump",
        id: "emote-jumpb",
        duration: 3.58
    },
    {
        name: "Judo Chop",
        id: "emote-judochop",
        duration: 2.43
    },
    {
        name: "Imaginary Jetpack",
        id: "emote-jetpack",
        duration: 16.76
    },
    {
        name: "Hug Yourself",
        id: "emote-hugyourself",
        duration: 4.99
    },
    {
        name: "Sweating",
        id: "emote-hot",
        duration: 4.35
    },
    {
        name: "Hero Entrance",
        id: "emote-hero",
        duration: 5
    },
    {
        name: "Hello",
        id: "emote-hello",
        duration: 2.73
    },
    {
        name: "Headball",
        id: "emote-headball",
        duration: 10.07
    },
    {
        name: "Harlem Shake",
        id: "emote-harlemshake",
        duration: 13.56
    },
    {
        name: "Happy",
        id: "emote-happy",
        duration: 3.48
    },
    {
        name: "Handstand",
        id: "emote-handstand",
        duration: 4.02
    },
    {
        name: "Greedy Emote",
        id: "emote-greedy",
        duration: 4.64
    },
    {
        name: "Graceful",
        id: "emote-graceful",
        duration: 3.75
    },
    {
        name: "Moonwalk",
        id: "emote-gordonshuffle",
        duration: 8.05
    },
    {
        name: "Ghost Float",
        id: "emote-ghost-idle",
        duration: 19.57
    },
    {
        name: "Gangnam Style",
        id: "emote-gangnam",
        duration: 7.28
    },
    {
        name: "Frolic",
        id: "emote-frollicking",
        duration: 3.7
    },
    {
        name: "Faint",
        id: "emote-fainting",
        duration: 18.42
    },
    {
        name: "Clumsy",
        id: "emote-fail2",
        duration: 6.48
    },
    {
        name: "Fall",
        id: "emote-fail1",
        duration: 5.62
    },
    {
        name: "Face Palm",
        id: "emote-exasperatedb",
        duration: 2.72
    },
    {
        name: "Exasperated",
        id: "emote-exasperated",
        duration: 2.37
    },
    {
        name: "Elbow Bump",
        id: "emote-elbowbump",
        duration: 3.8
    },
    {
        name: "Disco",
        id: "emote-disco",
        duration: 5.37
    },
    {
        name: "Blast Off",
        id: "emote-disappear",
        duration: 6.2
    },
    {
        name: "Faint Drop",
        id: "emote-deathdrop",
        duration: 3.76
    },
    {
        name: "Collapse",
        id: "emote-death2",
        duration: 4.86
    },
    {
        name: "Revival",
        id: "emote-death",
        duration: 6.62
    },
    {
        name: "Dab",
        id: "emote-dab",
        duration: 2.72
    },
    {
        name: "Curtsy",
        id: "emote-curtsy",
        duration: 2.43
    },
    {
        name: "Confusion",
        id: "emote-confused",
        duration: 8.58
    },
    {
        name: "Cold",
        id: "emote-cold",
        duration: 3.66
    },
    {
        name: "Charging Loop",
        id: "emote-charging",
        duration: 8.03
    },
    {
        name: "Bunny Hop",
        id: "emote-bunnyhop",
        duration: 12.38
    },
    {
        name: "Bow",
        id: "emote-bow",
        duration: 3.34
    },
    {
        name: "Boo",
        id: "emote-boo",
        duration: 4.5
    },
    {
        name: "Home Run!",
        id: "emote-baseball",
        duration: 7.25
    },
    {
        name: "Falling Apart",
        id: "emote-apart",
        duration: 4.81
    },
    {
        name: "Thumbs Up",
        id: "emoji-thumbsup",
        duration: 2.7
    },
    {
        name: "Point",
        id: "emoji-there",
        duration: 1.6
    },
    {
        name: "Sneeze",
        id: "emoji-sneeze",
        duration: 3
    },
    {
        name: "Smirk",
        id: "emoji-smirking",
        duration: 4.82
    },
    {
        name: "Sick",
        id: "emoji-sick",
        duration: 5.07
    },
    {
        name: "Gasp",
        id: "emoji-scared",
        duration: 3.01
    },
    {
        name: "Punch",
        id: "emoji-punch",
        duration: 1.76
    },
    {
        name: "Pray",
        id: "emoji-pray",
        duration: 4.5
    },
    {
        name: "Stinky",
        id: "emoji-poop",
        duration: 4.8
    },
    {
        name: "Naughty",
        id: "emoji-naughty",
        duration: 4.28
    },
    {
        name: "Mind Blown",
        id: "emoji-mind-blown",
        duration: 2.4
    },
    {
        name: "Lying",
        id: "emoji-lying",
        duration: 6.31
    },
    {
        name: "Levitate",
        id: "emoji-halo",
        duration: 5.84
    },
    {
        name: "Fireball Lunge",
        id: "emoji-hadoken",
        duration: 2.72
    },
    {
        name: "Give Up",
        id: "emoji-give-up",
        duration: 5.41
    },
    {
        name: "Tummy Ache",
        id: "emoji-gagging",
        duration: 5.5
    },
    {
        name: "Flex",
        id: "emoji-flex",
        duration: 2.1
    },
    {
        name: "Stunned",
        id: "emoji-dizzy",
        duration: 4.05
    },
    {
        name: "Cursing Emote",
        id: "emoji-cursing",
        duration: 2.38
    },
    {
        name: "Sob",
        id: "emoji-crying",
        duration: 3.7
    },
    {
        name: "Clap",
        id: "emoji-clapping",
        duration: 2.16
    },
    {
        name: "Raise The Roof",
        id: "emoji-celebrate",
        duration: 3.41
    },
    {
        name: "Arrogance",
        id: "emoji-arrogance",
        duration: 6.87
    },
    {
        name: "Angry",
        id: "emoji-angry",
        duration: 5.76
    },
    {
        name: "Vogue Hands",
        id: "dance-voguehands",
        duration: 9.15
    },
    {
        name: "Savage Dance",
        id: "dance-tiktok8",
        duration: 10.94
    },
    {
        name: "Don't Start Now",
        id: "dance-tiktok2",
        duration: 10.39
    },
    {
        name: "Yoga Flow",
        id: "dance-spiritual",
        duration: 15.8
    },
    {
        name: "Smoothwalk",
        id: "dance-smoothwalk",
        duration: 6.69
    },
    {
        name: "Ring on It",
        id: "dance-singleladies",
        duration: 21.19
    },
    {
        name: "Let's Go Shopping",
        id: "dance-shoppingcart",
        duration: 4.32
    },
    {
        name: "Russian Dance",
        id: "dance-russian",
        duration: 10.25
    },
    {
        name: "Robotic",
        id: "dance-robotic",
        duration: 17.81
    },
    {
        name: "Penny's Dance",
        id: "dance-pennywise",
        duration: 1.21
    },
    {
        name: "Orange Juice Dance",
        id: "dance-orangejustice",
        duration: 6.48
    },
    {
        name: "Rock Out",
        id: "dance-metal",
        duration: 15.08
    },
    {
        name: "Karate",
        id: "dance-martial-artist",
        duration: 13.28
    },
    {
        name: "Macarena",
        id: "dance-macarena",
        duration: 12.21
    },
    {
        name: "Hands in the Air",
        id: "dance-handsup",
        duration: 22.28
    },
    {
        name: "Floss",
        id: "dance-floss",
        duration: 21.33
    },
    {
        name: "Duck Walk",
        id: "dance-duckwalk",
        duration: 11.75
    },
    {
        name: "Breakdance",
        id: "dance-breakdance",
        duration: 17.62
    },
    {
        name: "K-Pop Dance",
        id: "dance-blackpink",
        duration: 7.15
    },
    {
        name: "Push Ups",
        id: "dance-aerobics",
        duration: 8.8
    },
    {
        name: "Hyped",
        id: "emote-hyped",
        duration: 7.49
    },
    {
        name: "Jinglebell",
        id: "dance-jinglebell",
        duration: 11
    },
    {
        name: "Nervous",
        id: "idle-nervous",
        duration: 21.71
    },
    {
        name: "Toilet",
        id: "idle-toilet",
        duration: 32.17
    },
    {
        name: "Attention",
        id: "emote-attention",
        duration: 4.4
    },
    {
        name: "Astronaut",
        id: "emote-astronaut",
        duration: 13.79
    },
    {
        name: "Dance Zombie",
        id: "dance-zombie",
        duration: 12.92
    },
    {
        name: "Ghost",
        id: "emoji-ghost",
        duration: 3.47
    },
    {
        name: "Heart Eyes",
        id: "emote-hearteyes",
        duration: 4.03
    },
    {
        name: "Swordfight",
        id: "emote-swordfight",
        duration: 5.91
    },
    {
        name: "TimeJump",
        id: "emote-timejump",
        duration: 4.01
    },
    {
        name: "Snake",
        id: "emote-snake",
        duration: 5.26
    },
    {
        name: "Heart Fingers",
        id: "emote-heartfingers",
        duration: 4
    },
    {
        name: "Heart Shape",
        id: "emote-heartshape",
        duration: 6.23
    },
    {
        name: "Hug",
        id: "emote-hug",
        duration: 3.5
    },
    {
        name: "Laugh (Alt)",
        id: "emote-lagughing",
        duration: 1.13
    },
    {
        name: "Eyeroll",
        id: "emoji-eyeroll",
        duration: 3.02
    },
    {
        name: "Embarrassed",
        id: "emote-embarrassed",
        duration: 7.41
    },
    {
        name: "Float",
        id: "emote-float",
        duration: 9
    },
    {
        name: "Telekinesis",
        id: "emote-telekinesis",
        duration: 10.49
    },
    {
        name: "Sexy Dance",
        id: "dance-sexy",
        duration: 12.31
    },
    {
        name: "Puppet",
        id: "emote-puppet",
        duration: 16.33
    },
    {
        name: "Fighter Idle",
        id: "idle-fighter",
        duration: 17.19
    },
    {
        name: "Penguin Dance",
        id: "dance-pinguin",
        duration: 11.58
    },
    {
        name: "Creepy Puppet",
        id: "dance-creepypuppet",
        duration: 6.42
    },
    {
        name: "Sleigh",
        id: "emote-sleigh",
        duration: 11.33
    },
    {
        name: "Maniac",
        id: "emote-maniac",
        duration: 4.91
    },
    {
        name: "Energy Ball",
        id: "emote-energyball",
        duration: 7.58
    },
    {
        name: "Singing",
        id: "idle_singing",
        duration: 10.26
    },
    {
        name: "Frog",
        id: "emote-frog",
        duration: 14.55
    },
    {
        name: "Superpose",
        id: "emote-superpose",
        duration: 4.53
    },
    {
        name: "Cute",
        id: "emote-cute",
        duration: 6.17
    },
    {
        name: "TikTok Dance 9",
        id: "dance-tiktok9",
        duration: 11.89
    },
    {
        name: "Weird Dance",
        id: "dance-weird",
        duration: 21.56
    },
    {
        name: "TikTok Dance 10",
        id: "dance-tiktok10",
        duration: 8.23
    },
    {
        name: "Pose 7",
        id: "emote-pose7",
        duration: 4.66
    },
    {
        name: "Pose 8",
        id: "emote-pose8",
        duration: 4.81
    },
    {
        name: "Casual Dance",
        id: "idle-dance-casual",
        duration: 9.08
    },
    {
        name: "Pose 1",
        id: "emote-pose1",
        duration: 2.83
    },
    {
        name: "Pose 3",
        id: "emote-pose3",
        duration: 5.11
    },
    {
        name: "Pose 5",
        id: "emote-pose5",
        duration: 4.62
    },
    {
        name: "Cutey",
        id: "emote-cutey",
        duration: 3.26
    },
    {
        name: "Punk Guitar",
        id: "emote-punkguitar",
        duration: 9.37
    },
    {
        name: "Zombie Run",
        id: "emote-zombierun",
        duration: 9.18
    },
    {
        name: "Fashionista",
        id: "emote-fashionista",
        duration: 5.61
    },
    {
        name: "Gravity",
        id: "emote-gravity",
        duration: 8.96
    },
    {
        name: "Ice Cream Dance",
        id: "dance-icecream",
        duration: 14.77
    },
    {
        name: "Wrong Dance",
        id: "dance-wrong",
        duration: 12.42
    },
    {
        name: "UwU",
        id: "idle-uwu",
        duration: 24.76
    },
    {
        name: "TikTok Dance 4",
        id: "idle-dance-tiktok4",
        duration: 15.5
    },
    {
        name: "Advanced Shy",
        id: "emote-shy2",
        duration: 4.99
    },
    {
        name: "Anime Dance",
        id: "dance-anime",
        duration: 8.47
    },
    {
        name: "Kawaii",
        id: "dance-kawai",
        duration: 10.29
    },
    {
        name: "Scritchy",
        id: "idle-wild",
        duration: 26.42
    },
    {
        name: "Ice Skating",
        id: "emote-iceskating",
        duration: 7.3
    },
    {
        name: "SurpriseBig",
        id: "emote-pose6",
        duration: 5.38
    },
    {
        name: "Celebration Step",
        id: "emote-celebrationstep",
        duration: 3.35
    },
    {
        name: "Creepycute",
        id: "emote-creepycute",
        duration: 7.9
    },
    {
        name: "Frustrated",
        id: "emote-frustrated",
        duration: 5.58
    },
    {
        name: "Pose 10",
        id: "emote-pose10",
        duration: 3.99
    },
    {
        name: "Relaxed Sitting",
        id: "sit-relaxed",
        duration: 29.89
    },
    {
        name: "Laid Back Sitting",
        id: "sit-open",
        duration: 26.03
    },
    {
        name: "Star Gazing",
        id: "emote-stargaze",
        duration: 1.13
    },
    {
        name: "Slap",
        id: "emote-slap",
        duration: 2.72
    },
    {
        name: "Boxer",
        id: "emote-boxer",
        duration: 5.56
    },
    {
        name: "Head Blowup",
        id: "emote-headblowup",
        duration: 11.67
    },
    {
        name: "KawaiiGoGo",
        id: "emote-kawaiigogo",
        duration: 10
    },
    {
        name: "Repose",
        id: "emote-repose",
        duration: 1.12
    },
    {
        name: "Tiktok7",
        id: "idle-dance-tiktok7",
        duration: 12.96
    },
    {
        name: "Shrink",
        id: "emote-shrink",
        duration: 8.74
    },
    {
        name: "Ditzy Pose",
        id: "emote-pose9",
        duration: 4.58
    },
    {
        name: "Teleporting",
        id: "emote-teleporting",
        duration: 11.77
    },
    {
        name: "Touch",
        id: "dance-touch",
        duration: 11.7
    },
    {
        name: "Air Guitar",
        id: "idle-guitar",
        duration: 13.23
    },
    {
        name: "This Is For You",
        id: "emote-gift",
        duration: 5.8
    },
    {
        name: "Push It",
        id: "dance-employee",
        duration: 8
    },
    {
        name: "Fairy Float",
        id: "idle-floating",
        duration: 8
    },
    {
        name: "Stargaing",
        id: "emote-stargazer",
        duration: 7.32
    },
    {
        name: "Launch",
        id: "emote-launch",
        duration: 9.4
    },
    {
        name: "Cute Salute",
        id: "emote-cutesalute",
        duration: 3
    },
    {
        name: "Wop Dance",
        id: "dance-tiktok11",
        duration: 11
    },
    {
        name: "Sweet Smooch",
        id: "emote-kissing-bound",
        duration: 4.5
    },
    {
        name: "Karma Dance",
        id: "dance-wild",
        duration: 20
    },
    {
        name: "Fairy Twirl",
        id: "emote-looping",
        duration: 13
    },
    {
        name: "Diva Moment",
        id: "emote-threadexchange-posing",
        duration: 24
    },
    {
        name: "Sugar Stun",
        id: "emote-outfit3",
        duration: 15
    },
    {
        name: "Trampoline",
        id: "emote-trampoline",
        duration: 15
    },
    {
        name: "Moonlit Howl",
        id: "emote-howl",
        duration: 10
    },
    {
        name: "Nocturnal Howl",
        id: "idle-howl",
        duration: 10
    },
    {
        name: "Emote-Guitar",
        id: "emote-guitar",
        duration: 10
    },
    {
        name: null,
        id: "sit-cute",
        duration: 15
    },
    {
        name: null,
        id: "sit-ground-crossed",
        duration: 20
    },
    {
        name: null,
        id: "sit-ground-relaxed",
        duration: 20
    },
    {
        name: "Bloom Radiance",
        id: "emote-bloomify-pose3",
        duration: 4
    },
    {
        name: "Bloom Flutter",
        id: "emote-bloomify-pose1",
        duration: 6.5
    },
    {
        name: "Bloom Charm",
        id: "emote-bloomify-pose2",
        duration: 7.5
    },
    {
        name: "Storm Groove",
        id: "emote-rainstruck-success",
        duration: 5.5
    },
    {
        name: "Storm Mood",
        id: "emote-rainstruck-fail",
        duration: 6.5
    },
    {
        name: null,
        id: "emote-pose-stand1",
        duration: 4
    },
    {
        name: null,
        id: "emote-pose-stand2",
        duration: 5
    },
    {
        name: "Petal Perch",
        id: "emote-pose-sit",
        duration: 6
    },
    {
        name: "Tree Pose",
        id: "emote-yoga-treePose",
        duration: 5
    },
    {
        name: "Warrior II",
        id: "emote-yoga-warrior2",
        duration: 5
    },
    {
        name: "Warrior III",
        id: "emote-yoga-warrior3",
        duration: 5.5
    },
    {
        name: "Chaos Cutie",
        id: "emote-punkandlaces-pose1",
        duration: 3.5
    },
    {
        name: "Rebel Darling",
        id: "emote-punkandlaces-pose2",
        duration: 3.5
    },
    {
        name: "Sweet Tease",
        id: "emote-punkandlaces-pose3",
        duration: 3.5
    },
    {
        name: "Sweet Strike",
        id: "emote-sugarbite-pose1",
        duration: 10.5
    },
    {
        name: "Sweet Fix",
        id: "emote-sugarbite-pose2",
        duration: 10.6
    },
    {
        name: "Sweet Lure",
        id: "emote-sugarbite-pose3",
        duration: 10.5
    },
    {
        name: "Midnight Allure",
        id: "emote-pose-goth3",
        duration: 10
    },
    {
        name: "Midnight Poise",
        id: "emote-pose-goth1",
        duration: 10
    },
    {
        name: "Midnight Strut",
        id: "emote-pose-goth2",
        duration: 10
    },
    {
        name: "Spring Sun",
        id: "sit-idle-springSun",
        duration: 10
    },
    {
        name: "Silently Judging",
        id: "emote-threadexchange-floating",
        duration: 16.3
    },
    {
        name: "Come Here!",
        id: "emote-offdutyangels-comehere",
        duration: 5.8
    },
    {
        name: "Back Off!",
        id: "emote-offdutyangels-backoff",
        duration: 5.8
    },
    {
        name: "Just Vibing!",
        id: "emote-jewelrise-vibing",
        duration: 12.32
    }
]

module.exports = emotes