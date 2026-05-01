const Store = (() => {
  const CART_KEY = "aurasound_cart";
  const ORDER_KEY = "aurasound_last_order";

  const products = [
    {
      id: "test-rs1",
      name: "Test Product",
      price: 1,
      rating: 5,
      category: "Wireless",
      brand: "AURA",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Test product for checking checkout and QR payment flow.",
      description:
        "A ₹1 test product added for payment testing, invoice download checks, and order flow verification.",
      discountPercent: 0,
      specs: ["Test checkout", "₹1 price", "QR payment ready", "Invoice friendly", "Demo item"],
      reviews: [
        { user: "Admin", text: "Useful for testing the complete checkout flow." }
      ]
    },
    {
      id: "hx100",
      name: "AURA X100",
      price: 8999,
      rating: 4.8,
      category: "Wireless",
      brand: "AURA",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Premium ANC wireless headset with adaptive sound profile.",
      description:
        "AURA X100 delivers immersive active noise cancellation, rich low-end response, and all-day comfort in a futuristic matte-black frame.",
      specs: ["40mm Dynamic Drivers", "Bluetooth 5.3", "35-hour battery", "Hybrid ANC", "USB-C fast charge"],
      reviews: [
        { user: "Riya", text: "Deep bass and super comfortable for long sessions." },
        { user: "Aman", text: "ANC performance is top class in this range." }
      ]
    },
    {
      id: "hx200",
      name: "AURA Pulse Pro",
      price: 12999,
      rating: 4.9,
      category: "Wireless",
      brand: "AURA",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Flagship studio-grade wireless headphones with spatial audio.",
      description:
        "Pulse Pro brings high-resolution wireless playback, spatial soundstage, and pressure-free memory foam cushions for premium listening.",
      specs: ["50mm Graphene Drivers", "LDAC support", "40-hour battery", "Spatial audio", "Dual-device pairing"],
      reviews: [
        { user: "Nikhil", text: "Feels truly flagship. Soundstage is massive." },
        { user: "Shreya", text: "Beautiful design and crystal-clear vocals." }
      ]
    },
    {
      id: "hx300",
      name: "Volt Wired S",
      price: 3999,
      rating: 4.5,
      category: "Wired",
      brand: "Volt",
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Lightweight wired headset for balanced everyday sound.",
      description:
        "Volt Wired S is tuned for clarity with low distortion and a durable braided cable for dependable daily use.",
      specs: ["3.5mm audio jack", "32 Ohm impedance", "Foldable frame", "Braided cable", "Inline controls"],
      reviews: [
        { user: "Deepak", text: "Very clear mids and good comfort." },
        { user: "Leena", text: "Great quality for the price." }
      ]
    },
    {
      id: "hx400",
      name: "Nebula GX",
      price: 7499,
      rating: 4.7,
      category: "Gaming",
      brand: "Nebula",
      image: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=900&q=80",
      shortDescription: "RGB gaming headset with cinematic surround audio.",
      description:
        "Nebula GX is built for competitive gaming with accurate directional sound and low-latency USB mode for quick reaction cues.",
      specs: ["7.1 virtual surround", "Detachable boom mic", "RGB accents", "USB + 3.5mm", "Noise-isolating earcups"],
      reviews: [
        { user: "Rohan", text: "Excellent for footsteps in FPS titles." },
        { user: "Maya", text: "Mic clarity is clean and crisp." }
      ]
    },
    {
      id: "hx500",
      name: "Zenith Air",
      price: 5999,
      rating: 4.4,
      category: "Wireless",
      brand: "Zenith",
      image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Compact wireless headphones designed for travel.",
      description:
        "Zenith Air combines lightweight construction with punchy output and fast pairing for effortless on-the-go listening.",
      specs: ["Bluetooth 5.2", "28-hour battery", "Portable fold design", "Low-latency mode", "Type-C charging"],
      reviews: [
        { user: "Isha", text: "Perfect for travel and very lightweight." },
        { user: "Prateek", text: "Battery lasts surprisingly long." }
      ]
    },
    {
      id: "hx600",
      name: "Orion Studio",
      price: 9999,
      rating: 4.6,
      category: "Wired",
      brand: "Orion",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Reference-grade wired monitor headphones for creators.",
      description:
        "Orion Studio is crafted for accurate monitoring and mixing with neutral tonality and long-session ergonomics.",
      specs: ["Hi-res certified", "Detachable cable", "Closed-back design", "Memory foam band", "Studio tuning"],
      reviews: [
        { user: "Karan", text: "Best neutral sound profile in this budget." },
        { user: "Neha", text: "Excellent for music production." }
      ]
    },
    {
      id: "hx700",
      name: "AURA Nova Lite",
      price: 5499,
      rating: 4.3,
      category: "Wireless",
      brand: "AURA",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Budget wireless comfort with dynamic bass profile.",
      description:
        "Nova Lite offers balanced wireless playback, plush earcups, and quick device pairing for everyday commuting.",
      specs: ["Bluetooth 5.2", "24-hour battery", "Foldable body", "Dual EQ modes", "USB-C charging"],
      reviews: [
        { user: "Tanu", text: "Comfortable and loud enough for travel." },
        { user: "Abhi", text: "Strong value at this price point." }
      ]
    },
    {
      id: "hx800",
      name: "Nebula Rift 7X",
      price: 8299,
      rating: 4.7,
      category: "Gaming",
      brand: "Nebula",
      image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Low-latency gaming audio with precise directional cues.",
      description:
        "Rift 7X enhances competitive play with spatial awareness tuning and an ultra-clear detachable boom microphone.",
      specs: ["2.4GHz wireless dongle", "20ms low latency", "Surround processing", "RGB shell", "Detachable mic"],
      reviews: [
        { user: "Dev", text: "Directional sound is very accurate." },
        { user: "Pooja", text: "Great fit for long gaming sessions." }
      ]
    },
    {
      id: "hx900",
      name: "Volt Core M",
      price: 3199,
      rating: 4.2,
      category: "Wired",
      brand: "Volt",
      image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Portable wired headphones with punchy and clean sound.",
      description:
        "Core M is built for mobile listeners who need durable wired reliability and clear, fatigue-free tuning.",
      specs: ["3.5mm jack", "32mm neodymium drivers", "Fold-flat design", "1.2m cable", "Inline mic"],
      reviews: [
        { user: "Ravi", text: "Simple, clean and dependable." },
        { user: "Nina", text: "Nice vocals and decent bass." }
      ]
    },
    {
      id: "hx1000",
      name: "Zenith Halo ANC",
      price: 11499,
      rating: 4.8,
      category: "Wireless",
      brand: "Zenith",
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Premium ANC headphones for flights and office focus.",
      description:
        "Halo ANC combines adaptive suppression with premium call clarity and smart touch controls in a slim profile.",
      specs: ["Adaptive ANC", "6-mic ENC", "38-hour battery", "Touch controls", "Multipoint pairing"],
      reviews: [
        { user: "Sonia", text: "Noise cancellation is really effective." },
        { user: "Harsh", text: "Excellent call quality." }
      ]
    },
    {
      id: "hx1100",
      name: "Orion Mix One",
      price: 6899,
      rating: 4.5,
      category: "Wired",
      brand: "Orion",
      image: "https://images.unsplash.com/photo-1589584649628-b597068e13bd?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Creator-friendly wired monitor with accurate response.",
      description:
        "Mix One delivers neutral reference tuning and comfortable clamping force for long editing and monitoring sessions.",
      specs: ["Reference tuning", "Detachable 3.5mm cable", "Closed back", "35 Ohm", "Rotating earcups"],
      reviews: [
        { user: "Arjun", text: "Clean and neutral for my mixes." },
        { user: "Mira", text: "Very comfortable for studio work." }
      ]
    },
    {
      id: "hx1200",
      name: "AURA Drift Mini",
      price: 4799,
      rating: 4.1,
      category: "Wireless",
      brand: "AURA",
      image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Compact and foldable wireless headphones for students.",
      description:
        "Drift Mini is tuned for energetic music playback and delivers all-day wearability in a lightweight shell.",
      specs: ["Bluetooth 5.1", "22-hour battery", "Fast pair", "Fold compact", "Voice assistant support"],
      reviews: [
        { user: "Sneha", text: "Very light and easy to carry." },
        { user: "Varun", text: "Good battery and clear sound." }
      ]
    },
    {
      id: "hx1300",
      name: "Nebula Titan RGB",
      price: 9499,
      rating: 4.6,
      category: "Gaming",
      brand: "Nebula",
      image: "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Immersive gaming headset with cinematic low-end impact.",
      description:
        "Titan RGB delivers room-filling audio with customizable RGB zones and low distortion at high volume.",
      specs: ["50mm drivers", "7.1 virtual surround", "Dual connectivity", "Noise gate mic", "RGB sync modes"],
      reviews: [
        { user: "Yash", text: "Explosions and ambience sound amazing." },
        { user: "Kriti", text: "Excellent comfort and mic pickup." }
      ]
    },
    {
      id: "hx1400",
      name: "Volt Aero Max",
      price: 4299,
      rating: 4.4,
      category: "Wired",
      brand: "Volt",
      image: "https://images.unsplash.com/photo-1578319439584-104c94d37305?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Lightweight wired headphones with balanced signature.",
      description:
        "Aero Max is ideal for movies and podcasts with a clear center image and durable, travel-friendly design.",
      specs: ["3.5mm + adapter", "Lightweight frame", "Soft ear pads", "Braided cable", "Inline controls"],
      reviews: [
        { user: "Irfan", text: "Great comfort and clean treble." },
        { user: "Pallavi", text: "Perfect for laptop use." }
      ]
    },
    {
      id: "hx1500",
      name: "Zenith Crown X",
      price: 13799,
      rating: 4.9,
      category: "Wireless",
      brand: "Zenith",
      image: "https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Ultra-premium wireless flagship with rich detail retrieval.",
      description:
        "Crown X combines elite driver technology and premium materials for nuanced detail, deep bass, and top-tier comfort.",
      specs: ["Hi-res wireless", "45-hour battery", "Adaptive ANC", "Wear detection", "Dual codec support"],
      reviews: [
        { user: "Aditya", text: "Truly premium sound and finish." },
        { user: "Esha", text: "Best headphones I have owned." }
      ]
    },
    {
      id: "hx1600",
      name: "Orion Podcaster Pro",
      price: 7799,
      rating: 4.6,
      category: "Wired",
      brand: "Orion",
      image: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Broadcast-focused monitoring headset for streamers.",
      description:
        "Podcaster Pro offers voice-forward tonality and superior comfort for long streaming and recording sessions.",
      specs: ["Broadcast monitor tuning", "Detachable cable", "Low leakage", "Comfort headband", "Closed back"],
      reviews: [
        { user: "Ritesh", text: "Great for voice monitoring while streaming." },
        { user: "Heena", text: "Accurate and comfortable for hours." }
      ]
    },
    {
      id: "hx1700",
      name: "AURA Glide ANC",
      price: 10499,
      rating: 4.7,
      category: "Wireless",
      brand: "AURA",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Elegant ANC headphones tuned for modern pop and EDM.",
      description:
        "Glide ANC provides an expansive, energetic sound with impressive battery endurance and responsive touch gestures.",
      specs: ["Adaptive EQ", "34-hour battery", "Fast charge 10min/4hr", "Touch swipes", "Ambient mode"],
      reviews: [
        { user: "Lara", text: "Love the clean design and loud output." },
        { user: "Nikhit", text: "ANC and comfort are both excellent." }
      ]
    },
    {
      id: "hx1800",
      name: "Nebula Vortex Pro",
      price: 8899,
      rating: 4.5,
      category: "Gaming",
      brand: "Nebula",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Competitive gaming headset with punchy tuning and clarity.",
      description:
        "Vortex Pro balances bass impact and positional precision, making it ideal for esports and cinematic games.",
      specs: ["Dual audio modes", "Low-latency USB", "Foldable mic arm", "Memory cushions", "RGB trim"],
      reviews: [
        { user: "Ankit", text: "Great value for competitive gaming." },
        { user: "Mitali", text: "Superb mic clarity in team chat." }
      ]
    },
    {
      id: "hx1900",
      name: "Volt Prime ANC",
      price: 7099,
      rating: 4.4,
      category: "Wireless",
      brand: "Volt",
      image: "https://images.unsplash.com/photo-1620283085068-5d5f4875b944?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Value ANC wireless model with warm sound signature.",
      description:
        "Prime ANC focuses on comfort and smooth tuning, giving listeners a fatigue-free experience for daily commutes.",
      specs: ["Hybrid ANC", "30-hour battery", "USB-C charging", "Quick pair", "Voice assistant key"],
      reviews: [
        { user: "Ragini", text: "Good ANC for the price range." },
        { user: "Kabir", text: "Warm and enjoyable sound." }
      ]
    },
    {
      id: "hx2000",
      name: "Zenith Arc Studio",
      price: 11999,
      rating: 4.8,
      category: "Wired",
      brand: "Zenith",
      image: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Studio-class wired headphone with precise imaging.",
      description:
        "Arc Studio is designed for creators and enthusiasts seeking analytical detail, controlled bass, and broad soundstage.",
      specs: ["Reference drivers", "Detachable dual cable", "Metal yokes", "Studio impedance", "Carrying case"],
      reviews: [
        { user: "Rohit", text: "Excellent separation and detail." },
        { user: "Veda", text: "Ideal for mastering and editing." }
      ]
    },
    {
      id: "hx2100",
      name: "Orion AirWave",
      price: 6299,
      rating: 4.3,
      category: "Wireless",
      brand: "Orion",
      image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Everyday premium wireless headset with clear call audio.",
      description:
        "AirWave blends balanced output, reliable multipoint pairing, and ergonomic fit for work and entertainment.",
      specs: ["Bluetooth 5.3", "27-hour battery", "Dual mic calling", "Low latency mode", "Soft protein pads"],
      reviews: [
        { user: "Punit", text: "Very practical and comfortable daily driver." },
        { user: "Saloni", text: "Good calls and very stable connection." }
      ]
    },
    {
      id: "ab100",
      name: "AURA Buds Air ANC",
      price: 2499,
      rating: 4.5,
      category: "Airbuds",
      brand: "AURA",
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Compact ANC airbuds for calls, travel, and everyday music.",
      description:
        "AURA Buds Air ANC deliver pocket-friendly noise reduction, clear calls, and a balanced sound profile for daily use.",
      specs: ["Hybrid ANC", "24-hour case battery", "Quad-mic calling", "IPX4 splash resistance", "Low-latency mode"],
      reviews: [
        { user: "Riya", text: "Tiny, comfortable, and easy to carry." },
        { user: "Kabir", text: "Good ANC for this price." }
      ]
    },
    {
      id: "ab200",
      name: "Zenith Pocket Pro",
      price: 3299,
      rating: 4.6,
      category: "Airbuds",
      brand: "Zenith",
      image: "https://images.unsplash.com/photo-1590658006821-04f4008d5717?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Premium airbuds with warm bass and reliable battery life.",
      description:
        "Zenith Pocket Pro offers punchy wireless sound, quick pairing, and a slim charging case for commuting and gym sessions.",
      specs: ["30-hour total battery", "Bluetooth 5.3", "Fast pair", "Touch controls", "Bass boost EQ"],
      reviews: [
        { user: "Meera", text: "Bass is strong without getting muddy." },
        { user: "Aakash", text: "Case battery lasts for days." }
      ]
    },
    {
      id: "ab300",
      name: "Volt MiniPods C",
      price: 1799,
      rating: 4.2,
      category: "Airbuds",
      brand: "Volt",
      image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Budget airbuds for students and casual listeners.",
      description:
        "Volt MiniPods C are light, simple, and tuned for podcasts, calls, and casual playlists on a tight budget.",
      specs: ["Bluetooth 5.2", "18-hour total battery", "Dual-mic calls", "Compact case", "USB-C charging"],
      reviews: [
        { user: "Neel", text: "Very good for online classes." },
        { user: "Ira", text: "Lightweight and comfortable." }
      ]
    },
    {
      id: "ab400",
      name: "Nebula GameBuds X",
      price: 3899,
      rating: 4.4,
      category: "Airbuds",
      brand: "Nebula",
      image: "https://images.unsplash.com/photo-1631176093617-63490a3d785a?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Low-latency gaming airbuds with punchy sound.",
      description:
        "Nebula GameBuds X bring responsive wireless audio, game mode, and clear voice pickup in a compact earbud design.",
      specs: ["45ms game mode", "RGB case accent", "Dual device mode", "ENC calling", "25-hour case battery"],
      reviews: [
        { user: "Yash", text: "Game mode feels responsive." },
        { user: "Priya", text: "Great for mobile gaming." }
      ]
    },
    {
      id: "wh100",
      name: "AURA Cable Pro",
      price: 2199,
      rating: 4.4,
      category: "Wired",
      brand: "AURA",
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Affordable wired headphone with clean vocals and strong durability.",
      description:
        "AURA Cable Pro is a reliable wired headphone for laptops, phones, and study sessions with a tough braided cable.",
      specs: ["3.5mm jack", "40mm drivers", "Braided cable", "Inline mic", "Foldable frame"],
      reviews: [
        { user: "Rohan", text: "Very clear for calls and music." },
        { user: "Tanvi", text: "Cable feels durable." }
      ]
    },
    {
      id: "wh200",
      name: "Orion Monitor Lite",
      price: 3599,
      rating: 4.5,
      category: "Wired",
      brand: "Orion",
      image: "https://images.unsplash.com/photo-1589584649628-b597068e13bd?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Entry studio wired headphone for creators and editors.",
      description:
        "Orion Monitor Lite provides neutral tuning, soft pads, and a detachable cable for beginner studio work.",
      specs: ["Detachable cable", "Closed-back cups", "Neutral EQ", "Soft pads", "Laptop adapter included"],
      reviews: [
        { user: "Kunal", text: "Good for editing vocals." },
        { user: "Aisha", text: "Balanced and comfortable." }
      ]
    },
    {
      id: "wh300",
      name: "Volt Classic Wire",
      price: 1499,
      rating: 4.1,
      category: "Wired",
      brand: "Volt",
      image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Simple wired headphone for daily laptop and mobile use.",
      description:
        "Volt Classic Wire is built for buyers who want a low-cost wired headphone with clean sound and simple controls.",
      specs: ["3.5mm audio", "Inline control", "Lightweight frame", "Fold-flat design", "1.2m cable"],
      reviews: [
        { user: "Sameer", text: "Best for basic use." },
        { user: "Diya", text: "Easy and dependable." }
      ]
    },
    {
      id: "wh400",
      name: "Zenith Studio Max Wired",
      price: 5299,
      rating: 4.7,
      category: "Wired",
      brand: "Zenith",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Detailed wired headphone with broad soundstage.",
      description:
        "Zenith Studio Max Wired is tuned for musicians and detail lovers who prefer accurate wired listening.",
      specs: ["Hi-res audio", "50mm drivers", "Detachable cable", "Wide soundstage", "Carry pouch"],
      reviews: [
        { user: "Raghav", text: "Very detailed sound for the price." },
        { user: "Mina", text: "Great for acoustic music." }
      ]
    },
    {
      id: "hs100",
      name: "AURA CallMate 500",
      price: 2799,
      rating: 4.3,
      category: "Headset",
      brand: "AURA",
      image: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Work headset with clear microphone and soft all-day pads.",
      description:
        "AURA CallMate 500 is built for office calls, online classes, and meetings with voice-focused tuning.",
      specs: ["Noise-reducing mic", "USB + 3.5mm", "Soft ear pads", "Mute control", "Lightweight headband"],
      reviews: [
        { user: "Nisha", text: "Mic is clear for meetings." },
        { user: "Gaurav", text: "Comfortable for long calls." }
      ]
    },
    {
      id: "hs200",
      name: "Nebula Strike Mic",
      price: 4599,
      rating: 4.6,
      category: "Headset",
      brand: "Nebula",
      image: "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Gaming headset with detachable boom mic and surround tuning.",
      description:
        "Nebula Strike Mic offers positional game audio, a detachable microphone, and strong comfort for long sessions.",
      specs: ["Detachable boom mic", "Virtual surround", "Memory foam pads", "RGB trim", "USB audio"],
      reviews: [
        { user: "Dev", text: "Great mic and game direction cues." },
        { user: "Kriti", text: "Looks premium on desk." }
      ]
    },
    {
      id: "hs300",
      name: "Orion StreamTalk Pro",
      price: 6999,
      rating: 4.7,
      category: "Headset",
      brand: "Orion",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Creator headset for streaming, voice monitoring, and podcasting.",
      description:
        "Orion StreamTalk Pro combines broadcast-style monitoring with a strong microphone for streamers and creators.",
      specs: ["Broadcast mic", "Closed-back monitor", "Detachable cable", "Voice-first tuning", "Comfort clamp"],
      reviews: [
        { user: "Ishan", text: "Excellent for streaming voice." },
        { user: "Pallavi", text: "Very comfortable for recording." }
      ]
    },
    {
      id: "hs400",
      name: "Volt Office Duo",
      price: 1999,
      rating: 4.2,
      category: "Headset",
      brand: "Volt",
      image: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=900&q=80",
      shortDescription: "Budget headset for meetings, learning, and support work.",
      description:
        "Volt Office Duo keeps calls clear with a simple plug-and-play headset design for everyday productivity.",
      specs: ["Adjustable mic", "USB plug", "Inline mute", "Light frame", "Clear speech tuning"],
      reviews: [
        { user: "Arun", text: "Good for office calls." },
        { user: "Sneha", text: "Simple and useful." }
      ]
    }
  ];

  const read = (key, fallback) => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return data ?? fallback;
    } catch (error) {
      return fallback;
    }
  };

  const write = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getCart = () => read(CART_KEY, []);
  const setCart = (cart) => write(CART_KEY, cart);
  const clearCart = () => setCart([]);

  const getProductById = (id) => products.find((item) => item.id === id);

  products.forEach((product, index) => {
    product.discountPercent ??= [18, 12, 22, 15, 10, 20][index % 6];
  });

  const discountedPrice = (product) =>
    Math.round(product.price * (1 - (product.discountPercent || 0) / 100));

  const savings = (product) => product.price - discountedPrice(product);

  const cartCount = () =>
    getCart().reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = () =>
    getCart().reduce((sum, item) => {
      const product = getProductById(item.id);
      return product ? sum + discountedPrice(product) * item.quantity : sum;
    }, 0);

  const addToCart = (id, quantity = 1) => {
    const cart = getCart();
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id, quantity });
    }
    setCart(cart);
    window.dispatchEvent(new CustomEvent("cart:updated"));
  };

  const updateQuantity = (id, quantity) => {
    const cart = getCart();
    const existing = cart.find((item) => item.id === id);
    if (!existing) return;
    existing.quantity = Math.max(1, quantity);
    setCart(cart);
    window.dispatchEvent(new CustomEvent("cart:updated"));
  };

  const removeFromCart = (id) => {
    const next = getCart().filter((item) => item.id !== id);
    setCart(next);
    window.dispatchEvent(new CustomEvent("cart:updated"));
  };

  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  const saveLastOrder = (order) => write(ORDER_KEY, order);
  const getLastOrder = () => read(ORDER_KEY, null);

  return {
    products,
    getProductById,
    getCart,
    setCart,
    clearCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartTotal,
    discountedPrice,
    savings,
    formatINR,
    saveLastOrder,
    getLastOrder
  };
})();
