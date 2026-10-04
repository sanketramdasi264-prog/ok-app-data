const fs = require('fs');
const path = require('path');

const PANCHANG_FILE = path.join(__dirname, '../data/panchang.json');

// १. इंग्रजी शब्दांचे मराठीत भाषांतर करण्यासाठी डिक्शनरी (Mapping Dictionary)
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
        "Purva Bhadrapada": "पूर्वा भाद्रपदा", "Uttara Bhadrapada": "उत्तरा भाद्रपदा", "Revati": "रेवती"
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

// भाषांतर करणारे छोटे फंक्शन
function translate(category, englishWord) {
    if (!englishWord) return "";
    // जर डिक्शनरीमध्ये शब्द सापडला तर तो देईल, नाहीतर मूळ इंग्रजी शब्द तसाच ठेवेल
    return marathiMapping[category][englishWord] || englishWord;
}

// २. API मधून डेटा आणण्याचे फंक्शन
async function fetchVedAstroData(dateObj) {
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    const formattedDate = `${dd}-${mm}-${yyyy}`;
    
    console.log(`Fetching data for ${formattedDate}...`);

    // टीप: VedAstro चे नेमके Endpoints तुम्ही तुमच्या गरजेनुसार बदलू शकता.
    // येथे उदाहरणासाठी आपण डेटा कसा मॅप करायचा ते दाखवले आहे.
    // try {
    //     const response = await fetch(`https://api.vedastro.org/Calculate/.../Pune/Time/12:00/${dd}/${mm}/${yyyy}/+05:30`);
    //     const apiData = await response.json();
    // } catch(e) {}

    // API मधून मिळालेला डेटा कसा मॅप करायचा त्याचे उदाहरण:
    const fetchedData = {
        "date": formattedDate,
        "weekday": translate("weekdays", dateObj.toLocaleDateString('en-US', { weekday: 'long' })),
        
        // समजा API मधून "Dashami" आले, तर translate फंक्शन त्याला "दशमी" करेल
        "tithi": translate("tithi", "Dashami"), 
        "tithi_end": "११:०५", // API मधून आलेली वेळ येथे सेट करा
        "tithi_next": translate("tithi", "Ekadashi"),
        
        "paksha": translate("paksha", "Shukla"),
        
        "nakshatra": translate("nakshatra", "Shravana"),
        "nakshatra_end": "१६:३०",
        
        "moon_rashi": translate("rashi", "Capricorn"),
        "sun_rashi": translate("rashi", "Virgo"),
        
        "sunrise": "०६:२९",
        "sunset": "१८:१७",
        "rahukaal": "०७:५८ ते ०९:२६",
        
        "din_vishesh": "API मधील विशेष दिवस",
        "location": "Pune",
        "is_manual_override": false
    };

    return fetchedData;
}

// ३. मुख्य फंक्शन - ३ दिवसांचा डेटा मॅनेज करणे
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
        
        // जर आधीच डेटा असेल आणि त्यात मॅन्युअल बदल केले असतील, तर तोच ठेवा
        if (existingData[dateKey] && existingData[dateKey].is_manual_override) {
            newData[dateKey] = existingData[dateKey];
            console.log(`${dateKey} चा मॅन्युअल डेटा सुरक्षित ठेवला.`);
        } else {
            // नवीन डेटा API कडून आणा
            const apiResult = await fetchVedAstroData(dateObj);
            newData[dateKey] = apiResult;
            console.log(`${dateKey} चा डेटा यशस्वीरित्या मॅप झाला.`);
        }
    }

    // JSON फाईल अपडेट करा
    fs.writeFileSync(PANCHANG_FILE, JSON.stringify(newData, null, 2), 'utf8');
    console.log("पंचांग डेटा अपडेट पूर्ण झाले!");
}

updatePanchang();
