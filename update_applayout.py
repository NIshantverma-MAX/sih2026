import re

with open('src/layouts/AppLayout.tsx', 'r') as f:
    content = f.read()

# Replace hardcoded strings
content = content.replace("YOUR ACCOUNT", "{t('nav.yourAccount') || 'YOUR ACCOUNT'}")
content = content.replace("Ask SmartGuide\n", "{t('nav.askSmartGuide') || 'Ask SmartGuide'}\n")
content = content.replace("Need Help?</span>", "{t('nav.needHelp') || 'Need Help?'}</span>")
content = content.replace("Contact our support team for technical assistance.", "{t('nav.contactSupportDesc') || 'Contact our support team for technical assistance.'}")
content = content.replace("Contact Support\n", "{t('nav.contactSupport') || 'Contact Support'}\n")
content = content.replace("Bureau of Indian Standards</h1>", "{t('header.bis') || 'Bureau of Indian Standards'}</h1>")
content = content.replace("The National Standards Body of India</p>", "{t('header.bisSub') || 'The National Standards Body of India'}</p>")

with open('src/layouts/AppLayout.tsx', 'w') as f:
    f.write(content)
