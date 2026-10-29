const fs = require('fs');
const path = require('path');

const PANCHANG_FILE = path.join(__dirname, '../data/panchang.json');
const API_KEY = "841fcb1c925b06c53058eed60882c15e797be1a30486a080a40c6a09a2f2e65d";

// --- Dinvishesh Data (Merged with Sankashti, Ekadashi, Pradosh, Shivaratri, Chaturmas 2026 & Eclipses) ---
const dinvisheshData = {
    "01-01-2026": "पुत्रदा एकादशी, प्रदोष व्रत",
    "03-01-2026": "पौष पौर्णिमा",
    "06-01-2026": "अंगारकी संकष्टी चतुर्थी / सकट चौथ",
    "14-01-2026": "मकर संक्रांत, षट्तिला एकादशी",
    "16-01-2026": "प्रदोष व्रत, पौष मासिक शिवरात्री",
    "18-01-2026": "मौनी अमावस्या",
    "23-01-2026": "वसंत पंचमी / श्रीपंचमी",
    "25-01-2026": "रथसप्तमी",
    "26-01-2026": "भीष्म अष्टमी",
    "30-01-2026": "जया एकादशी, प्रदोष व्रत",
    "01-02-2026": "माघ पौर्णिमा",
    "05-02-2026": "संकष्टी चतुर्थी",
    "13-02-2026": "विजया एकादशी, कुंभ संक्रांत",
    "14-02-2026": "शनि प्रदोष व्रत",
    "15-02-2026": "महाशिवरात्री / माघ शिवरात्री",
    "28-02-2026": "प्रदोष व्रत",
    "01-03-2026": "आमलकी एकादशी",
    "02-03-2026": "होलिका दहन / छोटी होळी",
    "03-03-2026": "धुळवड / होळी, खग्रास चंद्रग्रहण (भारतात अंशतः दृश्य)",
    "06-03-2026": "संकष्टी चतुर्थी",
    "11-03-2026": "शीतळा अष्टमी / बसोडा",
    "14-03-2026": "पापमोचिनी एकादशी",
    "15-03-2026": "प्रदोष व्रत, मीन संक्रांत",
    "17-03-2026": "फाल्गुन मासिक शिवरात्री",
    "19-03-2026": "गुढीपाडवा / हिंदू नववर्ष, उगादी, चैत्र नवरात्रारंभ",
    "21-03-2026": "गौरी तृतीया / गणगौर",
    "26-03-2026": "श्रीराम नवमी (स्मार्त)",
    "27-03-2026": "श्रीराम नवमी (काही परंपरा)",
    "29-03-2026": "प्रदोष व्रत",
    "30-03-2026": "कामदा एकादशी",
    "02-04-2026": "हनुमान जयंती, चैत्र पौर्णिमा",
    "05-04-2026": "संकष्टी चतुर्थी",
    "13-04-2026": "वरुथिनी एकादशी",
    "14-04-2026": "मेष संक्रांत / सौर नववर्ष, प्रदोष व्रत",
    "15-04-2026": "चैत्र मासिक शिवरात्री",
    "19-04-2026": "अक्षय तृतीया, परशुराम जयंती",
    "23-04-2026": "गंगा सप्तमी",
    "25-04-2026": "सीता नवमी",
    "28-04-2026": "प्रदोष व्रत",
    "29-04-2026": "मोहिनी एकादशी",
    "01-05-2026": "वैशाख पौर्णिमा / बुद्ध पौर्णिमा",
    "02-05-2026": "नारद जयंती",
    "05-05-2026": "अंगारकी संकष्टी चतुर्थी",
    "12-05-2026": "अपरा एकादशी",
    "13-05-2026": "प्रदोष व्रत",
    "15-05-2026": "वृषभ संक्रांत, वैशाख मासिक शिवरात्री",
    "16-05-2026": "वट सावित्री व्रत, शनि जयंती",
    "25-05-2026": "गंगा दशहरा",
    "28-05-2026": "निर्जला एकादशी, प्रदोष व्रत",
    "31-05-2026": "ज्येष्ठ अधिक पौर्णिमा",
    "03-06-2026": "संकष्टी चतुर्थी",
    "11-06-2026": "परमा एकादशी, योगिनी एकादशी",
    "12-06-2026": "प्रदोष व्रत",
    "13-06-2026": "ज्येष्ठ (अधिक) मासिक शिवरात्री",
    "15-06-2026": "मिथुन संक्रांत",
    "25-06-2026": "निर्जला एकादशी",
    "26-06-2026": "देवशयनी / आषाढी एकादशी, प्रदोष व्रत",
    "29-06-2026": "वटपौर्णिमा",
    "03-07-2026": "संकष्टी चतुर्थी",
    "10-07-2026": "कामिका एकादशी, योगिनी एकादशी",
    "12-07-2026": "प्रदोष व्रत, आषाढ मासिक शिवरात्री",
    "16-07-2026": "जगन्नाथ रथयात्रा, कर्क संक्रांत",
    "25-07-2026": "देवशयनी एकादशी, पुत्रदा एकादशी, चातुर्मास प्रारंभ",
    "26-07-2026": "प्रदोष व्रत",
    "29-07-2026": "गुरुपौर्णिमा",
    "02-08-2026": "संकष्टी चतुर्थी",
    "09-08-2026": "कामिका एकादशी, अजा एकादशी",
    "10-08-2026": "सोम प्रदोष व्रत",
    "11-08-2026": "श्रावण मासिक शिवरात्री",
    "15-08-2026": "हरियाली तीज",
    "17-08-2026": "नागपंचमी, सिंह संक्रांत",
    "23-08-2026": "श्रावण पुत्रदा एकादशी",
    "24-08-2026": "परिवर्तिनी एकादशी",
    "25-08-2026": "प्रदोष व्रत",
    "26-08-2026": "ओणम",
    "28-08-2026": "वरलक्ष्मी व्रत, रक्षाबंधन / नारळी पौर्णिमा, गायत्री जयंती",
    "31-08-2026": "कजरी तीज, संकष्टी चतुर्थी",
    "04-09-2026": "श्रीकृष्ण जन्माष्टमी",
    "07-09-2026": "अजा एकादशी, इंदिरा एकादशी",
    "08-09-2026": "प्रदोष व्रत",
    "09-09-2026": "भाद्रपद मासिक शिवरात्री",
    "14-09-2026": "हरतालिका तृतीया, श्री गणेश चतुर्थी",
    "15-09-2026": "ऋषिपंचमी",
    "16-09-2026": "बलराम जयंती",
    "17-09-2026": "विश्वकर्मा पूजा",
    "19-09-2026": "राधाष्टमी",
    "22-09-2026": "पार्श्व एकादशी, पापांकुशा एकादशी",
    "23-09-2026": "प्रदोष व्रत",
    "25-09-2026": "अनंत चतुर्दशी / गणेश विसर्जन",
    "26-09-2026": "भाद्रपद पौर्णिमा",
    "27-09-2026": "पितृपक्षारंभ",
    "29-09-2026": "अंगारकी संकष्टी चतुर्थी",
    "06-10-2026": "इंदिरा एकादशी",
    "07-10-2026": "रमा एकादशी",
    "08-10-2026": "आश्विन मासिक शिवरात्री",
    "09-10-2026": "प्रदोष व्रत",
    "10-10-2026": "सर्वपित्री अमावस्या",
    "11-10-2026": "शारदीय नवरात्रारंभ",
    "16-10-2026": "सरस्वती आवाहन",
    "17-10-2026": "सरस्वती पूजन",
    "19-10-2026": "दुर्गाष्टमी / महाष्टमी, महानवमी",
    "20-10-2026": "विजयादशमी / दसरा",
    "21-10-2026": "प्रबोधिनी / कार्तिकी एकादशी",
    "22-10-2026": "पापांकुशा एकादशी",
    "23-10-2026": "प्रदोष व्रत",
    "25-10-2026": "कोजागरी पौर्णिमा / शरद पौर्णिमा",
    "29-10-2026": "वक्रतुंड संकष्टी चतुर्थी, करवा चौथ",
    "01-11-2026": "अहोई अष्टमी",
    "05-11-2026": "रमा एकादशी, गोवत्स द्वादशी, उत्पन्ना एकादशी",
    "06-11-2026": "धनत्रयोदशी / धनतेरस, प्रदोष व्रत",
    "07-11-2026": "नरक चतुर्दशी / काली चौदस, कार्तिक मासिक शिवरात्री",
    "08-11-2026": "लक्ष्मीपूजन / दिवाळी अमावस्या",
    "09-11-2026": "बलिप्रतिपदा / पाडवा / गोवर्धन पूजा",
    "11-11-2026": "भाऊबीज",
    "15-11-2026": "छठ पूजा",
    "16-11-2026": "वृश्चिक संक्रांत",
    "20-11-2026": "देवउठनी / प्रबोधिनी एकादशी, मोक्षदा एकादशी, चातुर्मास समाप्ती",
    "21-11-2026": "तुळशी विवाह",
    "22-11-2026": "प्रदोष व्रत",
    "24-11-2026": "कार्तिक पौर्णिमा / त्रिपुरारी पौर्णिमा",
    "27-11-2026": "संकष्टी चतुर्थी",
    "01-12-2026": "कालभैरव जयंती",
    "04-12-2026": "उत्पन्ना एकादशी",
    "05-12-2026": "सफला एकादशी",
    "06-12-2026": "प्रदोष व्रत",
    "07-12-2026": "मार्गशीर्ष मासिक शिवरात्री",
    "14-12-2026": "विवाह पंचमी",
    "16-12-2026": "धनु संक्रांत",
    "20-12-2026": "मोक्षदा एकादशी / गीता जयंती, पुत्रदा एकादशी",
    "21-12-2026": "सोम प्रदोष व्रत",
    "23-12-2026": "दत्त जयंती / मार्गशीर्ष पौर्णिमा",
    "26-12-2026": "अखुरथ संकष्टी चतुर्थी",
    
    // --- 2027 Eclipses ---
    "02-08-2027": "खग्रास सूर्यग्रहण (भारतात अंशतः दृश्य)"
};

