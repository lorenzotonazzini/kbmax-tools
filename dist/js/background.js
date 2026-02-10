

// Copy Inner HTML
// Create the menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copy-inner-html",
    title: "KBMax - Copy elem",
    contexts: ["all"] 
  });
});

// Listen for the click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  
  if (info.menuItemId === "copy-inner-html") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: copyElementHTML,
    });
  }
});

// This function runs inside the webpage context
function copyElementHTML() {
  const target = window._lastRightClickedElement;
  if (target) {
    const html = target.innerHTML;
    navigator.clipboard.writeText(html).then(() => {});
  } else {
    alert("Please right-click the element again to focus it.");
  }
}