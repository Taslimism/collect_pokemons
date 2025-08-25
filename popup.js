document.addEventListener("DOMContentLoaded", async () => {
	loadCaptures();

	// Export button
	document
		.getElementById("export-btn")
		.addEventListener("click", exportCaptures);

	// Clear button
	document.getElementById("clear-btn").addEventListener("click", clearCaptures);
});

async function loadCaptures() {
	const response = await chrome.runtime.sendMessage({ action: "getCaptures" });
	const captures = response.captures || [];

	updateStats(captures);
	displayCaptures(captures);
}

function updateStats(captures) {
	document.getElementById("total-count").textContent = captures.length;

	const counts = {
		text: 0,
		image: 0,
		link: 0,
		page: 0,
		video: 0,
	};

	captures.forEach((capture) => {
		if (counts[capture.type] !== undefined) {
			counts[capture.type]++;
		}
	});

	document.getElementById("text-count").textContent = counts.text;
	document.getElementById("image-count").textContent = counts.image;
	document.getElementById("link-count").textContent = counts.link;
}

function displayCaptures(captures) {
	const container = document.getElementById("captures-list");

	if (captures.length === 0) {
		container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div>No captures yet</div>
        <div style="font-size: 12px; margin-top: 10px;">
          Right-click anything to start capturing!
        </div>
      </div>
    `;
		return;
	}

	container.innerHTML = "";

	// Show recent captures first
	captures.reverse().forEach((capture) => {
		const item = document.createElement("div");
		item.className = "capture-item";

		const typeClass = `type-${capture.type}`;
		const timeAgo = getTimeAgo(capture.timestamp);

		item.innerHTML = `
      <span class="capture-type ${typeClass}">${capture.type}</span>
      <span class="capture-time">${timeAgo}</span>
      <div class="capture-title">${capture.title || "Untitled"}</div>
    `;

		container.appendChild(item);
	});
}

function getTimeAgo(timestamp) {
	const now = new Date();
	const then = new Date(timestamp);
	const diff = now - then;

	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	if (days > 0) return `${days}d ago`;
	if (hours > 0) return `${hours}h ago`;
	if (minutes > 0) return `${minutes}m ago`;
	return "Just now";
}

async function exportCaptures() {
	const response = await chrome.runtime.sendMessage({ action: "getCaptures" });
	const captures = response.captures || [];

	if (captures.length === 0) {
		alert("No captures to export!");
		return;
	}

	const result = await chrome.runtime.sendMessage({
		action: "exportToObsidian",
		captures,
	});

	if (result.success) {
		// Copy markdown to clipboard
		navigator.clipboard.writeText(result.markdown).then(() => {
			alert("Markdown copied to clipboard! Paste it in Obsidian.");
		});
	}
}

async function clearCaptures() {
	if (confirm("Clear all captures? This cannot be undone.")) {
		await chrome.runtime.sendMessage({ action: "clearCaptures" });
		loadCaptures();
	}
}