const marathiMapping = {
    tithi: { "Pratipada": "प्रतिपदा", "Dvitiya": "द्वितीया", "Tritiya": "तृतीया", "Chaturthi": "चतुर्थी", "Panchami": "पंचमी", "Shashthi": "षष्ठी", "Shashti": "षष्ठी", "Saptami": "सप्तमी", "Ashtami": "अष्टमी", "Navami": "नवमी", "Dashami": "दशमी", "Ekadashi": "एकादशी", "Dvadashi": "द्वादशी", "Dwadashi": "द्वादशी", "Trayodashi": "त्रयोदशी", "Chaturdashi": "चतुर्दशी", "Purnima": "पौर्णिमा", "Poornima": "पौर्णिमा", "Amavasya": "अमावस्या" },
    paksha: { "Shukla": "शुक्ल", "Krishna": "कृष्ण", "Bright": "शुक्ल", "Dark": "कृष्ण" },
    nakshatra: { "Ashvini": "अश्विनी", "Ashwini": "अश्विनी", "Bharani": "भरणी", "Krittika": "कृत्तिका", "Rohini": "रोहिणी", "Mrigashirsha": "मृगशीर्ष", "Ardra": "आर्द्रा", "Aridra": "आर्द्रा", "Punarvasu": "पुनर्वसू", "Pushya": "पुष्य", "Ashlesha": "आश्लेषा", "Magha": "मघा", "Purva Phalguni": "पूर्वा फाल्गुनी", "Poorva Phalguni": "पूर्वा फाल्गुनी", "Uttara Phalguni": "उत्तरा फाल्गुनी", "Hasta": "हस्त", "Chitra": "चित्रा", "Svati": "स्वाती", "Swati": "स्वाती", "Vishakha": "विशाखा", "Anuradha": "अनुराधा", "Jyeshtha": "ज्येष्ठा", "Jyeshta": "ज्येष्ठा", "Mula": "मूळ", "Moola": "मूळ", "Purva Ashadha": "पूर्वाषाढा", "Poorva Ashadha": "पूर्वाषाढा", "Uttara Ashadha": "उत्तराषाढा", "Uttarasadha": "उत्तराषाढा", "Shravana": "श्रवण", "Dhanishta": "धनिष्ठा", "Shatabhisha": "शततारका", "Satabisha": "शततारका", "Purva Bhadrapada": "पूर्वा भाद्रपदा", "Poorva Bhadrapada": "पूर्वा भाद्रपदा", "Uttara Bhadrapada": "उत्तरा भाद्रपदा", "Revati": "रेवती" },
    yog: { "Sukarma": "सुकर्मा", "Dhriti": "धृती", "Shula": "शूल", "Soola": "शूल", "Ganda": "गंड", "Vriddhi": "वृद्धी", "Vriddha": "वृद्धी", "Dhruva": "ध्रुव", "Vyaghata": "व्याघात", "Harshana": "हर्षण", "Vajra": "वज्र", "Siddhi": "सिद्धी", "Vyatipata": "व्यतीपात", "Variyana": "वरीयान", "Variyan": "वरीयान", "Parigha": "परिघ", "Shiva": "शिव", "Siva": "शिव", "Siddha": "सिद्ध", "Sadhya": "साध्य", "Shubha": "शुभ", "Subha": "शुभ", "Shukla": "शुक्ल", "Brahma": "ब्रह्म", "Indra": "इंद्र", "Vaidhriti": "वैधृती", "Vishkambha": "विष्कंभ", "Priti": "प्रीती", "Ayushmana": "आयुष्मान", "Saubhagya": "सौभाग्य", "Shobhana": "शोभन", "Atiganda": "अतिगंड" },
    karan: { "Bava": "बव", "Bhav": "बव", "Balava": "बालव", "Baalav": "बालव", "Kaulava": "कौलव", "Kolav": "कौलव", "Taitila": "तैतिल", "Tetil": "तैतिल", "Gara": "गरज", "Gar": "गरज", "Vanija": "वणिज", "Vanij": "वणिज", "Vishti": "भद्रा", "Shakuni": "शकुनी", "Chatushpada": "चतुष्पाद", "Naga": "नाग", "Kinstughna": "किंस्तुघ्न", "Kintudhhana": "किंस्तुघ्न" },
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
    return "तूळ";
}

