var Grafika = (function () {
    function Grafika(data, configuration) {
        this.data = { x: [], y: [], length: 0 };
        this.numOfPoints = 100;
        this.withError = false;
        this.configuration = {
            width: 400,
            height: 300,
            padding: 30
        };
        if (void 0 !== configuration) {
            if (void 0 !== configuration.element) {
                this.element = configuration.element;
            }
        }
        if (void 0 !== data) {
            this.setData(data);
            this.draw();
        }
    }
    Grafika.prototype.setElement = function (elm) {
        if (void 0 !== elm) {
            this.element = elm;
        }
    };
    Grafika.prototype.setNumOfPoints = function (num) {
        this.numOfPoints = (num > 2) ? num : 2;
    };
    Grafika.prototype.clear = function () {
        this.canvas.clearRect(0, 0, this.configuration.width, this.configuration.height);
    };
    Grafika.prototype.draw = function () {
        var i = 0;
        var maxX = Math.max.apply(null, this.data.x);
        var minX = Math.min.apply(null, this.data.x);
        var maxY = Math.max.apply(null, this.data.y);
        var minY = Math.min.apply(null, this.data.y);
        if (this.data.length == 0) {
            alerta("Error al representar! Sin datos validos!");
            this.triggerError();
            return Grafika.ERROR.DATA_NO_VALID;
        }
        if (maxX == minX || maxY == minY) {
            alerta("Error al representar! Comprueba los valores en los ejes X e Y!.");
            this.triggerError();
            return Grafika.ERROR.DATA_NO_VALID;
        }
        // EJE X
        // Siempre dividimos en 5 el eje X e Y.
        var separationX = (maxX - minX) / 5;
        var rangePowerX = Math.floor(Math.log(separationX) / Grafika.log10);
        var tickX = Math.ceil((separationX) / Math.pow(10, rangePowerX)) * Math.pow(10, rangePowerX);
        var mminX = tickX * Math.floor(minX / tickX);
        var mmaxX = tickX * Math.ceil(maxX / tickX);
        console.log("SeparacionX = " + mminX + "<=>" + mmaxX);
        var incrX = (this.configuration.width - 2 * this.configuration.padding) / (mmaxX - mminX); // px/number
        var nX = Math.ceil((mmaxX - mminX) / tickX);
        console.log("IncrX=" + incrX + ", nX=" + nX + ", tickX=" + tickX);
        // EJE Y
        // Siempre dividimos en 5 en el eje X e Y.
        var separationY = (maxY - minY) / 5;
        var rangePowerY = Math.floor(Math.log(separationY) / Grafika.log10);
        var tickY = Math.ceil((separationY) / Math.pow(10, rangePowerY)) * Math.pow(10, rangePowerY);
        var mminY = tickY * Math.floor(minY / tickY);
        var mmaxY = tickY * Math.ceil(maxY / tickY);
        console.log("SeparacionY = " + mminY + "<=>" + mmaxY);
        var incrY = (this.configuration.height - 2 * this.configuration.padding) / (mmaxY - mminY); // px/number
        var nY = Math.ceil((mmaxY - mminY) / tickY);
        console.log("IncrY=" + incrY + ", nY=" + nY);
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", "grafikaCanvas");
        this.canvas.setAttribute("width", this.configuration.width);
        this.canvas.setAttribute("height", this.configuration.height);
        this.element.append(this.canvas);
        var t = this.canvas.getContext("2d");
        // REPRESENTACIóN
        t.beginPath();
        // Ejes
        t.moveTo(this.configuration.padding, 0);
        t.lineTo(this.configuration.padding, this.configuration.height - this.configuration.padding);
        t.lineTo(this.configuration.width, this.configuration.height - this.configuration.padding);
        var j = nX + 1;
        var pos;
        var inicioX = this.configuration.padding * 1.5;
        var inicioY = this.configuration.height - this.configuration.padding * 1.5; // From bottom
        t.font = "12px Arial";
        t.textAlign = "center";
        var textNX = mminX;
        var textNY = mminY;
        while (textNX <= mmaxX) {
            pos = inicioX + (textNX - mminX) * incrX;
            console.log(pos + "<=>" + textNX);
            t.moveTo(pos, this.configuration.height - this.configuration.padding);
            t.lineTo(pos, this.configuration.height - this.configuration.padding * 0.8);
            t.fillText(Grafika.redondear(textNX), pos - 8, this.configuration.height - this.configuration.padding * 0.2);
            textNX += tickX;
        }
        while (textNY <= mmaxY) {
            pos = inicioY - (textNY - mminY) * incrY;
            console.log(pos + "<=>" + textNY);
            t.moveTo(this.configuration.padding * 0.8, pos);
            t.lineTo(this.configuration.padding, pos);
            t.fillText(Grafika.redondear(textNY), this.configuration.padding * 0.4, pos + 4);
            textNY += tickY;
        }
        t.stroke();
        t.beginPath();
        var n = this.data.length;
        var posX, posY;
        t.strokeStyle = "#FF0000";
        if (void 0 == this.data.e) {
            while (n--) {
                posX = inicioX + (this.data.x[n] - mminX) * incrX;
                posY = inicioY - (this.data.y[n] - mminY) * incrY;
                // Representar punto
                t.moveTo(posX - 2, posY - 2);
                t.lineTo(posX + 2, posY + 2);
                t.moveTo(posX - 2, posY + 2);
                t.lineTo(posX + 2, posY - 2);
            }
        }
        else {
            while (n--) {
                posX = inicioX + (this.data.x[n] - mminX) * incrX;
                posY = inicioY - (this.data.y[n] - mminY) * incrY;
                // Representar punto
                t.moveTo(posX - 2, posY - 2);
                t.lineTo(posX + 2, posY + 2);
                t.moveTo(posX - 2, posY + 2);
                t.lineTo(posX + 2, posY - 2);
                // Representar errores:
                t.moveTo(posX, posY - 2);
                t.moveTo(posX, posY + this.data.e[n] * incrY);
                t.lineTo(posX, posY - this.data.e[n] * incrY);
                t.moveTo(posX - 2, posY - this.data.e[n] * incrY);
                t.lineTo(posX + 2, posY - this.data.e[n] * incrY);
                t.moveTo(posX - 2, posY + this.data.e[n] * incrY);
                t.lineTo(posX + 2, posY + this.data.e[n] * incrY);
            }
        }
        //medio
        t.stroke();
    };
    Grafika.prototype.setData = function (data) {
        if (void 0 === data.x || void 0 === data.y) {
            return -1; // Error
        }
        this.data.x = data.x;
        this.data.y = data.y;
        if (void 0 === data.length) {
            data.length = data.x.length;
        }
        this.data.length = data.length;
    };
    Grafika.prototype.onError = function (callback) {
        if ("function" !== typeof callback) {
            return false;
        }
        if (this.withError) {
            callback();
            this.withError = false;
        }
        return true;
    };
    Grafika.prototype.triggerError = function () {
        if (void 0 !== this.errorCallback) {
            this.errorCallback();
        }
        else {
            this.withError = true;
        }
    };
    Grafika.log10 = Math.log(10);
    Grafika.ERROR = {
        DATA_NO_VALID: 1
    };
    Grafika.redondear = function (e) { var t = e.toExponential(), a = t.split("e"), o = Math.round(1e14 * parseFloat(a[0])) / 1e14, n = o.toString() + "e" + a[1]; return parseFloat(n); };
    return Grafika;
})();
