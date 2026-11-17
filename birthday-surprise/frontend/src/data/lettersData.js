import { getAssetUrl } from './mediaData.js';

export const LETTERS = [
  {
    id: 'safe-place',
    title: 'A Safe Place in You',
    subtitle: 'Choosing you, appreciating you, always',
    preview: 'Having you in my life feels like one of the most beautiful things I could ever ask for...',
    date: 'Forever & Always',
    stamp: '💌',
    sealColor: '#e11d48',
    gradient: 'from-rose-500/20 to-pink-500/10',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-300',
    tags: ['Safe Place', 'Love', 'Gratitude'],
    image: null,
    paragraphs: [
      "Having you in my life feels like one of the most beautiful things I could ever ask for. You've shown me a kind of love that makes me feel safe enough to be honest, vulnerable, and completely myself. With you, I've learned that loving someone isn't about needing them to complete you—it's about choosing them, appreciating them, and making sure they know how deeply they matter.",
      "I know some days may feel heavier than others. There may be moments when you question yourself, feel lost, or wonder if you're doing enough. Whenever those moments come, I want you to remember that you don't have to face them alone. I'll be here not because you have to be perfect, but because I love you exactly as you are.",
      "I want to be the person who brings calm to your heart, a reason behind your smile, and a shoulder you can always trust. I'll keep reminding you of your worth, especially on the days when you forget it yourself.",
      "You are incredibly precious to me, and words will never fully explain how much I care about you. I just hope that every little moment we share—every smile, every laugh, every silence—makes you feel how deeply you are loved.",
      "Thank you for being such a beautiful part of my life. 🤍"
    ]
  },
  {
    id: 'special-person',
    title: 'Special Person 💫',
    subtitle: 'When I say special, I mean very very special to me',
    preview: "You're special & when I say special I mean very very special to me. Because I have always noticed...",
    date: 'My Only One',
    stamp: '⭐',
    sealColor: '#0ea5e9',
    gradient: 'from-sky-500/20 to-blue-500/10',
    borderColor: 'border-sky-500/30',
    textColor: 'text-sky-300',
    tags: ['Special', 'Comfort', 'True Bond'],
    image: null,
    paragraphs: [
      "You're special & when I say special I mean very very special to me.",
      "Because I have always noticed that I'm not so comfortable with anyone, but when it comes to talking with you, sharing with you, I always feel like I can. I don't have limits. You listen to me. You don't judge me! I don't fear about what you'll think about me.",
      "Thanks for shouting at me when I was wrong, thanks for fighting for me. Thanks for making me realize that I am special for you, important for you & never leaving me when I was worse.",
      "I don't need anyone else, but I just need one person in my life & that's you.",
      "Just stay with me always because you're very very special to me & I Love you so much. 🤍✨"
    ]
  },
  {
    id: 'sunshine-family',
    title: 'Little Piece of Sunshine 🌞❤️',
    subtitle: 'Happpppyyyy bday to my girl, my true better half',
    preview: "Happpppyyyy bday to my Little piece of sunshine! Wish u all the happiness in life...",
    date: 'Birthday Bliss',
    stamp: '🌻',
    sealColor: '#f59e0b',
    gradient: 'from-amber-500/20 to-orange-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-300',
    tags: ['Sunshine', 'Family', 'Soulmate'],
    image: null,
    paragraphs: [
      "Happpppyyyy bday to my Little piece of sunshine 🌞❤️ Wish u all the happiness in life and the best of everything! 🥺💖",
      "I'm so lucky to have you, you have absolutely become a family member now 🌺 I found my homeee in you, my girl 🌷🌍",
      "I'm so happy because I found a soul that feels like home, my true better half 🥺❤️",
      "So to my favourite one, may this year bring a lot of happiness, endless love, and all the pretty little joys you deserve! ⭐🎉",
      "You are my forever thing 💌🧸 And I'm so, so proud of you for everything 💐 Happy birthday once again! Love you always and forever ❤️🤗"
    ]
  },
  {
    id: 'for-arthi',
    title: 'FOR ARTHI 🦋',
    subtitle: 'Ava enakku just oru girl illa... En life-la romba special-ah irukkura oru feeling',
    preview: "Ava enakku romba special... Ava kooda pesuradhu, time spend pandradhu ellame oru different feel. 🫶",
    date: 'Uyire 🌿',
    stamp: '🦋',
    sealColor: '#8b5cf6',
    gradient: 'from-purple-500/20 to-violet-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-300',
    tags: ['Arthi Special', 'Tamil Heart', 'Feelings'],
    image: null,
    paragraphs: [
      "Ava enakku romba special... Ava kooda pesuradhu, time spend pandradhu ellame oru different feel. 🫶",
      "En happy moments-la mattum illa... Naan low-ah irukkumbodhum enna vittu pogama irukkura oru person aval. ❤️🩹",
      "Naan edhuvum sollaama irundhaalum, Enakku enna aachi-nu purinjikka try pannuva. 🤍 Enakku ellar kittayum share panna mudiyadha vishayangalai kooda, Aval kitta mattum comfortable-ah share panna mudiyum. 🔐",
      "Avaloda support, care, understanding... Idhellam enakku romba valuable. 🌿",
      "Aval enakku just oru girl illa... En life-la romba special-ah irukkura oru feeling. 🤍🦋"
    ]
  },
  {
    id: 'my-sweetheart',
    title: 'My Sweetheart 🧿🌈💗',
    subtitle: 'My life, My favourite person, My everything, always & forever',
    preview: 'My life 🫀, My favourite person 🥺, My everything 🌎, My home 🏡, My safe place 🤍...',
    date: 'Infinite Love ♾️',
    stamp: '🧿',
    sealColor: '#ec4899',
    gradient: 'from-fuchsia-500/20 to-pink-500/10',
    borderColor: 'border-fuchsia-500/30',
    textColor: 'text-fuchsia-300',
    tags: ['Sweetheart', 'Infinite', 'My Everything'],
    image: null,
    paragraphs: [
      "My life 🫀, My favourite person 🥺, My everything 🌎,",
      "My home 🏡, My safe place 🤍, My happiness 🥰, My peace 🕊️",
      "My forever ♾️, My soulmate 🫶, My sunshine ☀️, My cutest girl 🎀,",
      "My princess 👑, My best friend 🫂, My biggest blessing 🫶, My heart ❤️,",
      "My whole world 🌎, My dream girl ✨, My comfort person 🫂,",
      "My favourite notification 📱💕, My reason to smile 😊,",
      "My always ♾️, My strongest feeling 💞,",
      "My most beautiful chapter 📖✨, My person 🫶, My happy place 🌸,",
      "My universe 🌌, My forever favourite 💗,",
      "My little world 🌎💗, My sweetest habit 🥺, My lucky charm 🍀",
      "My perfect one 🫀, My constant 🤍, My all-time favourite 💕",
      "My most precious everything 🥺❤️, always & forever ♾️🫶🤍"
    ]
  },
  {
    id: 'my-therapist',
    title: 'Happy Birthday My Therapist 🙈🥺',
    subtitle: "You're my strongest woman, my biggest comfort and my safest place",
    preview: "Happyyyy Birthdayyyy myy therapist 🙈🥺. Happiest birthday to the girl who has always stayed beside me...",
    date: 'Nov 18, 2026 🎂',
    stamp: '🌸',
    sealColor: '#f43f5e',
    gradient: 'from-pink-500/25 to-rose-500/10',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-300',
    tags: ['Therapist', 'Safest Place', 'God’s Blessing'],
    image: getAssetUrl('images/letters/letter_therapist.jpg'),
    paragraphs: [
      "Happyyyy Birthdayyyy myy therapist 🙈🥺.",
      "Happiest birthday to the girl who has always stayed beside me, no matter what life brings. 🤍✨ You're my strongest woman, my biggest comfort and my safest place. 💪🎀",
      "I pray that your life is always filled with happiness, peace and endless smiles. 🌸🤍 I hope my prayers hug you whenever my arms can't. 🥺🫂",
      "Thank you for always supporting me, understanding me and never giving up on me. 💖 I truly can't imagine my life without you. 🌷",
      "May this year bring you everything your heart has been silently wishing for. 🌙💝",
      "Keep shining, keep smiling and never forget how deeply loved and appreciated you are. 🫂✨",
      "Having you in my life is one of God's biggest blessings, and I'll always be thankful for you. 🥺💐",
      "Happy Birthday once again, my favorite person. 🥹🎂👑"
    ]
  },
  {
    id: 'dear-best-friend',
    title: 'Dear Best Friend 💕',
    subtitle: 'You are not just my friend, you are my comfort, my peace, and my forever person',
    preview: 'I still remember the day we started talking without knowing that one day you would become...',
    date: 'Our Unbreakable Bond',
    stamp: '🌹',
    sealColor: '#dc2626',
    gradient: 'from-red-500/20 to-rose-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-300',
    tags: ['Best Friend', 'Forever Person', 'Unbreakable'],
    image: getAssetUrl('images/letters/letter_best_friend.jpg'),
    paragraphs: [
      "Dear Best Friend, 💕",
      "I still remember the day we started talking without knowing that one day you would become one of the most important people in my life. Today, you are not just my friend, you are my comfort, my peace, and the person who makes every bad day feel a little better. 🌸",
      "Whenever life gets heavy, I always feel lighter after talking to you. Not because you solve everything, but because your presence gives me strength. With you, I never have to pretend. I can laugh freely, cry openly, and be completely myself. 🤍",
      "I know we fight sometimes, misunderstand each other, and act childish, but deep inside I know our bond is stronger than all those small moments. Thank you for always being there, for listening to me, and for making ordinary days feel special. ✨",
      "No matter where life takes us, I hope we always find our way back to this friendship. Because having you in my life is one of the biggest blessings I could ever ask for. 💕",
      "You are not just my best friend... you are my forever person. 🤍"
    ]
  },
  {
    id: 'things-never-told',
    title: 'Things I Never Told You... ❤️🩹',
    subtitle: 'You became a beautiful part of my life without even trying',
    preview: 'There were so many things I wanted to tell you, but somehow, I never found the right words...',
    date: 'Quiet In My Heart',
    stamp: '🕯️',
    sealColor: '#a855f7',
    gradient: 'from-purple-900/30 to-slate-900/40',
    borderColor: 'border-purple-400/30',
    textColor: 'text-purple-300',
    tags: ['Confession', 'Memories', 'Deep Emotions'],
    image: getAssetUrl('images/letters/letter_never_told.jpg'),
    paragraphs: [
      "Things I Never Told You... ❤️🩹",
      "There were so many things I wanted to tell you, but somehow, I never found the right words. I wanted to tell you how your smallest messages could make my entire day better, how I smiled at my phone because of you, and how sometimes, I waited for your reply longer than I should have.",
      "I never told you how much the little things meant to me, how I remembered our smallest conversations, or how I sometimes missed you even when we had just talked. Maybe you never noticed, and maybe you never will.",
      "But the truth is, you became a beautiful part of my life without even trying. And if I ever get the chance to tell you everything, I don't know if I'll have the courage.",
      "So, I'll keep these feelings quietly in my heart, hoping that somewhere, somehow, you knew you were special to me. ❤️🩹"
    ]
  }
];
