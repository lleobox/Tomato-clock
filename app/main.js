
/**
 * Created by lleohao on 2016/3/19.
 */

chrome.app.runtime.onLaunched.addListener( function() {
    chrome.app.window.create( "main.html", {
        id: "tomato-clock",
        innerBounds: {
            width: 356,
            height: 360,
            minWidth: 356,
            maxWidth: 800,
            maxHeight: 600,
            minHeight: 360
        },
        frame: "none"
    } );
} );
