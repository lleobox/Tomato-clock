/**
 * Created by lleohao on 2016/3/21.
 */

var $ = function (str) {
        return document.querySelector(str);
    },
    $$ = function (str) {
        return document.querySelectorAll(str);
    };

function setHeight() {
    document.querySelector('.message').style.height = (window.outerHeight - 132) + "px";
}

window.onresize = setHeight;

window.onload = setHeight;