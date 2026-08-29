with open('src/locales/en.ts', 'r') as f:
    content = f.read()

nav_str = """  nav: {
    home: 'Home',
    standards: 'Standards',
    certificationGuide: 'Certification Guide',
    labs: 'Testing Laboratories',
    hallmarking: 'Hallmarking',
    consumerHelp: 'Consumer Help',
    yourAccount: 'Your Account',
    myQueries: 'My Queries',
    uploadDocument: 'Upload Document',
    savedItems: 'Saved Items',
    settings: 'Settings',
    needHelp: 'Need Help?',
    contactSupportDesc: 'Contact our support team for technical assistance.',
    contactSupport: 'Contact Support',
    askSmartGuide: 'Ask SmartGuide'
  },"""

header_str = """  header: {
    searchPlaceholder: 'Search standards, products, or ask a question...',
    searchButton: 'Search',
    signIn: 'Sign In',
    bis: 'Bureau of Indian Standards',
    bisSub: 'The National Standards Body of India'
  },"""

import re
content = re.sub(r'  nav: \{[\s\S]*?\},', nav_str, content, count=1)
content = re.sub(r'  header: \{[\s\S]*?\},', header_str, content, count=1)

with open('src/locales/en.ts', 'w') as f:
    f.write(content)
