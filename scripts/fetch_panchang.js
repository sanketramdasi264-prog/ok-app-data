const fs = require('fs');
const path = require('path');

const PANCHANG_FILE = path.join(__dirname, '../data/panchang.json');

// API Key (FreeAstroAPI)
const API_KEY = "841fcb1c925b06c53058eed60882c15e797be1a30486a080a40c6a09a2f2e65d";

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
        "Bava": "बव", "Balava": "बालव", "Kaulava": "कौलव", "Taitila": "तैतिल", "Tetil": "तैतिल", 
        "Gara": "गरज", "Gar": "गरज", "Vanija": "वणिज", "Vishti": "भद्रा", "Shakuni": "शकुनी", 
        "Chatushpada": "चतुष्पाद", "Naga": "नाग", "Kinstughna": "किंस्तुघ्न"
    },
    rashi: {
        "Aries": "मेष", "Taurus": "वृषभ", "Gemini": "मिथुन", "Cancer": "कर्क",
        "Leo": "सिंह", "Virgo": "कन्या", "Libra": "तूळ", "Scorpio": "वृश्चिक",
        "Sagittarius": "धनु", "Capricorn": "मकर", "Aquarius": "कुंभ", "Pisces": "मीन"
    },
    weekdays: {
        "Sunday": "रविवार", "Monday": "सोमवार", "Tuesday": "मंगळवार", "Wednesday": "बुधवार",
        "Thursday": "गुरुवार", "Friday": "शुक्रवार", "Saturday": "शनिवार"
    },
    lunarMonth: {
        "Chaitra": "चैत्र", "Vaishakha": "वैशाख", "Jyeshtha": "ज्येष्ठ", "Ashadha": "आषाढ",
        "Shravana": "श्रावण", "Bhadrapada": "भाद्रपद", "Bhaadrapada": "भाद्रपद", 
        "Ashvina": "आश्विन", "Ashwin": "आश्विन", "Kartika": "कार्तिक", "Margashirsha": "मार्गशीर्ष", 
        "Pausha": "पौष", "Magha": "माघ", "Phalguna": "फाल्गुन"
    }
};

function translate(category, englishWord) {
    if (!englishWord) return "";
    return marathiMapping[category][englishWord] || englishWord;
}

function formatTime(timeStr) {
    if (!timeStr) return "";
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
}

function extractVedAstroTime(timeData) {
    if (!timeData) return "";
    if (typeof timeData === 'object' && timeData.StdTime) {
        return timeData.StdTime.split(' ')[0]; 
    }
    if (typeof timeData === 'string') {
        return timeData.split(' ')[0];
    }
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
    
    console.log(`Fetching Hybrid Data (FreeAstro + VedAstro) for ${formattedDate}...`);

    // **हाच तो महत्त्वाचा बदल: Payload मधील स्पेलिंग दुरुस्त केली आहेत**
    const payload = {
        year: yyyy, 
        month: mm, 
        day: dd, 
        hour: 7, 
        minute: 0, 
        second: 0,
        lat: 19.07609, 
        lon: 72.877426, 
        tz: 5.5
    };

    let freeAstroData = null;
    try {
        const response = await fetch("https://api.freeastroapi.com/api/v2/vedic/panchang", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
                "x-api-key": API_KEY 
            },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            freeAstroData = await response.json();
            console.log("FreeAstro Data fetched successfully.");
        } else {
            const errorText = await response.text();
            console.error(`FreeAstro Error: Status ${response.status} - ${errorText}`);
        }
    } catch (e) {
        console.error("FreeAstro Fetch Exception:", e);
    }

    await delay(2000);

    const vedAstroBaseUrl = `https://api.vedastro.org/api/Calculate`;
    const locTimeStr = `Location/Mumbai/Time/07:00/${ddStr}/${mmStr}/${yyyy}/+05:30`;
    
    let moonRiseData = null;
    let moonSetData = null;

    try {
        const mrRes = await fetch(`${vedAstroBaseUrl}/MoonriseTime/${locTimeStr}`);
        if (mrRes.ok) {
            const mrJson = await mrRes.json();
            moonRiseData = mrJson.Status === "Pass" ? mrJson.Payload : null;
        }
        console.log("Moonrise fetched from VedAstro. Waiting 15 seconds...");
        await delay(15000); 

        const msRes = await fetch(`${vedAstroBaseUrl}/MoonsetTime/${locTimeStr}`);
        if (msRes.ok) {
            const msJson = await msRes.json();
            moonSetData = msJson.Status === "Pass" ? msJson.Payload : null;
        }
        console.log("Moonset fetched from VedAstro. Waiting 15 seconds...");
        await delay(15000);
    } catch (e) {
        console.error("VedAstro Fetch Error:", e);
    }

    if (!freeAstroData) {
        console.log(`Failed to fetch main data for ${formattedDate}. Check FreeAstro Error above.`);
        return null;
    }

    const karanObj = (freeAstroData.karanas && freeAstroData.karanas.length > 0) ? freeAstroData.karanas[0] : null;

    const fetchedData = {
        "date": formattedDate,
        "weekday": translate("weekdays", freeAstroData.weekday?.name),
        "tithi": translate("tithi", freeAstroData.tithi?.name),
        "tithi_end": formatTime(freeAstroData.tithi?.ends_at),
        "paksha": translate("paksha", freeAstroData.tithi?.paksha),
        "nakshatra": translate("nakshatra", freeAstroData.nakshatra?.name),
        "nakshatra_end": formatTime(freeAstroData.nakshatra?.ends_at),
        "yog": translate("yog", freeAstroData.yoga?.name),
        "yog_time": formatTime(freeAstroData.yoga?.ends_at),
        "karan": translate("karan", karanObj?.name),
        "karan_end": formatTime(karanObj?.ends_at),
        "moon_rashi": translate("rashi", freeAstroData.request_time_panchang?.moon_sign?.name),
        "sun_rashi": translate("rashi", freeAstroData.request_time_panchang?.sun_sign?.name),
        "lunar_month": translate("lunarMonth", freeAstroData.lunar_month?.name),
        "sunrise": formatTime(freeAstroData.sunrise),
        "sunset": formatTime(freeAstroData.sunset),
        "moonrise": extractVedAstroTime(moonRiseData?.MoonriseTime || moonRiseData), 
        "moonset": extractVedAstroTime(moonSetData?.MoonsetTime || moonSetData),
        "rahukaal": `${formatTime(freeAstroData.rahu_kalam?.start)} ते ${formatTime(freeAstroData.rahu_kalam?.end)}`,
        "din_vishesh": "", 
        "location": "Mumbai",
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
            const apiResult = await fetchHybridData(dateObj);
            if (apiResult) {
                newData[dateKey] = { ...existingData[dateKey], ...apiResult, is_manual_override: false };
                console.log(`${dateKey} चा हायब्रिड डेटा यशस्वीरित्या मॅप झाला.`);
            }
        }
    }

    fs.writeFileSync(PANCHANG_FILE, JSON.stringify(newData, null, 2), 'utf8');
    console.log("पंचांग डेटा अपडेट पूर्ण झाले!");
}

updatePanchang();
