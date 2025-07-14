# 🎨 Portfolio Generator.

Transform your resume into a beautiful, personalized portfolio website in minutes! This web application uses smart parsing to extract information from your resume and creates a stunning portfolio with customizable themes and layouts.

## 🚀 Features

### 📄 Smart Resume Processing
- **File Support**: Upload PDF or DOCX resume files
- **Intelligent Parsing**: Automatically extracts contact info, experience, education, skills, and projects
- **Section Detection**: Recognizes different resume sections using AI-powered parsing

### 🎨 Personalization & Themes
- **Multiple Themes**: Choose from Modern, Classic, Creative, and Minimal designs
- **Color Schemes**: 5 beautiful color options (Ocean Blue, Forest Green, Royal Purple, Sunset Orange, Crimson Red)
- **Layout Options**: Single-column, two-column, or timeline layouts
- **Additional Sections**: Add certifications, awards, volunteer work, languages, and more

### 🔗 Sharing & Export
- **Unique Portfolio URLs**: Get a shareable link for your portfolio
- **Copy & Share**: Easy URL copying and social sharing
- **Download Options**: Export your portfolio as PDF
- **Responsive Design**: Looks great on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React icons, Custom components
- **File Processing**: pdf-parse (PDF), mammoth (DOCX)
- **File Upload**: react-dropzone
- **Animations**: Framer Motion

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Usage

1. **Upload Your Resume**
   - Drag and drop your PDF or DOCX resume file
   - Or click to browse and select your file
   - Maximum file size: 10MB

2. **Personalize Your Portfolio**
   - Choose your preferred theme (Modern, Classic, Creative, Minimal)
   - Select a color scheme that matches your brand
   - Pick a layout style (Single-column, Two-column, Timeline)
   - Add optional sections like certifications or awards

3. **Preview & Share**
   - Review your generated portfolio
   - Copy the shareable URL
   - Download as PDF or share directly

## 📁 Project Structure

```
portfolio-generator/
├── src/
│   ├── app/                  # Next.js 13+ app directory
│   │   ├── api/             # API routes
│   │   │   └── parse-resume/ # Resume parsing endpoint
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── FileUploadSection.tsx
│   │   ├── PersonalizationForm.tsx
│   │   └── PortfolioPreview.tsx
│   ├── lib/                 # Utility functions
│   │   ├── resume-parser.ts # Resume parsing logic
│   │   └── utils.ts         # Helper functions
│   └── types/               # TypeScript definitions
│       └── resume.ts        # Data structure types
├── public/                  # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Add any environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Customization

#### Adding New Themes
1. Update the theme options in `PersonalizationForm.tsx`
2. Add rendering logic in `PortfolioPreview.tsx`
3. Create corresponding CSS classes in `globals.css`

#### Adding New Color Schemes
1. Update the `colorSchemes` array in `PersonalizationForm.tsx`
2. Add corresponding Tailwind classes
3. Update the `getColorClasses` function in `PortfolioPreview.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components inspired by modern design principles
- Icons by [Lucide](https://lucide.dev/)
- Resume parsing powered by [pdf-parse](https://github.com/modesty/pdf2json) and [mammoth](https://github.com/mwilliamson/mammoth.js)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🐛 Troubleshooting

### Common Issues

**File upload not working**
- Check file size (must be < 10MB)
- Ensure file format is PDF or DOCX
- Check browser console for errors

**Resume parsing incomplete**
- Ensure your resume has clear section headers
- Check that contact information is prominently displayed
- Try with a different file format

**Styling issues**
- Clear browser cache
- Check if Tailwind CSS is properly compiled
- Verify custom CSS classes are defined

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include your browser version and error messages

---

Made with ❤️ for job seekers and professionals worldwide! 