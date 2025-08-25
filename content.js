// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "getPageContent") {
		// Get main content
		const content = document.body.innerText;

		// Get metadata
		const metadata = {
			description:
				document.querySelector('meta[name="description"]')?.content || "",
			keywords: document.querySelector('meta[name="keywords"]')?.content || "",
			author: document.querySelector('meta[name="author"]')?.content || "",
			ogTitle:
				document.querySelector('meta[property="og:title"]')?.content || "",
			ogDescription:
				document.querySelector('meta[property="og:description"]')?.content ||
				"",
			ogImage:
				document.querySelector('meta[property="og:image"]')?.content || "",
			articleText: getArticleText(),
			images: getImages(),
		};

		sendResponse({ content, metadata });
	}
});

// Extract main article text if possible
function getArticleText() {
	// Try to find main content areas
	const selectors = [
		"article",
		"main",
		'[role="main"]',
		".content",
		"#content",
		".post",
		".entry-content",
	];

	for (const selector of selectors) {
		const element = document.querySelector(selector);
		if (element) {
			return element.innerText.substring(0, 2000);
		}
	}

	return "";
}

// Get all images on page
function getImages() {
	const images = Array.from(document.querySelectorAll("img"));
	return images
		.filter((img) => img.width > 100 && img.height > 100) // Filter tiny images
		.slice(0, 5) // Limit to 5 images
		.map((img) => ({
			src: img.src,
			alt: img.alt,
			width: img.width,
			height: img.height,
		}));
}
