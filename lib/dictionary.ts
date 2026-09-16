export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];

const en = {
  localeName: "ES",
  localeSwitchLabel: "Cambiar a español",

  nav: {
    product: "Survivor Case",
    links: [
      { id: "overview", label: "Overview" },
      { id: "power", label: "Power" },
      { id: "alarm", label: "Alarm" },
    ],
    cta: "Get notified",
  },

  hero: {
    eyebrow: "Survivor Case",
    title: "A power and communication kit for any emergency.",
    subtitle:
      "An integrated power bank case with a dedicated battery that nothing but the distress alarm can ever touch.",
    primary: "See how it works",
    secondary: "Explore the prototype",
    scrollHint: "Scroll",
    dragHint: "Drag to rotate",
  },

  problem: {
    eyebrow: "The problem",
    title: "Everything depends on the same weak point: battery and signal.",
    points: [
      "Apps, collaborative maps and reporting lines all assume there is internet or cell service.",
      "The phone drains within hours of heavy use — flashlight, calls, connection attempts — and there is nowhere to charge it.",
    ],
    insightLabel: "The insight",
    insight:
      "The tech already exists. The challenge is designing it for a context like Cali, without depending on anything external.",
  },

  // The dark chapter. Four situations, told before the product exists on the
  // page — the scenes carry the problem, not the case.
  cases: {
    eyebrow: "When it matters",
    title: "Four moments the phone was never designed for.",
    lead: "None of these are rare. Most of them have already happened to you.",
    scenes: [
      {
        id: "road",
        eyebrow: "No signal",
        title: "Without signal, you can still call for help.",
        body: "A breakdown on an empty road at night. No bars, nobody passing. The phone in your hand is a flashlight and nothing more.",
        alt: "A person standing beside a stopped car on a dark mountain road, lit only by their phone.",
      },
      {
        id: "quake",
        eyebrow: "After the quake",
        title: "When you can't call, make it possible to find you.",
        body: "Dust, no light, no service. The phone drains itself trying to reach a network that is not there.",
        alt: "A dim, damaged stairwell after an earthquake, dust in the air around a single lamp.",
      },
      {
        id: "battery",
        eyebrow: "1% left",
        title: "Use your battery. Don't spend your last chance.",
        body: "The emergency arrives and the phone is almost empty. Every minute of flashlight is a minute you will not have for the call.",
        alt: "Hands holding a phone in darkness, the screen the only source of light.",
      },
      {
        id: "care",
        eyebrow: "Someone you love",
        title: "It isn't about owning emergency gear. It's about carrying it.",
        body: "An alarm in a drawer is not there when it happens. This one lives on the thing they already carry every day.",
        alt: "An older woman sitting alone by a window in the late afternoon, her phone on the table beside her.",
      },
    ],
  },

  // Copy blocks pinned to the scroll-scrubbed film. `at` and `until` are
  // fractions of the sequence, so the words land on the right frame.
  stage: [
    {
      at: 0.0,
      until: 0.24,
      eyebrow: "The case",
      title: "It looks like a case. It is a lifeline.",
      body: "Slim enough for every day, built around a power system that never runs out when it matters.",
    },
    {
      at: 0.26,
      until: 0.5,
      eyebrow: "Inside",
      title: "Two batteries. One you never touch.",
      body: "The main cells handle your everyday charge. A second bank sits locked away, reserved for one job only.",
    },
    {
      at: 0.52,
      until: 0.74,
      eyebrow: "Reserved cells",
      title: "Always full. Because daily use can’t reach them.",
      body: "No app, no low-battery panic and no forgotten charge can drain the reserve. It powers the distress alarm and nothing else.",
    },
    {
      at: 0.76,
      until: 1.0,
      eyebrow: "One port",
      title: "Charge the case, charge the phone.",
      body: "A single USB-C handles both. Plug in once and everything is topped up — case, phone and reserve.",
    },
  ],

  overview: {
    eyebrow: "Overview",
    title: "Three systems, one shell.",
    body: "Every component earns its place. Nothing here is decorative.",
    hotspots: [
      {
        id: "ble",
        title: "Wireless module (BLE)",
        body: "Keeps the case linked to the companion app.",
        x: 40,
        y: 36,
      },
      {
        id: "battery",
        title: "Principal battery",
        body: "Houses both battery systems: the main and reserved cells.",
        x: 46,
        y: 48,
      },
      {
        id: "buzzer",
        title: "High-decibel buzzer",
        body: "A loud audible alert to signal for help nearby.",
        x: 76,
        y: 54,
      },
    ],
  },

  pillars: {
    eyebrow: "Our solution",
    title: "An integrated power bank case with an always-reserved emergency system.",
    items: [
      {
        id: "main",
        name: "Main battery",
        body: "Your everyday charge. Everyday power for the phone, charged daily over USB-C.",
      },
      {
        id: "reserved",
        name: "Reserved cells",
        body: "Can only power the distress alarm. Locked backup power, never touched by daily use.",
      },
      {
        id: "switch",
        name: "Alarm switch",
        body: "Loud siren and automatic alert to your emergency network, the moment you flip it.",
      },
    ],
  },

  alarm: {
    eyebrow: "Recessed alarm switch",
    title: "Flip the switch.",
    body: "A loud alarm goes off immediately. It draws attention from anyone within earshot.",
    detail: "Physical and tactile — it works in the dark, or with gloves on.",
    state: { idle: "Armed", active: "Alarm active" },
    hint: "Try it",
  },

  risks: {
    eyebrow: "Risks and feasibility",
    title: "We know what stands in the way.",
    body: "The known risks are the industrial design and development issues that arise: battery safety certification, phone-model fragmentation and false-alarm fatigue.",
    body2:
      "The key is to explore a working prototype now and to iterate based on user feedback and market trends.",
  },

  closing: {
    title: "Built for the moment nothing else works.",
    body: "A power and communication kit for any emergency.",
    cta: "Explore the prototype",
  },

  footer: {
    presentedBy: "Presented by",
    team: "David García · Isabella Cabrera · Isabella Guerrero · Jaud Flores · Jean Alomia · Mariana Quintero · Natalia Ordoñez · Pablo López · Sary Payán",
    note: "Concept project. Survivor Case is not a commercially available product.",
  },

  a11y: {
    filmLabel:
      "Scroll-driven film showing the Survivor Case opening to reveal its internal battery system.",
    modelLabel:
      "Interactive 3D model of the Survivor Case. Drag to rotate it.",
    loading: "Loading",
  },
};

