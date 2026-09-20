import re

with open('google-stitch-dashboard/stitch_zeroabstraction_admin_dashboard/zeroabstraction_payload_cms_editorial_dashboard/code.html', 'r') as f:
    html = f.read()

# Extract main tag
match = re.search(r'(<main.*?</main>)', html, re.DOTALL)
if not match:
    print("Main not found")
    exit(1)

main_html = match.group(1)

# Convert to JSX
jsx = main_html.replace('class=', 'className=')
jsx = jsx.replace('<!--', '{/*')
jsx = jsx.replace('-->', '*/}')
jsx = jsx.replace('readonly', 'readOnly')
jsx = re.sub(r'<input([^>]*?)>', r'<input\1 />', jsx) # Self-closing inputs
jsx = re.sub(r'<img([^>]*?)>', r'<img\1 />', jsx) # Self-closing imgs
jsx = re.sub(r'<br([^>]*?)>', r'<br\1 />', jsx) # Self-closing br

tsx = f"""'use client'

import React from 'react'

export const DashboardView: React.FC = () => {{
  return (
    <div className="dark bg-[#0b1013] font-['IBM_Plex_Sans'] flex h-screen overflow-hidden text-[#dee3e7]">
      {jsx}
    </div>
  )
}}
"""

with open('src/components/admin/Dashboard/index.tsx', 'w') as f:
    f.write(tsx)

print("Converted to TSX")
