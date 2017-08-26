(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    // Functions for block with type 'w' will get a callback function as the 
    // final argument. This should be called to indicate that the block can
    // stop waiting.
    ext.wait_random = function(callback) {
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['b', 'wait aaa', 'wait_random'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('Random wait extension', descriptor, ext);
})({});