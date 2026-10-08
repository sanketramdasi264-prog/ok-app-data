const fs = require('fs');
const path = require('path');

const PANCHANG_FILE = path.join(__dirname, '../data/panchang.json');

// API Key (FreeAstroAPI)
const API_KEY = "841fcb1c925b06c53058eed60882c15e797be1a30486a080a40c6a09a2f2e65d";

const marathiMapping = {
    tithi: { "Pratipada": "प्रतिपदा", "Dvitiya": "द्वितीया", "Tritiya": "तृतीया", "Chaturthi": "चतुर्थी", "Panchami": "पंचमी", "Shashthi": "षष्ठी", "Saptami": "सप्तमी", "Ashtami": "अष्टमी", "Navami": "नवमी", "Dashami": "दशमी", "Ekadashi": "एकादशी", "Dvadashi": "द्वादशी", "Dwadashi": "द्वादशी", "Trayodashi": "त्रयोदशी", "Chaturdashi": "चतुर्दशी", "Purnima": "पौर्णिमा", "Amavasya": "अमावस्या" },
    paksha: { "Shukla": "शुक्ल", "Krishna": "कृष्ण", "Bright": "शुक्ल", "Dark": "कृष्ण" },
    nakshatra: { "Ashvini": "अश्विनी", "Bharani": "भरणी", "Krittika": "कृत्तिका", "Rohini": "रोहिणी", "Mrigashirsha": "मृगशीर्ष", "Ardra": "आर्द्रा", "Aridra": "आर्द्रा", "Punarvasu": "पुनर्वसू", "Pushya": "पुष्य", "Ashlesha": "आश्लेषा", "Magha": "मघा", "Purva Phalguni": "पूर्वा फाल्गुनी", "Uttara Phalguni": "उत्तरा फाल्गुनी", "Hasta": "हस्त", "Chitra": "चित्रा", "Svati": "स्वाती", "Vishakha": "विशाखा", "Anuradha": "अनुराधा", "Jyeshtha": "ज्येष्ठा", "Mula": "मूळ", "Purva Ashadha": "पूर्वाषाढा", "Uttara Ashadha": "उत्तराषाढा", "Uttarasadha": "उत्तराषाढा", "Shravana": "श्रवण", "Dhanishta": "धनिष्ठा", "Shatabhisha": "शततारका", "Purva Bhadrapada": "पूर्वा भाद्रपदा", "Uttara Bhadrapada": "उत्तरा भाद्रपदा", "Revati": "रेवती" },
    yog: { "Sukarma": "सुकर्मा", "Dhriti": "धृती", "Shula": "शूल", "Ganda": "गंड", "Vriddhi": "वृद्धी", "Dhruva": "ध्रुव", "Vyaghata": "व्याघात", "Harshana": "हर्षण", "Vajra": "वज्र", "Siddhi": "सिद्धी", "Vyatipata": "व्यतीपात", "Variyana": "वरीयान", "Variyan": "वरीयान", "Parigha": "परिघ", "Shiva": "शिव", "Siva": "शिव", "Siddha": "सिद्ध", "Sadhya": "साध्य", "Shubha": "शुभ", "Shukla": "शुक्ल", "Brahma": "ब्रह्म", "Indra": "इंद्र", "Vaidhriti": "वैधृती", "Vishkambha": "विष्कंभ", "Priti": "प्रीती", "Ayushmana": "आयुष्मान", "Saubhagya": "सौभाग्य", "Shobhana": "शोभन", "Atiganda": "अतिगंड" },
    karan: { "Bava": "बव", "Bhav": "बव", "Balava": "बालव", "Kaulava": "कौलव", "Taitila": "तैतिल", "Tetil": "तैतिल", "Gara": "गरज", "Gar": "गरज", "Vanija": "वणिज", "Vanij": "वणिज", "Vishti": "भद्रा", "Shakuni": "शकुनी", "Chatushpada": "चतुष्पाद", "Naga": "नाग", "Kinstughna": "किंस्तुघ्न" },
    rashi: { "Aries": "मेष", "Taurus": "वृषभ", "Gemini": "मिथुन", "Cancer": "कर्क", "Leo": "सिंह", "Virgo": "कन्या", "Libra": "तूळ", "Scorpio": "वृश्चिक", "Sagittarius": "धनु", "Capricorn": "मकर", "Aquarius": "कुंभ", "Pisces": "मीन" },
    weekdays: { "Sunday": "रविवार", "Monday": "सोमवार", "Tuesday": "मंगळवार", "Wednesday": "बुधवार", "Thursday": "गुरुवार", "Friday": "शुक्रवार", "Saturday": "शनिवार" },
    lunarMonth: { "Chaitra": "चैत्र", "Vaishakha": "वैशाख", "Jyeshtha": "ज्येष्ठ", "Ashadha": "आषाढ", "Shravana": "श्रावण", "Bhadrapada": "भाद्रपद", "Bhaadrapada": "भाद्रपद", "Ashvina": "आश्विन", "Ashwin": "आश्विन", "Kartika": "कार्तिक", "Margashirsha": "मार्गशीर्ष", "Pausha": "पौष", "Magha": "माघ", "Phalguna": "फाल्गुन" }
};

