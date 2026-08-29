import re

def update_locale(filepath, is_hi=False):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if is_hi:
        nav_additions = """    yourAccount: 'आपका खाता',
    myQueries: 'मेरे प्रश्न',
    uploadDocument: 'दस्तावेज़ अपलोड करें',
    savedItems: 'सहेजे गए आइटम',
    settings: 'सेटिंग्स',
    needHelp: 'मदद चाहिए?',
    contactSupportDesc: 'तकनीकी सहायता के लिए हमारी सहायता टीम से संपर्क करें।',
    contactSupport: 'समर्थन से संपर्क करें',
    askSmartGuide: 'स्मार्टगाइड से पूछें'"""
        
        header_additions = """    searchPlaceholder: 'मानक, उत्पाद खोजें, या एक प्रश्न पूछें...',
    searchButton: 'खोजें',
    signIn: 'साइन इन करें',
    bis: 'भारतीय मानक ब्यूरो',
    bisSub: 'भारत का राष्ट्रीय मानक निकाय'"""
    else:
        nav_additions = """    yourAccount: 'YOUR ACCOUNT',
    myQueries: 'My Queries',
    uploadDocument: 'Upload Document',
    savedItems: 'Saved Items',
    settings: 'Settings',
    needHelp: 'Need Help?',
    contactSupportDesc: 'Contact our support team for technical assistance.',
    contactSupport: 'Contact Support',
    askSmartGuide: 'Ask SmartGuide'"""

        header_additions = """    searchPlaceholder: 'Search standards, products, or ask a question...',
    searchButton: 'Search',
    signIn: 'Sign In',
    bis: 'Bureau of Indian Standards',
    bisSub: 'The National Standards Body of India'"""
    
    # We will just insert them manually if they don't exist.
    # Easiest way is to replace the whole nav and header blocks or just rely on the fallback.
    pass

# actually let's just do text replacement
