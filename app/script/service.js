app.factory("uiService", function () {
    return {
        setHeight: function () {
            document.querySelector('#container').style.height = (window.outerHeight - 70) + "px";
        }
    }
});