#!/bin/bash
# setup.sh — Auto-setup script for Kaushal Vault

echo "KAUSHAL VAULT — SETUP INITIALIZATION"
echo "========================================"
echo ""

# CREATE FOLDER STRUCTURE
echo "Creating folder structure..."
mkdir -p css
mkdir -p js
mkdir -p data
mkdir -p assets/fonts
mkdir -p assets/images
mkdir -p assets/icons
echo "Folders created"
echo ""

# CREATE .GITIGNORE
echo "Creating .gitignore..."
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
.vscode/
.idea/
EOF
echo ".gitignore created"
echo ""

# CREATE PACKAGE.JSON
echo "Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "kaushal-vault",
  "version": "1.0.0",
  "description": "Elite full-stack engineer portfolio. 3D-driven. Dark obsession.",
  "author": "Kaushal Kumar",
  "license": "MIT",
  "scripts": {
    "start": "python3 -m http.server 8000",
    "build": "echo 'No build required for static site'",
    "deploy:vercel": "vercel",
    "deploy:netlify": "netlify deploy"
  },
  "keywords": [
    "portfolio",
    "engineer",
    "three.js",
    "gsap",
    "dark-mode",
    "3d",
    "luxury"
  ]
}
EOF
echo "package.json created"
echo ""

# CREATE .ENV EXAMPLE
echo "Creating .env.example..."
cat > .env.example << 'EOF'
# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXX

# API Keys (if needed)
GITHUB_TOKEN=
OPENAI_API_KEY=

# Domain
DOMAIN=kaushal.dev
EOF
echo ".env.example created"
echo ""

# CREATE VERCEL CONFIG
echo "Creating vercel.json..."
cat > vercel.json << 'EOF'
{
  "name": "kaushal-vault",
  "version": 2,
  "buildCommand": "echo 'Static site, no build needed'",
  "public": true,
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
EOF
echo "vercel.json created"
echo ""

# CREATE NETLIFY CONFIG
echo "Creating netlify.toml..."
cat > netlify.toml << 'EOF'
[build]
  command = "echo 'Static site deployed'"
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
EOF
echo "netlify.toml created"
echo ""

# CREATE ROBOTS.TXT
echo "Creating robots.txt..."
cat > robots.txt << 'EOF'
User-agent: *
Allow: /
Disallow: /assets/

Sitemap: https://kaushal.dev/sitemap.xml
EOF
echo "robots.txt created"
echo ""

# CREATE SITEMAP.XML
echo "Creating sitemap.xml..."
cat > sitemap.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://kaushal.dev/</loc>
        <lastmod>2025-01-01</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://kaushal.dev/#proof</loc>
        <lastmod>2025-01-01</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://kaushal.dev/#projects</loc>
        <lastmod>2025-01-01</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>
EOF
echo "sitemap.xml created"
echo ""

echo "SETUP COMPLETE"
echo ""
echo "Next steps:"
echo "1. Your CSS files are in css/ folder"
echo "2. Your JS files are in js/ folder"
echo "3. Your data files are in data/ folder"
echo "4. Run: python -m http.server 8000"
echo "5. Visit: http://localhost:8000"
echo ""
echo "To deploy:"
echo "  Vercel:  npm run deploy:vercel"
echo "  Netlify: npm run deploy:netlify"
echo ""
echo "You're ready to dominate."

