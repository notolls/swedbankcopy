
LoginWidget.CONFIG = {
  NON_CUSTOMER: false,
  LOGIN_METHODS: "SMART_ID,SIMPLE_ID,MOBILE_ID,DIGIPASS,CERTIFICATE",
  LANGUAGE: "lt",
  COUNTRY: "LT"
};

LoginWidget.getLoginList = function () {
  return [];
};

LoginService = window.LoginService || {};
LoginService.Config = LoginService.Config || {};
LoginService.Config.URL_BASE = "https:\/\/login.swedbank.lt";


LoginWidget.LABELS = {
  HEADER: "Prisijunkite su",
  TABS_CAPTION: "Pasirinkite prisijungimo b\u016Bd\u0105",

  SMART_ID: "Smart-ID",
  CERTIFICATE: "ID-kortel\u0117",
  MOBILE_ID: "Mobile-ID",
  DIGIPASS: "PIN generatorius",
  SIMPLE_ID: "Biometrika\/PIN",
  EPARAKSTS_MOBILE: "eParaksts mobile",
  REMEMBER_ME: "\u012Esiminti mane",
  REMEMBER_ME_HINT: "Nepra\u0161yti \u012Fvesti asmens kod\u0105 kit\u0105 kart\u0105",

  LOGIN_BUTTON_CAPTION: "Prisijungti",

  USER_ID: "Naudotojo ID",
  PERSONAL_CODE: "Asmens kodas",
  PHONE_NUMBER: "Telefono numeris",
  PIN_CALC_PASSWORD: "Slapta\u017Eodis i\u0161 PIN kod\u0173 generatoriaus:",

  COUNTRY_ESTONIA: "Estija",
  COUNTRY_LITHUANIA: "Lietuva",
  COUNTRY_LATVIA: "Latvija",

  BADGE_NEW: "Nauja",
  SIMPLE_ID_PROMO_TEXT: "Prisijunkite pir\u0161to atspaudu, veido atpa\u017Einimu arba PIN kodu. Prie\u0161 tai \u012Fsitikinkite, ar aktyvavote tok\u012F prisijungim\u0105 \u201ESwedbank\u201C program\u0117l\u0117je.",
  SIMPLE_ID_PROMO_LINK_TEXT: "Pla\u010Diau",
  SIMPLE_ID_PROMO_LINK_URL: "https:\/\/www.swedbank.lt\/private\/d2d\/ebanking\/authentication?language=LIT"
};

LoginWidget.MESSAGES = {
  TIMEOUT_ERROR: "Error has occurred, the request could be not processed. Please, try again later.",
  TECH_ERROR: "Technin\u0117 klaida.",
  IDENTITY_CODE_REQUIRED: "Jungiantis turite \u012Fvesti ir savo asmens kod\u0105.",
  COOKIES_DISABLED: "J\u016Bs\u0173 nar\u0161ykl\u0117je i\u0161jungti slapukai (cookies). \u012Ejunkite slapukus, kad gal\u0117tum\u0117te prisijungti.",
  EMPTY_USER_ID: "Pra\u0161ome \u012Fvesti naudotojo ID",
  EMPTY_PINCALC_PWD: "Naudotojo ID\/ slapta\u017Eodis ne\u012Fvestas",
  EMPTY_PHONE: "Prisijungimas su m. para\u0161u nes\u0117kmingas.",
  EMPTY_REG_CODE: "\u012Eveskite asmens kod\u0105",

  LOGIN_CHALLENGE_MESSAGE: "J\u016Bs\u0173 kontrolinis kodas:",
  LOGIN_CHALLENGE_HINT: "J\u016Bs gavote u\u017Eklaus\u0105, kurioje nurodytas kontrolinis kodas, matomas ekrane. Jeigu jie sutaps, \u012Fveskite PIN1.",
  SMART_ID_LOGIN_CHALLENGE_HINT: "Prisijungsite atsidar\u0119 Smart-ID program\u0117l\u0119 ir \u012Fved\u0119 joje PIN1 kod\u0105.",
  MOBILE_ID_LOGIN_CHALLENGE_HINT: "Prisijungsite savo mobiliajame telefone \u012Fved\u0119 M. para\u0161o PIN1 kod\u0105.",
  SIMPLE_ID_LOGIN_CHALLENGE_HINT: "Visuomet palyginkite kod\u0105 su tuo, kur\u012F matote \u201ESwedbank\u201C program\u0117l\u0117je. Nor\u0117dami prisijungti, nuskenuokite biometrinius duomenis arba \u012Fveskite PIN kod\u0105.",
  SMART_ID_IN_PROGRESS: "U\u017Eklausa i\u0161si\u0173sta \u012F j\u016Bs\u0173 i\u0161man\u0173j\u012F \u012Frengin\u012F. Palyginkite kontrolin\u012F kod\u0105 ir \u012Fveskite PIN1.",
  EPARAKSTS_MOBILE_IN_PROGRESS: "U\u017Eklausa i\u0161si\u0173sta \u012F j\u016Bs\u0173 i\u0161man\u0173j\u012F \u012Frengin\u012F. Palyginkite kontrolin\u012F kod\u0105 ir \u012Fveskite PIN1.",
  MOBILE_ID_IN_PROGRESS: "U\u017Eklausa i\u0161si\u0173sta \u012F j\u016Bs\u0173 mobil\u0173j\u012F telefon\u0105. Palyginkite kontrolin\u012F kod\u0105 ir \u012Fveskite PIN1.",
  SIMPLE_ID_IN_PROGRESS: "U\u017Eklausa i\u0161si\u0173sta \u012F j\u016Bs\u0173 i\u0161man\u0173j\u012F \u012Frengin\u012F. Palyginkite kontrolin\u012F kod\u0105 ir prisijunkite biometriniu b\u016Bdu arba PIN kodu.",
  LOGIN_IN_PROGRESS: ""
};

LoginService = window.LoginService || {};
LoginService.HwcryptoLabels = {
  default_error: "ID-card plugin error.",
  no_certificates: "No certificates are present. Please check that ID-card is in card-reader.",
  user_cancel: "ID-card login cancelled",
  driver_error: "Card-reader driver error. Please check that ID-card software is installed correctly.",
  no_implementation: "No ID-card plugin found. Please check that id-card plugin is installed to your browser. You may need restart the browser after plugin installation."
}

