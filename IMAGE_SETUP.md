# Image Setup Instructions

## Profile Image

1. **Add your profile image:**
   - Save your profile photo as `profile-image.jpg` in the root directory (same folder as `index.html`)
   - Recommended size: 600x600 pixels or larger (square format works best)
   - The image will be automatically cropped to a circle
   - Supported formats: JPG, PNG, WebP

2. **If the image doesn't load:**
   - The site will automatically show a placeholder with your initials "AA"
   - Make sure the filename is exactly `profile-image.jpg` (case-sensitive on some servers)

## Project Images

1. **Create a projects folder:**
   - Create a folder named `projects` in the root directory
   - Add your project cover images to this folder

2. **Add project images:**
   - `projects/ml-forecasting.jpg` - For Lab Research Data Forecasting project
   - `projects/grant-classifier.jpg` - For Grant Opportunity ML Classifier project
   - `projects/crop-yield-gan.jpg` - For Crop Yield Prediction with GANs project

3. **Image specifications:**
   - Recommended size: 1200x600 pixels (2:1 aspect ratio)
   - Format: JPG or PNG
   - If images are missing, the site will show a beautiful gradient placeholder

## Folder Structure

```
portfolio/
├── index.html
├── styles.css
├── script.js
├── profile-image.jpg          ← Your profile photo here
├── projects/                   ← Create this folder
│   ├── ml-forecasting.jpg     ← Project image 1
│   ├── grant-classifier.jpg   ← Project image 2
│   └── crop-yield-gan.jpg     ← Project image 3
└── README.md
```

## Tips for Best Results

1. **Profile Image:**
   - Use a professional headshot
   - Ensure good lighting
   - Plain or blurred background works best
   - Face should be centered

2. **Project Images:**
   - Use screenshots of your projects
   - Or create custom graphics/dashboards
   - Make sure text is readable if included
   - Keep images high quality but optimized (under 500KB each)

3. **Image Optimization:**
   - Use tools like TinyPNG or ImageOptim to compress images
   - This will improve page load speed
   - Maintain quality while reducing file size

## Alternative: Using Online Images

If you prefer to host images online (e.g., GitHub, Imgur, Cloudinary):
1. Upload your images to your preferred hosting service
2. Update the `src` attributes in `index.html` with the full URLs
3. Example: `<img src="https://your-domain.com/profile-image.jpg" ...>`

