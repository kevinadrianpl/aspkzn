# All Steel Productions

A lightweight static business website for All Steel Productions, built as a quick online presence and as a backup copy of the live company site.

This repository holds the core front-end files for the business website, including the homepage, contact page, styling, small JavaScript enhancements, and supporting assets. It is designed to be simple to manage, easy to deploy, and resilient as a local backup of the website assets.

## Project purpose

- Serve as a fast, low-maintenance website for the business
- Use as an online backup of the site source files
- Keep the project easy to edit and deploy without a complicated build pipeline
- Support custom domain hosting through GitHub Pages / Vercel / hosting providers

## What this site is built with

This is a static website made with plain web technologies:

- HTML5 for page structure
- CSS3 for layout, styling, animation, and responsive behavior
- Vanilla JavaScript for interaction and subtle motion effects
- Static image assets and logos stored in the repository
- No framework, no package manager, and no build step required

## Site structure

```text
aspkzn/
├── index.html              # Homepage
├── contact.html            # Contact page
├── CNAME                   # Custom domain configuration for GitHub Pages
├── asp-logo1.png           # Brand/logo asset
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── main.js         # Small interactive front-end logic
│   └── img/
│       └── logo-asp.svg    # Vector logo asset
├── README.md               # Project documentation
├── .gitattributes          # Git line-ending handling
└── .gitignore              # Ignore local/editor junk
```

## How it works

The site is intentionally simple:

- The pages are static HTML files
- CSS handles the full visual system, spacing, typography, and layout
- JavaScript enhances the page with small interactions such as reveal animations and motion effects
- Assets are referenced directly from the project folder
- The site can be deployed to static hosting providers with no compilation step

## Local development

Since it is a static site, you can run it locally in a few easy ways:

### Option 1: open directly

Open `index.html` in a browser.

### Option 2: local web server

From the project folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deployment notes

This project is already prepared for custom-domain hosting patterns:

- `CNAME` is included for custom domain mapping
- Files are static and compatible with GitHub Pages, Vercel, or traditional hosting
- No Node.js or bundler setup is required

## Repository notes

This repository is intended to be a clean, maintainable backup of the business site source files. The goal is to keep it straightforward so future edits, deployment, and handoff are simple.

## Suggested future improvements

- Add a more formal changelog
- Store approved brand assets in a dedicated `brand/` folder
- Add a contact form backend or alternative workflow if needed
- Replace stock imagery with business-owned photos over time

## License

This repository is for business website backup and maintenance use. Add a license only if you want to formally define reuse terms for the source code and assets.
