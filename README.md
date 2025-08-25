# Obsidian Universal Capture - Chrome Extension

## 🧠 Overview
A powerful Chrome extension that captures web content directly to your Obsidian second brain. Capture text, images, links, videos, and entire pages with right-click context menus, then export everything as formatted Markdown for your knowledge base.

## 🎯 Purpose
Bridge the gap between web browsing and knowledge management by making it effortless to capture anything interesting you find online into your Obsidian vault. Perfect for researchers, students, content creators, and anyone building a personal knowledge management system.

## ✨ Features

### Capture Types
- **📝 Text Selection**: Capture highlighted text with full context
- **🖼️ Images**: Save image URLs with metadata
- **🔗 Links**: Capture links with their anchor text
- **📄 Full Pages**: Extract entire page content with metadata
- **🎥 Videos**: Save video sources for later reference

### Smart Features
- **Context Menu Integration**: Right-click anything to capture it
- **Metadata Extraction**: Automatically captures:
  - Page title and URL
  - OpenGraph metadata (og:title, og:description, og:image)
  - Author information
  - Article content detection
  - Image dimensions and alt text
- **Badge Counter**: Shows number of pending captures
- **Batch Export**: Export all captures as formatted Markdown
- **Local Storage**: Keeps last 100 captures for privacy
- **Beautiful UI**: Gradient design with categorized capture display

## 🔧 Technical Architecture

### Components

#### Background Service Worker (`background.js`)
- Creates hierarchical context menus
- Handles capture events from different contexts
- Manages Chrome storage (100 capture limit)
- Generates Markdown from captures
- Updates extension badge with capture count

#### Content Script (`content.js`)
- Extracts page content and metadata
- Intelligent article detection using multiple selectors
- Image filtering (removes tiny images <100px)
- Handles messages from background script

#### Popup Interface (`popup.html` & `popup.js`)
- Displays capture statistics by type
- Shows recent captures with time-ago formatting
- Export to clipboard functionality
- Clear all captures option
- Gradient purple theme with glass-morphism cards

### Data Structure
```javascript
{
  timestamp: "ISO 8601 date",
  url: "page URL",
  title: "page title",
  type: "text|image|link|page|video",
  content: "captured content",
  metadata: {
    // Type-specific metadata
  }
}
```

## 📁 Project Structure
```
second_brain/
├── manifest.json        # Extension configuration
├── background.js       # Service worker & capture logic
├── content.js         # Page content extraction
├── popup.html        # Extension popup UI
├── popup.js         # Popup functionality
├── icons/          # Extension icons
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── .git/          # Version control
```

## 🚀 Installation
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `second_brain` folder
5. Right-click any content to start capturing!

## 💡 Usage Workflow

### Capturing Content
1. Browse normally
2. Right-click on any:
   - Selected text
   - Image
   - Link
   - Video
   - Or empty space for full page
3. Choose "Capture to Obsidian" → Select capture type
4. Badge shows capture count

### Exporting to Obsidian
1. Click extension icon
2. Review captures (stats & list)
3. Click "📤 Export to Obsidian"
4. Markdown is copied to clipboard
5. Paste into your Obsidian vault

### Markdown Output Format
```markdown
# Captures - [Date]

## TEXT: Article Title
- **Time**: 1/1/2024, 10:30 AM
- **URL**: [https://example.com](https://example.com)

> Captured text content here

---

## IMAGE: Page Title
- **Time**: 1/1/2024, 10:31 AM
- **URL**: [https://example.com](https://example.com)

![Image](https://image-url.jpg)

---
```

## 🎨 Design Features
- **Gradient Background**: Purple gradient (135deg, #667eea → #764ba2)
- **Glass-morphism Cards**: Semi-transparent white overlays
- **Type Badges**: Color-coded capture type indicators
- **Responsive Stats**: Real-time capture counting
- **Smooth Animations**: Hover effects and transitions

## 🔒 Privacy & Security
- **Local Storage Only**: All captures stored locally in Chrome
- **No External Servers**: No data sent to third parties
- **100 Capture Limit**: Automatic cleanup of old captures
- **Manual Export**: You control when and what to export

## 🚧 Future Enhancements (TODOs in code)
- [ ] Direct Obsidian vault integration via local API
- [ ] AI-powered auto-tagging of captures
- [ ] Customizable capture templates
- [ ] Bulk editing before export
- [ ] Cloud sync option
- [ ] Capture history search
- [ ] Custom hotkeys for quick capture
- [ ] Advanced filtering and sorting

## 🔌 Permissions Used
- `contextMenus`: Right-click capture functionality
- `storage`: Local capture storage
- `activeTab`: Current tab information
- `tabs`: Tab metadata access
- `clipboardWrite`: Copy markdown to clipboard
- `host_permissions`: Access to all websites for content extraction

## 🎓 Perfect For
- **Researchers**: Collect sources and quotes
- **Students**: Gather study materials
- **Writers**: Capture inspiration and references
- **Developers**: Save code snippets and documentation
- **Content Creators**: Collect ideas and resources

## 📝 Version
**1.0.0** - Initial release with core capture functionality

## 🏷️ Status
**Active Development** - Functional capture system with Obsidian export via clipboard. Direct vault integration planned for future releases.