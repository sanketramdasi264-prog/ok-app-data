const fs = require('fs');
const path = require('path');

const PANCHANG_FILE = path.join(__dirname, '../data/panchang.json');
const API_KEY = "708f7cac2f34f1bd4c8f9c7553178716a6f8334631816dbcf260dc303f8aee97";

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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchRawData(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = dateObj.getMonth() + 1;
    const dd = dateObj.getDate();
    
    const ddStr = String(dd).padStart(2, '0');
    const mmStr = String(mm).padStart(2, '0');
    const formattedDate = `${ddStr}-${mmStr}-${yyyy}`;
    
    const payload = { year: yyyy, month: mm, day: dd, hour: 7, minute: 0, second: 0, lat: 19.07609, lng: 72.877426, tz: 5.5 };

    let fa = null;
    try {
        const res = await fetch("https://api.freeastroapi.com/api/v2/vedic/panchang", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json", "x-api-key": API_KEY },
            body: JSON.stringify(payload)
        });
        if (res.ok) fa = await res.json();
    } catch (e) { console.error("API Error:", e); }

    return { formattedDate, freeAstro: fa };
}

async function updatePanchang() {
    let existingData = {};
    if (fs.existsSync(PANCHANG_FILE)) existingData = JSON.parse(fs.readFileSync(PANCHANG_FILE, 'utf8'));

    const today = new Date();
    // +4 दिवसाचा डेटा सुद्धा मागवतोय कारण उद्याची वेळ जर पहाटेची असेल तर ती आजच्या पंचांगात जोडायची आहे.
    const fetchOffsets = [-3, -2, -1, 0, 1, 2, 3, 4]; 
    
    const allData = {};
    for (const offset of fetchOffsets) {
        let d = new Date(today);
        d.setDate(today.getDate() + offset);
        const k = d.toISOString().split('T')[0];
        console.log(`Fetching Data for ${k}...`);
        allData[k] = await fetchRawData(d);
        await delay(1000); 
    }

    let finalJson = {};

    // लूप फक्त ७ दिवसांसाठी (७ तारखेसाठी ८ तारखेचा डेटा वापरला जाईल)
    for (let i = 0; i < 7; i++) {
        let offset = fetchOffsets[i];
        let d = new Date(today);
        d.setDate(today.getDate() + offset);
        let currentKey = d.toISOString().split('T')[0];
        
        let nextD = new Date(today);
        nextD.setDate(today.getDate() + offset + 1);
        let nextKey = nextD.toISOString().split('T')[0];

        let cur = allData[currentKey];
        let nxt = allData[nextKey];

        if (!cur || !cur.freeAstro) {
            if (existingData[currentKey]) finalJson[currentKey] = existingData[currentKey];
            continue;
        }

        const fa = cur.freeAstro;
        const fa_nxt = nxt ? nxt.freeAstro : null;
        
        const karanObj = (fa.karanas && fa.karanas.length > 0) ? fa.karanas[0] : null;

        const currentTithi = translate("tithi", fa.tithi?.name);
        const currentPaksha = translate("paksha", fa.tithi?.paksha);
        const currentNakshatra = translate("nakshatra", fa.nakshatra?.name);
        const currentYog = translate("yog", fa.yoga?.name);
        const currentKaran = translate("karan", karanObj?.name);

        // --- Shift Logic for Moonrise ---
        let finalMoonrise = "";
        let cur_mr = formatTime(fa.moonrise);
        if (cur_mr) {
            let [h, m] = cur_mr.split(':').map(Number);
            if (h < 7) {
                // आजची वेळ पहाटेची आहे, म्हणजे ती कालची आहे. आजची खरी वेळ 'उद्याच्या' डेटामध्ये असेल.
                if (fa_nxt && fa_nxt.moonrise) {
                    let [nh, nm] = formatTime(fa_nxt.moonrise).split(':').map(Number);
                    finalMoonrise = nh < 7 ? `${nh + 24}:${String(nm).padStart(2, '0')}` : formatTime(fa_nxt.moonrise);
                }
            } else {
                finalMoonrise = cur_mr;
            }
        } else if (fa_nxt && fa_nxt.moonrise) {
            // जर आज चंद्रोदय नसेल (अमावास्या/पौर्णिमा), तर उद्याची वेळ बघा
            let [nh, nm] = formatTime(fa_nxt.moonrise).split(':').map(Number);
            if (nh < 7) finalMoonrise = `${nh + 24}:${String(nm).padStart(2, '0')}`;
        }

        // --- Shift Logic for Moonset ---
        let finalMoonset = "";
        let cur_ms = formatTime(fa.moonset);
        if (cur_ms) {
            let [h, m] = cur_ms.split(':').map(Number);
            if (h < 7) {
                if (fa_nxt && fa_nxt.moonset) {
                    let [nh, nm] = formatTime(fa_nxt.moonset).split(':').map(Number);
                    finalMoonset = nh < 7 ? `${nh + 24}:${String(nm).padStart(2, '0')}` : formatTime(fa_nxt.moonset);
                }
            } else {
                finalMoonset = cur_ms;
            }
        } else if (fa_nxt && fa_nxt.moonset) {
            let [nh, nm] = formatTime(fa_nxt.moonset).split(':').map(Number);
            if (nh < 7) finalMoonset = `${nh + 24}:${String(nm).padStart(2, '0')}`;
        }

        finalJson[currentKey] = {
            "date": cur.formattedDate,
            "weekday": translate("weekdays", fa.weekday?.name),
            "tithi": currentTithi,
            "tithi_end": formatTime(fa.tithi?.ends_at),
            "tithi_next": getNextTithi(currentTithi, currentPaksha),
            "paksha": currentPaksha,
            "nakshatra": currentNakshatra,
            "nakshatra_end": formatTime(fa.nakshatra?.ends_at),
            "nakshatra_next": getNextItem(currentNakshatra, nakshatraArr),
            "yog": currentYog,
            "yog_time": formatTime(fa.yoga?.ends_at),
            "yog_next": getNextItem(currentYog, yogArr),
            "karan": currentKaran,
            "karan_end": formatTime(karanObj?.ends_at),
            "karan_next": getNextItem(currentKaran, karanArr),
            "moon_rashi": translate("rashi", fa.request_time_panchang?.moon_sign?.name),
            "sun_rashi": translate("rashi", fa.request_time_panchang?.sun_sign?.name),
            "guru_rashi": getSmartGuruRashi(d),
            "lunar_month": translate("lunarMonth", fa.lunar_month?.name),
            "samvatsar": "पराभव",
            "shaka_samvat": "१९४८",
            "vikram_samvat": "२०८३",
            "ayan": "दक्षिणायन",
            "ritu": "शरद",
            "sunrise": formatTime(fa.sunrise),
            "sunset": formatTime(fa.sunset),
            "moonrise": finalMoonrise,
            "moonset": finalMoonset,
            "rahukaal": `${formatTime(fa.rahu_kalam?.start)} ते ${formatTime(fa.rahu_kalam?.end)}`,
            "din_vishesh": "", 
            "location": "Mumbai",
            "is_manual_override": false
        };
    }

    fs.writeFileSync(PANCHANG_FILE, JSON.stringify(finalJson, null, 2), 'utf8');
    console.log("अचूक चंद्रोदयांसह ७ दिवसांचा पंचांग डेटा अपडेट झाला!");
}

updatePanchang();
