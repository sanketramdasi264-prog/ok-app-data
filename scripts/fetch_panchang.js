const fs = require('fs');
const path = require('path');

const PANCHANG_FILE = path.join(__dirname, '../data/panchang.json');

const marathiMapping = {
    tithi: {
        "Pratipada": "प्रतिपदा", "Dvitiya": "द्वितीया", "Tritiya": "तृतीया", "Chaturthi": "चतुर्थी",
        "Panchami": "पंचमी", "Shashthi": "षष्ठी", "Saptami": "सप्तमी", "Ashtami": "अष्टमी",
        "Navami": "नवमी", "Dashami": "दशमी", "Ekadashi": "एकादशी", "Dvadashi": "द्वादशी",
        "Trayodashi": "त्रयोदशी", "Chaturdashi": "चतुर्दशी", "Purnima": "पौर्णिमा", "Amavasya": "अमावस्या"
    },
    paksha: {
        "Shukla": "शुक्ल", "Krishna": "कृष्ण", "Bright": "शुक्ल", "Dark": "कृष्ण", "WhiteHalf": "शुक्ल", "DarkHalf": "कृष्ण"
    },
    nakshatra: {
        "Ashvini": "अश्विनी", "Bharani": "भरणी", "Krittika": "कृत्तिका", "Rohini": "रोहिणी",
        "Mrigashirsha": "मृगशीर्ष", "Ardra": "आर्द्रा", "Aridra": "आर्द्रा", "Punarvasu": "पुनर्वसू", "Pushya": "पुष्य",
        "Ashlesha": "आश्लेषा", "Magha": "मघा", "Purva Phalguni": "पूर्वा फाल्गुनी", "Uttara Phalguni": "उत्तरा फाल्गुनी",
        "Hasta": "हस्त", "Chitra": "चित्रा", "Svati": "स्वाती", "Vishakha": "विशाखा",
        "Anuradha": "अनुराधा", "Jyeshtha": "ज्येष्ठा", "Mula": "मूळ", "Purva Ashadha": "पूर्वाषाढा",
        "Uttara Ashadha": "उत्तराषाढा", "Uttarasadha": "उत्तराषाढा", "Shravana": "श्रवण", "Dhanishta": "धनिष्ठा", "Shatabhisha": "शततारका",
        "Purva Bhadrapada": "पूर्वा भाद्रपदा", "Uttara Bhadrapada": "उत्तरा भाद्रपदा", "Revati": "रेवती"
    },
    yog: {
        "Sukarma": "सुकर्मा", "Dhriti": "धृती", "Shula": "शूल", "Ganda": "गंड", "Vriddhi": "वृद्धी", "Dhruva": "ध्रुव",
        "Vyaghata": "व्याघात", "Harshana": "हर्षण", "Vajra": "वज्र", "Siddhi": "सिद्धी", "Vyatipata": "व्यतीपात",
        "Variyana": "वरीयान", "Variyan": "वरीयान", "Parigha": "परिघ", "Shiva": "शिव", "Siddha": "सिद्ध", "Sadhya": "साध्य", "Shubha": "शुभ",
        "Shukla": "शुक्ल", "Brahma": "ब्रह्म", "Indra": "इंद्र", "Vaidhriti": "वैधृती", "Vishkambha": "विष्कंभ",
        "Priti": "प्रीती", "Ayushmana": "आयुष्मान", "Saubhagya": "सौभाग्य", "Shobhana": "शोभन", "Atiganda": "अतिगंड"
    },
    karan: {
        "Bava": "बव", "Balava": "बालव", "Kaulava": "कौलव", "Taitila": "तैतिल", "Gara": "गरज", "Vanija": "वणिज",
        "Vishti": "भद्रा", "Shakuni": "शकुनी", "Chatushpada": "चतुष्पाद", "Naga": "नाग", "Kinstughna": "किंस्तुघ्न"
    },
    rashi: {
        "Aries": "मेष", "Taurus": "वृषभ", "Gemini": "मिथुन", "Cancer": "कर्क",
        "Leo": "सिंह", "Virgo": "कन्या", "Libra": "तूळ", "Scorpio": "वृश्चिक",
        "Sagittarius": "धनु", "Capricorn": "मकर", "Aquarius": "कुंभ", "Pisces": "मीन"
    },
    weekdays: {
        "Sunday": "रविवार", "Monday": "सोमवार", "Tuesday": "मंगळवार", "Wednesday": "बुधवार",
        "Thursday": "गुरुवार", "Friday": "शुक्रवार", "Saturday": "शनिवार"
    }
};

function translate(category, englishWord) {
    if (!englishWord) return "";
    return marathiMapping[category][englishWord] || englishWord;
}

function extractName(data) {
    if (!data) return "";
    let nameStr = "";
    if (typeof data === 'object' && data.Name) {
        nameStr = data.Name;
    } else if (typeof data === 'string') {
        nameStr = data;
    }
    return nameStr.split(' - ')[0].trim();
}

function extractTime(timeData) {
    if (!timeData) return "";
    if (typeof timeData === 'object' && timeData.StdTime) {
        return timeData.StdTime.split(' ')[0]; 
    }
    if (typeof timeData === 'string') {
        return timeData.split(' ')[0];
    }
    return "";
}

