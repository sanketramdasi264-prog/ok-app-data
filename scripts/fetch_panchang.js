const fs = require('fs');
const path = require('path');

const PANCHANG_FILE = path.join(__dirname, '../data/panchang.json');

async function updatePanchang() {
    console.log("पंचांग अपडेट शुरू हो रहा है...");

    // 1. पुरानी JSON फाइल पढ़ें
    let existingData = {};
    if (fs.existsSync(PANCHANG_FILE)) {
        existingData = JSON.parse(fs.readFileSync(PANCHANG_FILE, 'utf8'));
    }

    // 2. कल, आज और कल की तारीखें निकालें
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => date.toISOString().split('T')[0];
    
    const datesToKeep = [formatDate(yesterday), formatDate(today), formatDate(tomorrow)];
    console.log("ये 3 तारीखें रखी जाएंगी:", datesToKeep);

    let newData = {};

    // 3. केवल 3 दिन का डेटा प्रोसेस करें
    for (const dateKey of datesToKeep) {
        if (existingData[dateKey]) {
            // अगर डेटा पहले से है (या आपने मैन्युअल चेंज किया है), तो उसे वैसे ही रखें
            newData[dateKey] = existingData[dateKey];
            console.log(`तारीख ${dateKey} का डेटा पहले से मौजूद है। सुरक्षित रखा गया।`);
        } else {
            // यहाँ हम भविष्य में VedAstro API का कोड डालेंगे
            console.log(`तारीख ${dateKey} का नया डेटा API से लाया जा रहा है...`);
            
            // अभी के लिए एक डमी डेटा बना रहे हैं (API लगने तक)
            newData[dateKey] = {
                "date": dateKey.split('-').reverse().join('-'),
                "din_vishesh": "API से नया डेटा यहाँ आएगा",
                "is_manual_override": false
            };
        }
    }

    // 4. नया डेटा वापस JSON फाइल में सेव करें (पुराना डेटा अपने आप डिलीट हो जाएगा)
    fs.writeFileSync(PANCHANG_FILE, JSON.stringify(newData, null, 2), 'utf8');
    console.log("पंचांग डेटा सफलतापूर्वक अपडेट हो गया!");
}

updatePanchang();
