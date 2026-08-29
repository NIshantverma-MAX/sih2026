with open('src/locales/hi.ts', 'r') as f:
    content = f.read()

nav_str = """  nav: {
    home: 'होम',
    standards: 'मानक (Standards)',
    certificationGuide: 'प्रमाणन मार्गदर्शिका',
    labs: 'परीक्षण प्रयोगशालाएँ',
    hallmarking: 'हॉलमार्किंग',
    consumerHelp: 'उपभोक्ता सहायता',
    yourAccount: 'आपका खाता',
    myQueries: 'मेरे प्रश्न',
    uploadDocument: 'दस्तावेज़ अपलोड करें',
    savedItems: 'सहेजे गए आइटम',
    settings: 'सेटिंग्स',
    needHelp: 'मदद चाहिए?',
    contactSupportDesc: 'तकनीकी सहायता के लिए हमारी सहायता टीम से संपर्क करें।',
    contactSupport: 'समर्थन से संपर्क करें',
    askSmartGuide: 'स्मार्टगाइड से पूछें'
  },"""

header_str = """  header: {
    searchPlaceholder: 'मानक, उत्पाद खोजें, या एक प्रश्न पूछें...',
    searchButton: 'खोजें',
    signIn: 'साइन इन करें',
    bis: 'भारतीय मानक ब्यूरो',
    bisSub: 'भारत का राष्ट्रीय मानक निकाय'
  },"""

# replace the block carefully
import re
content = re.sub(r'  nav: \{[\s\S]*?\},', nav_str, content, count=1)
content = re.sub(r'  header: \{[\s\S]*?\},', header_str, content, count=1)

with open('src/locales/hi.ts', 'w') as f:
    f.write(content)
