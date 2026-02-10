let startMessage = null;
let endMessage = null;

// Add a listener for message events
window.addEventListener("message", function(event) {
	if(event.data.name == "Stopwatch:Start") {
		// Update the last received message
		startMessage = {
			data: event.data.data,
			timestamp: new Date() // Add a timestamp
			};
	}
    else if (event.data.name == "Stopwatch:Stop") {
        if(startMessage) {
            endMessage = {
                data: event.data.data,
                timestamp: new Date() // Add a timestamp
                };

			console.log(endMessage.data + ": ", endMessage.timestamp.getTime() - startMessage.timestamp.getTime(), " ms");
        }
        else {
            console.log("Stopwatch not started");
        }
    }
  
});

// Optional: Expose the lastReceivedMessage variable to the global scope for debugging
window.getLastReceivedMessage = function() {
  return lastReceivedMessage;
};


//copy elem
window._lastRightClickedElement = null;

document.addEventListener("contextmenu", (event) => {
  window._lastRightClickedElement = event.target;
}, true);


let fieldName = null;

function extractFieldName(g) {
    if (!g) return null;

    const texts = g.querySelectorAll("text");

    for (const t of texts) {
        const value = t.textContent.trim();

        // Ignore the dropdown arrow
        if (value && value !== "▾") {
            return value;
        }
    }

    return null;
}

document.addEventListener("contextmenu", (event) => {

    const path = event.composedPath?.() || [];
    let lastSvgElement;

    for (const el of path) {
        if (el instanceof SVGElement) {
            lastSvgElement = el;
            break;
        }
    }

    // fallback
    const el = document.elementFromPoint(event.clientX, event.clientY);
    if (el?.closest("g")) {
        lastSvgElement = el.closest("g");
    }

    fieldName = extractFieldName(lastSvgElement);

    // --- inject menu AFTER KBMax creates it ---
    setTimeout(() => {
        const menu = document.querySelector(".snap-popup");
        if (!menu) return;

        if (!fieldName) return;
        if (menu.querySelector(".kbtools-copy")) return;

        const separator = document.createElement("hr");
        separator.className = "separator kbtools-copy";

        const item = document.createElement("div");
        item.className = "snap-option kbtools-copy";
        item.textContent = "KBTools – Copy: " + fieldName;
        item.style.cursor = "pointer";
        item.style.padding = "6px 12px";

        item.addEventListener("click", () => {
            navigator.clipboard.writeText(fieldName);
            menu.remove();
        });

        menu.appendChild(separator);
        menu.appendChild(item);
    }, 0);

});

function findContextMenu() {
    return document.getElementsByClassName("snap-popup")[0];
}