const nakshatraArr = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशीर्ष", "आर्द्रा", "पुनर्वसू", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूळ", "पूर्वाषाढा", "उत्तराषाढा", "श्रवण", "धनिष्ठा", "शततारका", "पूर्वा भाद्रपदा", "उत्तरा भाद्रपदा", "रेवती"];
const yogArr = ["विष्कंभ", "प्रीती", "आयुष्मान", "सौभाग्य", "शोभन", "अतिगंड", "सुकर्मा", "धृती", "शूल", "गंड", "वृद्धी", "ध्रुव", "व्याघात", "हर्षण", "वज्र", "सिद्धी", "व्यतीपात", "वरीयान", "परिघ", "शिव", "सिद्ध", "साध्य", "शुभ", "शुक्ल", "ब्रह्म", "इंद्र", "वैधृती"];
const karanArr = ["बव", "बालव", "कौलव", "तैतिल", "गरज", "वणिज", "भद्रा", "शकुनी", "चतुष्पाद", "नाग", "किंस्तुघ्न"];

function getSmartGuruRashi(dateObj) {
    const time = dateObj.getTime();
    if (time < new Date('2026-10-31').getTime()) return "कर्क";
    if (time < new Date('2027-01-25').getTime()) return "सिंह";
    if (time < new Date('2027-06-26').getTime()) return "कर्क";
    if (time < new Date('2027-11-26').getTime()) return "सिंह";
    if (time < new Date('2028-02-28').getTime()) return "कन्या";
    if (time < new Date('2028-07-24').getTime()) return "सिंह";
    if (time < new Date('2028-12-26').getTime()) return "कन्या";
    if (time < new Date('2029-03-29').getTime()) return "तूळ";
    if (time < new Date('2029-08-25').getTime()) return "कन्या";
    return "तूळ"; 
}

function getNextTithi(current, paksha) {
    if (!current) return "";
    let cleanCurrent = current.trim();
    const t = ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी"];
    let idx = t.indexOf(cleanCurrent);
    if (idx !== -1) {
        if (idx === 13) return paksha === "शुक्ल" ? "पौर्णिमा" : "अमावस्या";
        return t[idx + 1];
    }
    if (cleanCurrent === "पौर्णिमा" || cleanCurrent === "अमावस्या") return "प्रतिपदा";
    return "";
}

function getNextItem(current, arr) {
    if (!current) return "";
    let cleanCurrent = current.trim();
    let idx = arr.indexOf(cleanCurrent);
    return (idx !== -1) ? arr[(idx + 1) % arr.length] : "";
}

function translate(category, englishWord) {
    if (!englishWord) return "";
    let cleanWord = englishWord.trim();
    return marathiMapping[category][cleanWord] || cleanWord;
}

function formatTime(timeStr) {
    if (!timeStr) return "";
    const parts = timeStr.split(':');
    if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
    return timeStr;
}

function format24Hour(timeStr) {
    if (!timeStr) return "";
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
        let h = parseInt(parts[0], 10);
        const m = parts[1];
        if (h >= 0 && h <= 7) {
            h = h + 24;
        }
        return `${String(h).padStart(2, '0')}:${m}`;
    }
    return timeStr;
}

