/**********************************************************************************************
 *  Class: WindowController.
 *  Created by David Iglesias <davidiglesanchez@gmail.com>
 *  All rights reserved.
 *
 *  This class helps to manage html elements that behave like
 *  a window.
 *  Usage:
 *
 *   let window1 = new WindowController({title: "WindowTitle"}, [HTML PARENT ELEMENT]);
 *  Where [HTML PARENT ELEMENT] is the parent element where the window would be appended.
 *
 *  This class requires JQuery and include the window css file.
 *
 ********************************************************************************************/
var WindowController = (function () {
    function WindowController(configuration, parent) {
        this.configuration = {
            title: "DefaultWindow"
        };
        if (void 0 !== configuration) {
            if (void 0 !== configuration.title) {
                this.configuration.title = configuration.title;
            }
        }
        this.parent = document.body;
        if (void 0 !== parent) {
            this.parent = parent;
        }
        this.element = this.createWin();
        this.windowId = WindowController.windowNumber++;
    }
    WindowController.prototype.createWin = function () {
        var elm, elmC;
        elm = document.createElement("div");
        elm.className = "data_window";
        elmC = document.createElement("span");
        elmC.setAttribute("class", "data_window_title");
        elmC.append(document.createTextNode(this.configuration.title));
        elm.append(elmC);
        elmC = document.createElement("span");
        elmC.setAttribute("class", "close_button");
        elmC.append(document.createTextNode("×")); // Close button
        elmC.onclick=function () {
            console.log("click");
        };
        elm.append(elmC);
        elm.append(document.createElement("br"));
        elmC = document.createElement("div");
        elmC.className = "data_canvas";
        elm.append(elmC);
        this.canvas = elmC;
        this.parent.append(elm);
        $(elm).draggable({
            start: function () {
                $(this).css({ "background": "rgba(210,210,210,0.9)" });
            },
            stop: function () {
                $(this).css({ "background": "rgba(200,200,200,0.9)" });
            }
        });
        return elm;
    };
    WindowController.prototype.innerHTML = function (html) {
        this.canvas.innerHTML = html;
    };
    WindowController.prototype.createElement = function (eleName) {
        var elm = document.createElement(eleName);
        this.canvas.append(elm);
        return elm;
    };
    WindowController.prototype.setTitle = function (titleName) {
        this.configuration.title = titleName;
        this.element.getElementsByClassName("data_window_title")[0].innerText = this.configuration.title;
    };
    WindowController.prototype.getElement = function () {
        return this.element;
    };
    WindowController.prototype.getCanvas = function () {
        return this.canvas;
    };
    WindowController.prototype.close = function () {
        document.getElementById("graphics").removeChild(this.element);
    };
    WindowController.windowNumber = 0;
    return WindowController;
})();
