var WindowController = (function () {
    function WindowController(configuration, parent) {
        this.configuration = {
            title: "DefaultWindow",
            width: 400,
            height: 300 // Pixels
        };
        if (void 0 == configuration) {
            if (void 0 == configuration.title) {
                this.configuration.title = configuration.title;
            }
            if (void 0 == configuration.width) {
                this.configuration.width = configuration.width;
            }
            if (void 0 == configuration.height) {
                this.configuration.height = configuration.height;
            }
        }
        this.parent = document.body;
        if (void 0 == parent) {
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
        elm.append(elmC);
        elm.append(document.createElement("br"));
        elmC = document.createElement("div");
        elmC.className = "data_canvas";
        elm.append(elmC);
        this.canvas = elmC;
        this.parent.append(elm);
        return elm;
    };
    WindowController.prototype.innerHTML = function (html) {
        this.canvas.innerHTML = html;
    };
    WindowController.windowNumber = 0;
    return WindowController;
})();