// Same shape, translated. Typed against `en` so a missing key fails the build.
const es: typeof en = {
  localeName: "EN",
  localeSwitchLabel: "Switch to English",

  nav: {
    product: "Survivor Case",
    links: [
      { id: "overview", label: "Vista general" },
      { id: "power", label: "Energía" },
      { id: "alarm", label: "Alarma" },
    ],
    cta: "Quiero saber más",
  },

  hero: {
    eyebrow: "Survivor Case",
    title: "Un kit de energía y comunicación para cualquier emergencia.",
    subtitle:
      "Una funda power bank integrada con una batería dedicada que solo la alarma de auxilio puede tocar.",
    primary: "Ver cómo funciona",
    secondary: "Conocer el prototipo",
    scrollHint: "Desliza",
    dragHint: "Arrastra para girar",
  },

  problem: {
    eyebrow: "El problema",
    title: "Todo depende del mismo punto débil: batería y señal.",
    points: [
      "Las apps, los mapas colaborativos y las líneas de reporte asumen que hay internet o señal celular.",
      "El teléfono se descarga en horas de uso intenso —linterna, llamadas, intentos de conexión— y no hay dónde cargarlo.",
    ],
    insightLabel: "El hallazgo",
    insight:
      "La tecnología ya existe. El reto es diseñarla para un contexto como Cali, sin depender de nada externo.",
  },

  cases: {
    eyebrow: "Cuando importa",
    title: "Cuatro momentos para los que el celular nunca fue diseñado.",
    lead: "Ninguno es excepcional. La mayoría ya te ha pasado.",
    scenes: [
      {
        id: "road",
        eyebrow: "Sin señal",
        title: "Sin señal también puedes pedir ayuda.",
        body: "Una varada de noche en una vía sola. Sin barras, sin nadie que pase. El celular que tienes en la mano es una linterna y nada más.",
        alt: "Una persona de pie junto a un carro detenido en una carretera de montaña a oscuras, iluminada solo por su celular.",
      },
      {
        id: "quake",
        eyebrow: "Después del sismo",
        title: "Cuando no puedes llamar, haz que puedan encontrarte.",
        body: "Polvo, sin luz, sin servicio. El celular se descarga solo, intentando alcanzar una red que no está.",
        alt: "Una escalera en penumbra y con daños después de un sismo, con polvo en el aire alrededor de una sola lámpara.",
      },
      {
        id: "battery",
        eyebrow: "Queda 1%",
        title: "Usa tu batería. No gastes tu última oportunidad.",
        body: "Llega la emergencia y el celular está casi vacío. Cada minuto de linterna es un minuto que no vas a tener para la llamada.",
        alt: "Unas manos sosteniendo un celular en la oscuridad; la pantalla es la única fuente de luz.",
      },
      {
        id: "care",
        eyebrow: "Alguien que quieres",
        title: "No se trata de tener un equipo de emergencia. Se trata de llevarlo contigo.",
        body: "Una alarma guardada en un cajón no está ahí cuando pasa algo. Esta vive en lo que esa persona ya carga todos los días.",
        alt: "Una mujer mayor sentada sola junto a una ventana al final de la tarde, con su celular sobre la mesa.",
      },
    ],
  },

  stage: [
    {
      at: 0.0,
      until: 0.24,
      eyebrow: "La funda",
      title: "Parece una funda. Es un salvavidas.",
      body: "Lo bastante delgada para el día a día, construida alrededor de un sistema de energía que nunca se agota cuando importa.",
    },
    {
      at: 0.26,
      until: 0.5,
      eyebrow: "Por dentro",
      title: "Dos baterías. Una nunca se toca.",
      body: "Las celdas principales dan la carga de todos los días. Un segundo banco queda bajo llave, reservado para una sola tarea.",
    },
    {
      at: 0.52,
      until: 0.74,
      eyebrow: "Celdas reservadas",
      title: "Siempre llenas. Porque el uso diario no las alcanza.",
      body: "Ninguna app, ningún susto de batería baja ni una carga olvidada pueden vaciar la reserva. Alimenta la alarma de auxilio y nada más.",
    },
    {
      at: 0.76,
      until: 1.0,
      eyebrow: "Un solo puerto",
      title: "Carga la funda, carga el teléfono.",
      body: "Un único USB-C se encarga de ambos. Conecta una vez y todo queda al tope: funda, teléfono y reserva.",
    },
  ],

  overview: {
    eyebrow: "Vista general",
    title: "Tres sistemas, una sola carcasa.",
    body: "Cada componente se gana su lugar. Aquí nada es decorativo.",
    hotspots: [
      {
        id: "ble",
        title: "Módulo inalámbrico (BLE)",
        body: "Mantiene la funda enlazada con la app compañera.",
        x: 40,
        y: 36,
      },
      {
        id: "battery",
        title: "Batería principal",
        body: "Aloja ambos sistemas: las celdas principales y las reservadas.",
        x: 46,
        y: 48,
      },
      {
        id: "buzzer",
        title: "Zumbador de alto decibelaje",
        body: "Una alerta sonora potente para pedir ayuda a quien esté cerca.",
        x: 76,
        y: 54,
      },
    ],
  },

  pillars: {
    eyebrow: "Nuestra solución",
    title: "Una funda power bank integrada con un sistema de emergencia siempre reservado.",
    items: [
      {
        id: "main",
        name: "Batería principal",
        body: "Tu carga de todos los días. Energía cotidiana para el teléfono, recargada a diario por USB-C.",
      },
      {
        id: "reserved",
        name: "Celdas reservadas",
        body: "Solo pueden alimentar la alarma de auxilio. Energía de respaldo bajo llave, intocable en el uso diario.",
      },
      {
        id: "switch",
        name: "Interruptor de alarma",
        body: "Sirena potente y aviso automático a tu red de emergencia en el instante en que lo accionas.",
      },
    ],
  },

  alarm: {
    eyebrow: "Interruptor de alarma empotrado",
    title: "Acciona el interruptor.",
    body: "Una alarma potente suena de inmediato. Llama la atención de cualquiera que esté al alcance del oído.",
    detail: "Físico y táctil: funciona a oscuras o con guantes puestos.",
    state: { idle: "Armado", active: "Alarma activa" },
    hint: "Pruébalo",
  },

  risks: {
    eyebrow: "Riesgos y viabilidad",
    title: "Sabemos qué hay en el camino.",
    body: "Los riesgos conocidos son los propios del diseño industrial y el desarrollo: certificación de seguridad de baterías, fragmentación de modelos de teléfono y fatiga por falsas alarmas.",
    body2:
      "La clave es explorar un prototipo funcional ahora e iterar con la retroalimentación de las personas y las tendencias del mercado.",
  },

  closing: {
    title: "Hecho para el momento en que nada más funciona.",
    body: "Un kit de energía y comunicación para cualquier emergencia.",
    cta: "Conocer el prototipo",
  },

  footer: {
    presentedBy: "Presentado por",
    team: "David García · Isabella Cabrera · Isabella Guerrero · Jaud Flores · Jean Alomia · Mariana Quintero · Natalia Ordoñez · Pablo López · Sary Payán",
    note: "Proyecto conceptual. Survivor Case no es un producto disponible comercialmente.",
  },

  a11y: {
    filmLabel:
      "Película controlada por scroll que muestra el Survivor Case abriéndose para revelar su sistema interno de baterías.",
    modelLabel:
      "Modelo 3D interactivo del Survivor Case. Arrástralo para girarlo.",
    loading: "Cargando",
  },
};

export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = { en, es };