function extractVedAstroTime(timeData) {
    if (!timeData) return "";
    if (typeof timeData === 'object' && timeData.StdTime) return timeData.StdTime.split(' ')[0]; 
    if (typeof timeData === 'string') return timeData.split(' ')[0];
    return "";
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchHybridData(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = dateObj.getMonth() + 1;
    const dd = dateObj.getDate();
    
    const ddStr = String(dd).padStart(2, '0');
    const mmStr = String(mm).padStart(2, '0');
    const formattedDate = `${ddStr}-${mmStr}-${yyyy}`;
    
    console.log(`Fetching Hybrid Data for ${formattedDate}...`);

    const payload = { year: yyyy, month: mm, day: dd, hour: 7, minute: 0, second: 0, lat: 19.07609, lng: 72.877426, tz: 5.5 };

    let freeAstroData = null;
    try {
        const response = await fetch("https://api.freeastroapi.com/api/v2/vedic/panchang", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json", "User-Agent": "Mozilla/5.0", "x-api-key": API_KEY },
            body: JSON.stringify(payload)
        });
        if (response.ok) freeAstroData = await response.json();
    } catch (e) { console.error("FreeAstro Error:", e); }

    // API ब्लॉक होऊ नये म्हणून मोठा Delay
    await delay(5000); 

    const vedAstroBaseUrl = `https://api.vedastro.org/api/Calculate`;
    const locTimeStr = `Location/Mumbai/Time/07:00/${ddStr}/${mmStr}/${yyyy}/+05:30`;
    
    let moonRiseData = null, moonSetData = null;
    try {
        const mrRes = await fetch(`${vedAstroBaseUrl}/MoonriseTime/${locTimeStr}`);
        if (mrRes.ok) moonRiseData = (await mrRes.json()).Payload;
        await delay(5000); 

        const msRes = await fetch(`${vedAstroBaseUrl}/MoonsetTime/${locTimeStr}`);
        if (msRes.ok) moonSetData = (await msRes.json()).Payload;
        await delay(5000);
    } catch (e) { console.error("VedAstro Error:", e); }

    if (!freeAstroData) {
        console.log(`Failed to fetch data for ${formattedDate}. API rate limit hit.`);
        return null;
    }

    const karanObj = (freeAstroData.karanas && freeAstroData.karanas.length > 0) ? freeAstroData.karanas[0] : null;

    const currentTithi = translate("tithi", freeAstroData.tithi?.name);
    const currentPaksha = translate("paksha", freeAstroData.tithi?.paksha);
    const currentNakshatra = translate("nakshatra", freeAstroData.nakshatra?.name);
    const currentYog = translate("yog", freeAstroData.yoga?.name);
    const currentKaran = translate("karan", karanObj?.name);

    const fetchedData = {
        "date": formattedDate,
        "weekday": translate("weekdays", freeAstroData.weekday?.name),
        "tithi": currentTithi,
        "tithi_end": formatTime(freeAstroData.tithi?.ends_at),
        "tithi_next": getNextTithi(currentTithi, currentPaksha),
        "paksha": currentPaksha,
        "nakshatra": currentNakshatra,
        "nakshatra_end": formatTime(freeAstroData.nakshatra?.ends_at),
        "nakshatra_next": getNextItem(currentNakshatra, nakshatraArr),
        "yog": currentYog,
        "yog_time": formatTime(freeAstroData.yoga?.ends_at),
        "yog_next": getNextItem(currentYog, yogArr),
        "karan": currentKaran,
        "karan_end": formatTime(karanObj?.ends_at),
        "karan_next": getNextItem(currentKaran, karanArr),
        "moon_rashi": translate("rashi", freeAstroData.request_time_panchang?.moon_sign?.name),
        "sun_rashi": translate("rashi", freeAstroData.request_time_panchang?.sun_sign?.name),
        "guru_rashi": getSmartGuruRashi(dateObj), 
        "lunar_month": translate("lunarMonth", freeAstroData.lunar_month?.name),
        "samvatsar": "पराभव",
        "shaka_samvat": "१९४८",
        "vikram_samvat": "२०८३",
        "ayan": "दक्षिणायन",
        "ritu": "शरद",
        "sunrise": formatTime(freeAstroData.sunrise),
        "sunset": formatTime(freeAstroData.sunset),
        "moonrise": format24Hour(extractVedAstroTime(moonRiseData?.MoonriseTime || moonRiseData)), 
        "moonset": format24Hour(extractVedAstroTime(moonSetData?.MoonsetTime || moonSetData)),
        "rahukaal": `${formatTime(freeAstroData.rahu_kalam?.start)} ते ${formatTime(freeAstroData.rahu_kalam?.end)}`,
        "din_vishesh": "", 
        "location": "Mumbai",
        "is_manual_override": false
    };

    return fetchedData;
}

async function updatePanchang() {
    let existingData = {};
    if (fs.existsSync(PANCHANG_FILE)) existingData = JSON.parse(fs.readFileSync(PANCHANG_FILE, 'utf8'));

    const today = new Date();
    
    const datesToKeep = [];
    for (let i = -15; i <= 15; i++) {
        let d = new Date(today.getTime());
        d.setDate(today.getDate() + i);
        datesToKeep.push(d.toISOString().split('T')[0]);
    }
    
    let newData = {};

    for (const dateKey of datesToKeep) {
        const dateObj = new Date(dateKey);
        if (existingData[dateKey] && existingData[dateKey].is_manual_override) {
            newData[dateKey] = existingData[dateKey];
        } else {
            const apiResult = await fetchHybridData(dateObj);
            if (apiResult) {
                newData[dateKey] = { ...existingData[dateKey], ...apiResult, is_manual_override: false };
            } else if (existingData[dateKey]) {
                newData[dateKey] = existingData[dateKey];
            }
        }
    }

    fs.writeFileSync(PANCHANG_FILE, JSON.stringify(newData, null, 2), 'utf8');
    console.log("३१ दिवसांचा पंचांग डेटा (१५ मागचे, १५ पुढचे) अपडेट पूर्ण झाला!");
}

updatePanchang();
