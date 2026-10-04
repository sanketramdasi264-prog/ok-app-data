const fs = require('fs');
const path = require('path');

const PANCHANG_FILE = path.join(__dirname, '../data/panchang.json');

// १. मराठी डिक्शनरी (Mapping)
const marathiMapping = {
    tithi: {
        "Pratipada": "प्रतिपदा", "Dvitiya": "द्वितीया", "Tritiya": "तृतीया", "Chaturthi": "चतुर्थी",
        "Panchami": "पंचमी", "Shashthi": "षष्ठी", "Saptami": "सप्तमी", "Ashtami": "अष्टमी",
        "Navami": "नवमी", "Dashami": "दशमी", "Ekadashi": "एकादशी", "Dvadashi": "द्वादशी",
        "Trayodashi": "त्रयोदशी", "Chaturdashi": "चतुर्दशी", "Purnima": "पौर्णिमा", "Amavasya": "अमावस्या"
    },
    paksha: {
        "Shukla": "शुक्ल", "Krishna": "कृष्ण", "Bright": "शुक्ल", "Dark": "कृष्ण"
    },
    nakshatra: {
        "Ashvini": "अश्विनी", "Bharani": "भरणी", "Krittika": "कृत्तिका", "Rohini": "रोहिणी",
        "Mrigashirsha": "मृगशीर्ष", "Ardra": "आर्द्रा", "Punarvasu": "पुनर्वसू", "Pushya": "पुष्य",
        "Ashlesha": "आश्लेषा", "Magha": "मघा", "Purva Phalguni": "पूर्वा फाल्गुनी", "Uttara Phalguni": "उत्तरा फाल्गुनी",
        "Hasta": "हस्त", "Chitra": "चित्रा", "Svati": "स्वाती", "Vishakha": "विशाखा",
        "Anuradha": "अनुराधा", "Jyeshtha": "ज्येष्ठा", "Mula": "मूळ", "Purva Ashadha": "पूर्वाषाढा",
        "Uttara Ashadha": "उत्तराषाढा", "Shravana": "श्रवण", "Dhanishta": "धनिष्ठा", "Shatabhisha": "शततारका",
        "Purva Bhadrapada": "पूर्वा भाद्रपदा", "Uttara Bhadrapada": "उत्तरा भाद्रपदा", "Revati": "रेवती", "Uttarasadha": "उत्तराषाढा"
    },
    yog: {
        "Sukarma": "सुकर्मा", "Dhriti": "धृती", "Shula": "शूल", "Ganda": "गंड", "Vriddhi": "वृद्धी", "Dhruva": "ध्रुव",
        "Vyaghata": "व्याघात", "Harshana": "हर्षण", "Vajra": "वज्र", "Siddhi": "सिद्धी", "Vyatipata": "व्यतीपात",
        "Variyana": "वरीयान", "Parigha": "परिघ", "Shiva": "शिव", "Siddha": "सिद्ध", "Sadhya": "साध्य", "Shubha": "शुभ",
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

// सुरक्षितपणे API कॉल करण्यासाठी हेल्पर फंक्शन
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

// २. VedAstro कडून लाईव्ह डेटा आणणारे मुख्य फंक्शन
async function fetchVedAstroData(dateObj) {
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    const formattedDate = `${dd}-${mm}-${yyyy}`;
    
    console.log(`Fetching Live Data for ${formattedDate}...`);

    const baseUrl = `https://api.vedastro.org/api/Calculate`;
    const locTimeStr = `Location/Pune/Time/07:00/${dd}/${mm}/${yyyy}/+05:30`;

    // सर्व Endpoints वरून एकाच वेळी डेटा आणणे (Parallel Fetch)
    const [
        panchangaTable,
        rahuKala,
        moonRise,
        moonSet,
        moonRashi,
        sunRashi
    ] = await Promise.all([
        fetchApiData(`${baseUrl}/PanchangaTable/${locTimeStr}`),
        fetchApiData(`${baseUrl}/RahuKala/${locTimeStr}`),
        fetchApiData(`${baseUrl}/MoonriseTime/${locTimeStr}`),
        fetchApiData(`${baseUrl}/MoonsetTime/${locTimeStr}`),
        fetchApiData(`${baseUrl}/GetPlanetZodiacSignInDivisionalChart/PlanetName/Moon/${locTimeStr}/divisionalChart/D1`),
        fetchApiData(`${baseUrl}/GetPlanetZodiacSignInDivisionalChart/PlanetName/Sun/${locTimeStr}/divisionalChart/D1`)
    ]);

    // पंचांग टेबल मधील माहिती काढणे
    const pt = panchangaTable?.PanchangaTable || {};
    
    // राशीचे नाव काढण्यासाठी सुरक्षित पद्धत (API response नुसार)
    const getZodiacName = (rashiData) => rashiData?.PlanetZodiacSignInDivisionalChart?.ZodiacSign?.Name || (typeof rashiData === 'string' ? rashiData : "");

    const fetchedData = {
        "date": formattedDate,
        "weekday": translate("weekdays", pt.DayOfWeek),
        
        "tithi": translate("tithi", pt.Tithi), 
        "paksha": "", // VedAstro च्या मुख्य टेबलमध्ये पक्षात येत नसल्यास मॅन्युअली काढता येतो किंवा तसाच ठेवता येतो
        
        "nakshatra": translate("nakshatra", pt.Nakshatra),
        "yog": translate("yog", pt.Yoga),
        "karan": translate("karan", pt.Karana),
        
        "moon_rashi": translate("rashi", getZodiacName(moonRashi)),
        "sun_rashi": translate("rashi", getZodiacName(sunRashi)),
        
        "sunrise": pt.Sunrise || "",
        "sunset": pt.Sunset || "",
        
        "moonrise": typeof moonRise === 'string' ? moonRise : (moonRise?.MoonriseTime || ""),
        "moonset": typeof moonSet === 'string' ? moonSet : (moonSet?.MoonsetTime || ""),
        
        "rahukaal": typeof rahuKala === 'string' ? rahuKala : (rahuKala?.RahuKala || ""),
        
        "din_vishesh": "", // विशेष दिवस मॅन्युअल ठेवावे लागतात किंवा वेगळ्या API ने घ्यावे लागतात
        "location": "Pune",
        "is_manual_override": false
    };

    return fetchedData;
}

// ३. ३ दिवसांचा डेटा मॅनेज करणे
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
            // जुना मॅन्युअल डेटा असेल तर तो नवीन डेटामध्ये merge करा
            newData[dateKey] = { ...existingData[dateKey], ...apiResult, is_manual_override: false };
            console.log(`${dateKey} चा डेटा लाईव्ह API वरून यशस्वीरित्या मॅप झाला.`);
        }
    }

    fs.writeFileSync(PANCHANG_FILE, JSON.stringify(newData, null, 2), 'utf8');
    console.log("पंचांग डेटा अपडेट पूर्ण झाले!");
}

updatePanchang();