function extractRahukaal(rkData) {
    if (!rkData) return "";
    if (typeof rkData === 'string') return rkData;
    if (rkData.Start && rkData.End) {
        const start = extractTime(rkData.Start);
        const end = extractTime(rkData.End);
        if (start && end) return `${start} ते ${end}`;
    }
    return "";
}

function extractRashi(rashiData) {
    if (!rashiData) return "";
    if (typeof rashiData === 'string') return rashiData;
    if (rashiData.PlanetZodiacSignInDivisionalChart && rashiData.PlanetZodiacSignInDivisionalChart.ZodiacSign) {
        return rashiData.PlanetZodiacSignInDivisionalChart.ZodiacSign.Name;
    }
    return "";
}

// 1 मिनिटात 4 रिक्वेस्ट (15 सेकंदांचा गॅप)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchApiData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const json = await response.json();
        return json.Status === "Pass" ? json.Payload : null;
    } catch (e) {
        console.error("API Error fetching:", url, e);
        return null;
    }
}

async function fetchVedAstroData(dateObj) {
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    const formattedDate = `${dd}-${mm}-${yyyy}`;
    
    console.log(`Fetching Live Data for ${formattedDate}...`);

    const baseUrl = `https://api.vedastro.org/api/Calculate`;
const locTimeStr = `Location/Mumbai/Time/07:00/${dd}/${mm}/${yyyy}/+05:30`;
    const panchangaTable = await fetchApiData(`${baseUrl}/PanchangaTable/${locTimeStr}`);
    console.log("PanchangaTable fetched. Waiting 15 seconds...");
    await delay(15000);

    const rahuKala = await fetchApiData(`${baseUrl}/RahuKala/${locTimeStr}`);
    console.log("RahuKala fetched. Waiting 15 seconds...");
    await delay(15000);

    const moonRise = await fetchApiData(`${baseUrl}/MoonriseTime/${locTimeStr}`);
    console.log("Moonrise fetched. Waiting 15 seconds...");
    await delay(15000);

    const moonSet = await fetchApiData(`${baseUrl}/MoonsetTime/${locTimeStr}`);
    console.log("Moonset fetched. Waiting 15 seconds...");
    await delay(15000);

    const moonRashi = await fetchApiData(`${baseUrl}/GetPlanetZodiacSignInDivisionalChart/PlanetName/Moon/${locTimeStr}/divisionalChart/D1`);
    console.log("MoonRashi fetched. Waiting 15 seconds...");
    await delay(15000);

    const sunRashi = await fetchApiData(`${baseUrl}/GetPlanetZodiacSignInDivisionalChart/PlanetName/Sun/${locTimeStr}/divisionalChart/D1`);
    console.log("SunRashi fetched. Waiting 15 seconds...");
    await delay(15000);

    const pt = panchangaTable?.PanchangaTable || {};

    const fetchedData = {
        "date": formattedDate,
        "weekday": translate("weekdays", pt.DayOfWeek || dateObj.toLocaleDateString('en-US', { weekday: 'long' })),
        
        "tithi": translate("tithi", extractName(pt.Tithi)), 
        "paksha": translate("paksha", pt.Tithi?.Paksha || pt.Tithi?.Phase || ""),
        
        "nakshatra": translate("nakshatra", extractName(pt.Nakshatra)),
        "yog": translate("yog", extractName(pt.Yoga)),
        "karan": translate("karan", extractName(pt.Karana)),
        
        "moon_rashi": translate("rashi", extractRashi(moonRashi)),
        "sun_rashi": translate("rashi", extractRashi(sunRashi)),
        
        "sunrise": extractTime(pt.Sunrise),
        "sunset": extractTime(pt.Sunset),
        "moonrise": extractTime(moonRise?.MoonriseTime || moonRise),
        "moonset": extractTime(moonSet?.MoonsetTime || moonSet),
        
        "rahukaal": extractRahukaal(rahuKala?.RahuKala || rahuKala),
        
        "din_vishesh": "", 
        "location": "mumbai",
        "is_manual_override": false
    };

    return fetchedData;
}

async function updatePanchang() {
    let existingData = {};
    if (fs.existsSync(PANCHANG_FILE)) {
        existingData = JSON.parse(fs.readFileSync(PANCHANG_FILE, 'utf8'));
    }

    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    const formatDateKey = (date) => date.toISOString().split('T')[0];
    const datesToKeep = [formatDateKey(yesterday), formatDateKey(today), formatDateKey(tomorrow)];
    
    let newData = {};

    for (const dateKey of datesToKeep) {
        const dateObj = new Date(dateKey);
        
        if (existingData[dateKey] && existingData[dateKey].is_manual_override) {
            newData[dateKey] = existingData[dateKey];
            console.log(`${dateKey} चा मॅन्युअल डेटा सुरक्षित ठेवला.`);
        } else {
            const apiResult = await fetchVedAstroData(dateObj);
            newData[dateKey] = { ...existingData[dateKey], ...apiResult, is_manual_override: false };
            console.log(`${dateKey} चा डेटा लाईव्ह API वरून यशस्वीरित्या मॅप झाला.`);
        }
    }

    fs.writeFileSync(PANCHANG_FILE, JSON.stringify(newData, null, 2), 'utf8');
    console.log("पंचांग डेटा अपडेट पूर्ण झाले!");
}

updatePanchang();
