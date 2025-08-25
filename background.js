chrome.runtime.onInstalled.addListener(() => {
	// Create main context menu
	chrome.contextMenus.create({
		id: "obsidian-capture-parent",
		title: "Capture to Obsidian",
		contexts: ["all"],
	});

	// Sub-menu items for different capture types
	chrome.contextMenus.create({
		id: "capture-selection",
		parentId: "obsidian-capture-parent",
		title: "📝 Capture Selection",
		contexts: ["selection"],
	});

	chrome.contextMenus.create({
		id: "capture-image",
		parentId: "obsidian-capture-parent",
		title: "🖼️ Capture Image",
		contexts: ["image"],
	});

	chrome.contextMenus.create({
		id: "capture-link",
		parentId: "obsidian-capture-parent",
		title: "🔗 Capture Link",
		contexts: ["link"],
	});

	chrome.contextMenus.create({
		id: "capture-page",
		parentId: "obsidian-capture-parent",
		title: "📄 Capture Full Page",
		contexts: ["page"],
	});

	chrome.contextMenus.create({
		id: "capture-video",
		parentId: "obsidian-capture-parent",
		title: "🎥 Capture Video",
		contexts: ["video"],
	});

	console.log("Obsidian Capture extension installed!");
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	let captureData = {
		timestamp: new Date().toISOString(),
		url: tab.url,
		title: tab.title,
		type: null,
		content: null,
		metadata: {},
	};

	switch (info.menuItemId) {
		case "capture-selection":
			captureData.type = "text";
			captureData.content = info.selectionText;
			captureData.metadata.length = info.selectionText.length;
			break;

		case "capture-image":
			captureData.type = "image";
			captureData.content = info.srcUrl;
			captureData.metadata.pageUrl = info.pageUrl;
			break;

		case "capture-link":
			captureData.type = "link";
			captureData.content = info.linkUrl;
			captureData.metadata.linkText = info.linkText || "No text";
			break;

		case "capture-page":
			captureData.type = "page";
			// Send message to content script to get full page content
			const response = await chrome.tabs.sendMessage(tab.id, {
				action: "getPageContent",
			});
			captureData.content = response.content;
			captureData.metadata = response.metadata;
			break;

		case "capture-video":
			captureData.type = "video";
			captureData.content = info.srcUrl;
			captureData.metadata.pageUrl = info.pageUrl;
			break;
	}
	// Store capture locally for now
	await storeCapture(captureData);

	// Show notification
	showNotification(captureData.type);
});

// Store capture in Chrome storage
async function storeCapture(data) {
	const { captures = [] } = await chrome.storage.local.get("captures");
	captures.push(data);

	// Keep only last 100 captures in storage
	if (captures.length > 100) {
		captures.shift();
	}

	await chrome.storage.local.set({ captures });

	// Update badge to show capture count
	chrome.action.setBadgeText({ text: captures.length.toString() });
	chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
}

// Show notification
function showNotification(type) {
	// For now, just update the badge
	chrome.action.setBadgeText({ text: "✓" });
	setTimeout(() => {
		chrome.storage.local.get("captures").then(({ captures = [] }) => {
			chrome.action.setBadgeText({ text: captures.length.toString() });
		});
	}, 2000);
}

// Handle messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "getCaptures") {
		chrome.storage.local.get("captures").then(({ captures = [] }) => {
			sendResponse({ captures });
		});
		return true; // Keep channel open for async response
	}

	if (request.action === "clearCaptures") {
		chrome.storage.local.set({ captures: [] }).then(() => {
			chrome.action.setBadgeText({ text: "" });
			sendResponse({ success: true });
		});
		return true;
	}

	if (request.action === "exportToObsidian") {
		// TODO: Implement export to Obsidian
		exportToObsidian(request.captures).then((result) => {
			sendResponse(result);
		});
		return true;
	}
});

// Store capture in Chrome storage
async function storeCapture(data) {
	const { captures = [] } = await chrome.storage.local.get("captures");
	captures.push(data);

	// Keep only last 100 captures in storage
	if (captures.length > 100) {
		captures.shift();
	}

	await chrome.storage.local.set({ captures });

	// Update badge to show capture count
	chrome.action.setBadgeText({ text: captures.length.toString() });
	chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
}

// Show notification
function showNotification(type) {
	// For now, just update the badge
	chrome.action.setBadgeText({ text: "✓" });
	setTimeout(() => {
		chrome.storage.local.get("captures").then(({ captures = [] }) => {
			chrome.action.setBadgeText({ text: captures.length.toString() });
		});
	}, 2000);
}

// Handle messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "getCaptures") {
		chrome.storage.local.get("captures").then(({ captures = [] }) => {
			sendResponse({ captures });
		});
		return true; // Keep channel open for async response
	}

	if (request.action === "clearCaptures") {
		chrome.storage.local.set({ captures: [] }).then(() => {
			chrome.action.setBadgeText({ text: "" });
			sendResponse({ success: true });
		});
		return true;
	}

	if (request.action === "exportToObsidian") {
		// TODO: Implement export to Obsidian
		exportToObsidian(request.captures).then((result) => {
			sendResponse(result);
		});
		return true;
	}
});

// Export to Obsidian (placeholder for now)
async function exportToObsidian(captures) {
	// This will eventually connect to your backend API
	// For now, generate markdown and copy to clipboard
	const markdown = generateMarkdown(captures);

	// Send to popup to handle clipboard
	return { success: true, markdown };
}

// Generate markdown from captures
function generateMarkdown(captures) {
	let markdown = `# Captures - ${new Date().toLocaleDateString()}\n\n`;

	captures.forEach((capture) => {
		markdown += `## ${capture.type.toUpperCase()}: ${capture.title}\n`;
		markdown += `- **Time**: ${new Date(capture.timestamp).toLocaleString()}\n`;
		markdown += `- **URL**: [${capture.url}](${capture.url})\n`;

		switch (capture.type) {
			case "text":
				markdown += `\n> ${capture.content}\n`;
				break;
			case "image":
				markdown += `\n![Image](${capture.content})\n`;
				break;
			case "link":
				markdown += `\n- [${capture.metadata.linkText}](${capture.content})\n`;
				break;
			case "page":
				markdown += `\n${capture.content.substring(0, 500)}...\n`;
				break;
			case "video":
				markdown += `\n- [Video Link](${capture.content})\n`;
				break;
		}

		markdown += "\n---\n\n";
	});

	return markdown;
}