function translate(category, word) {
    if (!word) return "";
    let clean = String(word).trim();
    return marathiMapping[category][clean] || clean;
}

function getNextTithi(current, paksha) {
    if (!current) return "";
    let clean = current.trim();
    const t = ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी"];
    let idx = t.indexOf(clean);
    if (idx !== -1) {
        if (idx === 13) return paksha === "शुक्ल" ? "पौर्णिमा" : "अमावस्या";
        return t[idx + 1];
    }
    if (clean === "पौर्णिमा" || clean === "अमावस्या") return "प्रतिपदा";
    return "";
}

function getNextItem(current, arr) {
    if (!current) return "";
    let clean = current.trim();
    let idx = arr.indexOf(clean);
    return (idx !== -1) ? arr[(idx + 1) % arr.length] : "";
}

function formatTime(timeStr) {
    if (!timeStr) return "";
    const parts = timeStr.split(':');
    if (parts.length >= 2) return `${parts[0].padStart(2, '0')}:${parts[1]}`;
    return timeStr;
}

function parseVedAstroMoonrise(reqDateStr, vedAstroTimeStr) {
    if (!vedAstroTimeStr) return "";
    const parts = String(vedAstroTimeStr).trim().split(' ');
    if (parts.length < 2) return "";
    const timePart = parts[0]; 
    const datePart = parts[1]; 
    let [h, m] = timePart.split(':').map(Number);
    if (datePart !== reqDateStr) {
        h += 24;
    }
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// --- Minus 7 Minutes Logic for Date Panchang Alignment ---
function subtractMinutes(timeStr, minsToSubtract) {
    if (!timeStr) return "";
    let prefix = "";
    if (timeStr.startsWith("पु. दि ")) {
        prefix = "पु. दि ";
        timeStr = timeStr.replace("पु. दि ", "");
    }
    
    let [h, m] = timeStr.split(':').map(Number);
    let totalMins = (h * 60) + m;
    totalMins -= minsToSubtract;
    
    if (totalMins < 0) totalMins += (24 * 60);
    
    let newH = Math.floor(totalMins / 60);
    let newM = totalMins % 60;
    
    return prefix + `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchRawData(dateObj) {
    const yyyy = dateObj.getUTCFullYear();
    const mm = dateObj.getUTCMonth() + 1;
    const dd = dateObj.getUTCDate();
    const ddStr = String(dd).padStart(2, '0');
    const mmStr = String(mm).padStart(2, '0');
    const formattedDate = `${ddStr}-${mmStr}-${yyyy}`;
    const reqDateStr = `${ddStr}/${mmStr}/${yyyy}`; 

    let freeAstro = null;
    let sunriseTime = "06:30"; 
    
    try {
        const faPayload = { year: yyyy, month: mm, day: dd, hour: 7, minute: 0, second: 0, lat: 19.07609, lng: 72.877426, tz: 5.5 };
        const res = await fetch("https://api.freeastroapi.com/api/v2/vedic/panchang", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json", "x-api-key": API_KEY },
            body: JSON.stringify(faPayload)
        });
        if (res.ok) {
            freeAstro = await res.json();
            if(freeAstro && freeAstro.sunrise) {
                sunriseTime = formatTime(freeAstro.sunrise);
            }
        }
    } catch (e) { console.error("FreeAstro Error:", e.message); }

    await delay(1500);

    const vedAstroPayload = {
        "Time": {
            "StdTime": `${sunriseTime} ${reqDateStr} +05:30`,
            "Location": { "Name": "Mumbai", "Latitude": 18.969, "Longitude": 72.821 }
        },
        "Ayanamsa": "RAMAN"
    };

    let finalMoonrise = "";
    try {
        const mrRes = await fetch("https://vedastro.zaishi.net/api/Calculate/MoonriseTime", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vedAstroPayload)
        });
        if (mrRes.ok) {
            const mrJson = await mrRes.json();
            if (mrJson.Status === "Pass" && mrJson.Payload && mrJson.Payload.MoonriseTime) {
                finalMoonrise = parseVedAstroMoonrise(reqDateStr, mrJson.Payload.MoonriseTime.StdTime);
            }
        }
    } catch (e) { console.error("VedAstro Error:", e.message); }

    return { formattedDate, freeAstro, finalMoonrise };
}

async function updatePanchang() {
    let existingData = {};
    if (fs.existsSync(PANCHANG_FILE)) existingData = JSON.parse(fs.readFileSync(PANCHANG_FILE, 'utf8'));

    const now = new Date();
    const today = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    
    const offsets = [-1, 0, 1];
    let finalData = {};

    for (const offset of offsets) {
        let d = new Date(today.getTime());
        d.setUTCDate(today.getUTCDate() + offset);
        const currentKey = d.toISOString().split('T')[0];
        
        const fetchDateObj = new Date(currentKey + "T12:00:00Z"); 
        
        console.log(`Data fetch hot ahe: ${currentKey}...`);
        const cur = await fetchRawData(fetchDateObj);
        await delay(1500);

        if (!cur || !cur.freeAstro) {
            if (existingData[currentKey]) finalData[currentKey] = existingData[currentKey];
            continue;
        }

        const fa = cur.freeAstro;
        const karanObj = (fa.karanas && fa.karanas.length > 0) ? fa.karanas[0] : null;

        let currentTithi = translate("tithi", fa.tithi?.name);
        
        let rawFinalMoonrise = "";
        if (cur.finalMoonrise && fa.sunrise) {
            let [ch, cm] = cur.finalMoonrise.split(':').map(Number);
            let [sh, sm] = formatTime(fa.sunrise).split(':').map(Number);
            
            let isCurBeforeSunrise = (ch < sh) || (ch === sh && cm < sm);
            
            if (currentTithi === "अमावस्या") {
                let nextDayObj = new Date(fetchDateObj.getTime());
                nextDayObj.setUTCDate(nextDayObj.getUTCDate() + 1);
                const nxt = await fetchRawData(nextDayObj);
                if (nxt && nxt.finalMoonrise) {
                    let [nh, nm] = nxt.finalMoonrise.split(':').map(Number);
                    if (nh >= 24) nh -= 24; 
                    rawFinalMoonrise = `पु. दि ${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
                }
            } else if (isCurBeforeSunrise) {
                let nextDayObj = new Date(fetchDateObj.getTime());
                nextDayObj.setUTCDate(nextDayObj.getUTCDate() + 1);
                const nxt = await fetchRawData(nextDayObj);
                if (nxt && nxt.finalMoonrise) {
                    let [nh, nm] = nxt.finalMoonrise.split(':').map(Number);
                    if (nh < 24) nh += 24;
                    rawFinalMoonrise = `${nh}:${String(nm).padStart(2, '0')}`;
                }
            } else {
                rawFinalMoonrise = cur.finalMoonrise;
            }
        }

        // Apply -7 minutes adjustment
        let adjustedMoonrise = subtractMinutes(rawFinalMoonrise, 7);

        finalData[currentKey] = {
            "date": cur.formattedDate,
            "weekday": translate("weekdays", fa.weekday?.name),
            "tithi": currentTithi,
            "tithi_end": formatTime(fa.tithi?.ends_at),
            "tithi_next": getNextTithi(currentTithi, translate("paksha", fa.tithi?.paksha)),
            "paksha": translate("paksha", fa.tithi?.paksha),
            "nakshatra": translate("nakshatra", fa.nakshatra?.name),
            "nakshatra_end": formatTime(fa.nakshatra?.ends_at),
            "nakshatra_next": getNextItem(translate("nakshatra", fa.nakshatra?.name), nakshatraArr),
            "yog": translate("yog", fa.yoga?.name),
            "yog_time": formatTime(fa.yoga?.ends_at),
            "yog_next": getNextItem(translate("yog", fa.yoga?.name), yogArr),
            "karan": translate("karan", karanObj?.name),
            "karan_end": formatTime(karanObj?.ends_at),
            "karan_next": getNextItem(translate("karan", karanObj?.name), karanArr),
            "moon_rashi": translate("rashi", fa.request_time_panchang?.moon_sign?.name),
            "sun_rashi": translate("rashi", fa.request_time_panchang?.sun_sign?.name),
            "guru_rashi": getSmartGuruRashi(fetchDateObj),
            "lunar_month": translate("lunarMonth", fa.lunar_month?.name),
            "samvatsar": "पराभव",
            "shaka_samvat": "१९४८",
            "vikram_samvat": "२०८३",
            "ayan": "दक्षिणायन",
            "ritu": "शरद",
            "sunrise": formatTime(fa.sunrise) || "06:30",
            "sunset": formatTime(fa.sunset) || "18:20",
            "moonrise": adjustedMoonrise,
            "moonset": "", 
            "rahukaal": `${formatTime(fa.rahu_kalam?.start)} ते ${formatTime(fa.rahu_kalam?.end)}`,
            "din_vishesh": dinvisheshData[cur.formattedDate] || "",
            "location": "Mumbai",
            "is_manual_override": false
        };
    }

    fs.writeFileSync(PANCHANG_FILE, JSON.stringify(finalData, null, 2), 'utf8');
    console.log("- 7 मिनिटे आणि संपूर्ण दिनविशेषासह पंचांग अपडेट झाले!");
}

updatePanchang();
