console.log("Content script loaded!");

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