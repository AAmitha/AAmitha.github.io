# Professional Portfolio Website

A modern, responsive portfolio website designed to showcase your skills, projects, and experience. Perfect for job hunting and personal branding.

## Features

- 🎨 **Modern Design**: Clean, professional UI with smooth animations
- 📱 **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Fast & Lightweight**: Optimized for performance
- 🎯 **SEO Friendly**: Structured for search engine optimization
- ♿ **Accessible**: Built with accessibility best practices
- 🎭 **Smooth Animations**: Engaging scroll animations and transitions
- 📧 **Contact Form**: Ready-to-use contact form (backend integration needed)

## Quick Start

1. **Open the website**: Simply open `index.html` in your web browser
2. **Customize**: Edit the HTML, CSS, and JavaScript files to match your personal information
3. **Deploy**: Upload to any web hosting service (GitHub Pages, Netlify, Vercel, etc.)

## Customization Guide

### 1. Personal Information

#### Update Your Name and Title
In `index.html`, find and replace:
- Line 7: `<title>Your Name - Portfolio</title>`
- Line 25: `<div class="nav-brand">Your Name</div>`
- Line 38: `<span class="name">Your Name</span>`
- Line 39: `<span class="title">Full Stack Developer</span>` (change to your title)

#### Update Hero Section
- Line 41-44: Update the hero description with your own text
- Line 48-49: Update social media links (LinkedIn, GitHub, Email)

#### Update About Section
- Lines 95-108: Replace with your own story and background

#### Update Statistics
- Lines 110-125: Modify the numbers and labels to match your achievements
  - Change `data-target` values to your actual numbers

### 2. Skills Section

#### Update Skills
In `index.html`, find the skills section (around line 130):
- Modify skill names and progress percentages
- Update `data-width` attributes (0-100) for each skill bar
- Add or remove skills as needed
- Update skill tags in the "Tools & Others" section

### 3. Projects Section

#### Add Your Projects
For each project card:
- Update project title
- Write your project description
- Update technology tags
- Add links to live demo and GitHub repository
- Replace placeholder images with actual project screenshots

To add project images:
```html
<div class="project-image">
    <img src="path/to/your/image.jpg" alt="Project Name">
</div>
```

### 4. Contact Section

#### Update Contact Information
- Line 220: Update email address
- Line 230: Update phone number
- Line 240: Update location

#### Contact Form Backend
The contact form currently shows a success message but doesn't actually send emails. To make it functional:

**Option 1: Use a service like Formspree**
1. Sign up at [formspree.io](https://formspree.io)
2. Get your form endpoint
3. Update the form action in `index.html`:
```html
<form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Option 2: Use EmailJS**
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Follow their integration guide
3. Update `script.js` to use their API

**Option 3: Build your own backend**
- Create an API endpoint to handle form submissions
- Update the form submission handler in `script.js`

### 5. Styling Customization

#### Color Scheme
In `styles.css`, update the CSS variables (lines 8-16):
```css
:root {
    --primary-color: #6366f1;      /* Main brand color */
    --primary-dark: #4f46e5;       /* Darker shade */
    --secondary-color: #8b5cf6;    /* Accent color */
    --text-primary: #1f2937;       /* Main text color */
    --text-secondary: #6b7280;     /* Secondary text color */
    /* ... */
}
```

#### Fonts
The site uses Google Fonts (Inter). To change:
1. Visit [Google Fonts](https://fonts.google.com)
2. Select your font
3. Update the font link in `index.html` (line 10)
4. Update `font-family` in `styles.css` (line 25)

### 6. Social Media Links

Update the social media links in the hero section:
- LinkedIn: Line 50
- GitHub: Line 55
- Email: Line 60

## Deployment

### GitHub Pages
1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select your branch and folder
4. Your site will be live at `https://yourusername.github.io/repository-name`

### Netlify
1. Sign up at [netlify.com](https://www.netlify.com)
2. Drag and drop your project folder
3. Your site will be live instantly

### Vercel
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with one click

## File Structure

```
portfolio/
├── index.html      # Main HTML file
├── styles.css      # All styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

1. **Optimize Images**: Compress images before adding them
2. **Minify CSS/JS**: Use minified versions for production
3. **Use CDN**: Consider using a CDN for faster loading
4. **Lazy Loading**: Images are set up for lazy loading

## SEO Optimization

To improve SEO:
1. Update meta description in `index.html` (line 6)
2. Add Open Graph tags for social media sharing
3. Add structured data (JSON-LD) for rich snippets
4. Ensure all images have alt text
5. Use semantic HTML (already implemented)

## Accessibility

The site includes:
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast compliance

## Future Enhancements

Consider adding:
- Blog section
- Testimonials section
- Resume/CV download
- Dark mode toggle
- Multi-language support
- Analytics integration (Google Analytics)

## Support

If you encounter any issues or have questions:
1. Check the code comments
2. Review browser console for errors
3. Ensure all file paths are correct

## License

This portfolio template is free to use and modify for personal and commercial projects.

## Credits

- Fonts: [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- Icons: SVG icons (no external dependencies)

---

**Good luck with your job search! 🚀**

