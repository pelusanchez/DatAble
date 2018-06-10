class Grafika {
    private data={x: [], y:[], length: 0};
    private element;
    private canvas;
    private static log10 = Math.log(10);
    private numOfPoints=100;
    private static ERROR = {
        DATA_NO_VALID : 1
    }

    private withError = false;
    private errorCallback;

    private configuration = {
        width: 400,
        height:300,
        padding: 30
    }

    constructor(data, configuration){
        if(void 0 !== configuration){
            if(void 0!== configuration.element){
                this.element = configuration.element;
            }
        }
        if(void 0 !== data){
            this.setData(data);
            this.draw();
        }
    }

    public setElement(elm){
        if(void 0 !== elm){
            this.element = elm;
        }
    }

    public setNumOfPoints(num){
        this.numOfPoints = (num>2)? num : 2;
    }
    
    public clear(){
        this.canvas.clearRect(0,0,this.configuration.width,this.configuration.height);
    }

    public draw(){
        let i = 0;

        let maxX=Math.max.apply(null,this.data.x);
        let minX=Math.min.apply(null,this.data.x);
        let maxY=Math.max.apply(null,this.data.y);
        let minY=Math.min.apply(null,this.data.y);
        
        if(this.data.length==0){
            this.triggerError({
                error : Grafika.ERROR.DATA_NO_VALID,
                text: "Error al representar! Sin datos validos!"});
            return Grafika.ERROR.DATA_NO_VALID;
        }
        if(maxX==minX || maxY==minY){
            
            this.triggerError({
                error: Grafika.ERROR.DATA_NO_VALID,
                text: "Error al representar! Comprueba los valores en los ejes X e Y!.",
            });
            return Grafika.ERROR.DATA_NO_VALID;
        }
            // EJE X

        // Siempre dividimos en 5 el eje X e Y.
        let separationX = (maxX-minX)/5;
        

        let rangePowerX=Math.floor(Math.log(separationX)/Grafika.log10);
        let tickX = Math.ceil((separationX)/Math.pow(10,rangePowerX))*Math.pow(10,rangePowerX);

        let mminX = tickX*Math.floor(minX/tickX);

        let mmaxX = tickX*Math.ceil(maxX/tickX);
        console.log("SeparacionX = "+mminX+"<=>"+mmaxX);

        let incrX = (this.configuration.width-2*this.configuration.padding)/(mmaxX-mminX);  // px/number
        let nX=Math.ceil((mmaxX-mminX)/tickX);
        console.log("IncrX="+incrX+", nX="+nX+", tickX="+tickX);


    // EJE Y

        // Siempre dividimos en 5 en el eje X e Y.
        let separationY = (maxY-minY)/5;
        

        let rangePowerY=Math.floor(Math.log(separationY)/Grafika.log10);
        let tickY = Math.ceil((separationY)/Math.pow(10,rangePowerY))*Math.pow(10,rangePowerY);

        let mminY = tickY*Math.floor(minY/tickY);

        let mmaxY = tickY*Math.ceil(maxY/tickY);
        console.log("SeparacionY = "+mminY+"<=>"+mmaxY);

        let incrY = (this.configuration.height-2*this.configuration.padding)/(mmaxY-mminY);  // px/number
        let nY=Math.ceil((mmaxY-mminY)/tickY);
        console.log("IncrY="+incrY+", nY="+nY);


        this.canvas=document.createElement("canvas");
        this.canvas.setAttribute("id","grafikaCanvas");
        this.canvas.setAttribute("width",this.configuration.width);
        this.canvas.setAttribute("height",this.configuration.height);
        this.element.append(this.canvas);
        
        

        
        let t=this.canvas.getContext("2d");

        // REPRESENTACIóN
        t.beginPath();
        // Ejes
        t.moveTo(this.configuration.padding,0);
        t.lineTo(this.configuration.padding,this.configuration.height-this.configuration.padding);
        t.lineTo(this.configuration.width,this.configuration.height-this.configuration.padding);

        let j = nX+1;
        let pos;

        const inicioX = this.configuration.padding*1.5;
        const inicioY = this.configuration.height-this.configuration.padding*1.5; // From bottom

        t.font = "12px Arial";
        t.textAlign="center"; 

        let textNX=mminX;
        let textNY=mminY;

        while(textNX<=mmaxX){
            
            pos = inicioX+(textNX-mminX)*incrX;
            
            console.log(pos+"<=>"+textNX);

            t.moveTo(pos,this.configuration.height-this.configuration.padding);
            t.lineTo(pos,this.configuration.height-this.configuration.padding*0.8);
            
            t.fillText(Grafika.redondear(textNX),pos-8,this.configuration.height-this.configuration.padding*0.2);
            textNX+=tickX;

        
            
        }

        while(textNY<=mmaxY){
            pos = inicioY-(textNY-mminY)*incrY;
            
            console.log(pos+"<=>"+textNY);

            t.moveTo(this.configuration.padding*0.8,pos);
            t.lineTo(this.configuration.padding    ,pos);
            
            t.fillText(Grafika.redondear(textNY),this.configuration.padding*0.4, pos+4);
            textNY+=tickY;
        }

        t.stroke();
        t.beginPath();
        let n=this.data.length;
        let posX, posY;
        t.strokeStyle="#FF0000";

        if(void 0 == this.data.e){
            while(n--){
            

                posX = inicioX+(this.data.x[n]-mminX)*incrX;
                posY = inicioY-(this.data.y[n]-mminY)*incrY;
                
                // Representar punto
                t.moveTo(posX-2,posY-2);
                t.lineTo(posX+2,posY+2);
                t.moveTo(posX-2,posY+2);
                t.lineTo(posX+2,posY-2);
        
            }
        }else{
            while(n--){
            

                posX = inicioX+(this.data.x[n]-mminX)*incrX;
                posY = inicioY-(this.data.y[n]-mminY)*incrY;
                
                // Representar punto
                t.moveTo(posX-2,posY-2);
                t.lineTo(posX+2,posY+2);
                t.moveTo(posX-2,posY+2);
                t.lineTo(posX+2,posY-2);
        
                // Representar errores:
        
                t.moveTo(posX,posY-2);
                t.moveTo(posX,posY+this.data.e[n]*incrY);
                t.lineTo(posX,posY-this.data.e[n]*incrY);
        
                t.moveTo(posX-2,posY-this.data.e[n]*incrY);
                t.lineTo(posX+2,posY-this.data.e[n]*incrY);
        
                t.moveTo(posX-2,posY+this.data.e[n]*incrY);
                t.lineTo(posX+2,posY+this.data.e[n]*incrY);
        
            }

        }
        
        //medio

        t.stroke();
    }

    public setData(data){
        if(void 0 === data.x || void 0 === data.y){
            return -1;                      // Error
        }
        this.data.x = data.x;
        this.data.y = data.y;
        if(void 0 === data.length){
            data.length = data.x.length;
        }
        this.data.length= data.length;
    }

    public onError(callback){
        if("function" !== typeof callback){
            return false;
        }

        if(this.withError!==false){
            callback(this.withError);
            this.withError=false;
        }
        return true;
        
    }
    private triggerError(errorData){
        if(void 0 !== this.errorCallback){
            this.errorCallback(errorData);
        }else{
            this.withError=errorData;
        }
    }

    private static redondear=function(e){var t=e.toExponential(),a=t.split("e"),o=Math.round(1e14*parseFloat(a[0]))/1e14,n=o.toString()+"e"+a[1];return parseFloat(n)};

}