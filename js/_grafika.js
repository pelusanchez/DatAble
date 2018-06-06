function grafika(element, data){

    const log10 = Math.log(10);
    const padding=30;
    const width = 400;
    const height = 300;

    if(void 0 === data.length){
        if(data.x.length === data.y.length){
            data.length = data.x.length;
        }
    }
    const redondear=function(e){var t=e.toExponential(),a=t.split("e"),o=Math.round(1e14*parseFloat(a[0]))/1e14,n=o.toString()+"e"+a[1];return parseFloat(n)};
    

    const numOfPoints = 100;

    console.log(data);
    let i = 0;

    let maxX=Math.max.apply(null,data.x);
    let minX=Math.min.apply(null,data.x);
    let maxY=Math.max.apply(null,data.y);
    let minY=Math.min.apply(null,data.y);
    if(data.length==0){
        alerta("Error al representar! Sin datos validos!");
        return;
    }
    if(maxX==minX || maxY==minY){
        alerta("Error al representar! Comprueba los valores en los ejes X e Y!.");
        return;
    }


    // EJE X

        // Siempre dividimos en 5 el eje X e Y.
        let separationX = (maxX-minX)/5;
        

        let rangePowerX=Math.floor(Math.log(separationX)/log10);
        let tickX = Math.ceil((separationX)/Math.pow(10,rangePowerX))*Math.pow(10,rangePowerX);

        let mminX = tickX*Math.floor(minX/tickX);

        let mmaxX = tickX*Math.ceil(maxX/tickX);
        console.log("SeparacionX = "+mminX+"<=>"+mmaxX);

        let incrX = (width-2*padding)/(mmaxX-mminX);  // px/number
        let nX=Math.ceil((mmaxX-mminX)/tickX);
        console.log("IncrX="+incrX+", nX="+nX+", tickX="+tickX);


    // EJE Y

        // Siempre dividimos en 5 en el eje X e Y.
        let separationY = (maxY-minY)/5;
        

        let rangePowerY=Math.floor(Math.log(separationY)/log10);
        let tickY = Math.ceil((separationY)/Math.pow(10,rangePowerY))*Math.pow(10,rangePowerY);

        let mminY = tickY*Math.floor(minY/tickY);

        let mmaxY = tickY*Math.ceil(maxY/tickY);
        console.log("SeparacionY = "+mminY+"<=>"+mmaxY);

        let incrY = (height-2*padding)/(mmaxY-mminY);  // px/number
        let nY=Math.ceil((mmaxY-mminY)/tickY);
        console.log("IncrY="+incrY+", nY="+nY);


    var e=document.createElement("canvas");
    e.setAttribute("id","grafikaCanvas");
    e.setAttribute("width",width);
    e.setAttribute("height",height);
    element.append(e);
    
    

    
    let t=e.getContext("2d");

    // REPRESENTACIóN
    t.beginPath();
    // Ejes
    t.moveTo(padding,0);
    t.lineTo(padding,height-padding);
    t.lineTo(width,height-padding);

    j = nX+1;
    let pos;

    const inicioX = padding*1.5;
    const inicioY = height-padding*1.5; // From bottom

    t.font = "12px Arial";
    t.textAlign="center"; 

    let textNX=mminX;
    let textNY=mminY;

    while(textNX<=mmaxX){
        
        pos = inicioX+(textNX-mminX)*incrX;
        
        console.log(pos+"<=>"+textNX);

        t.moveTo(pos,height-padding);
        t.lineTo(pos,height-padding*0.8);
        
        t.fillText(redondear(textNX),pos-8,height-padding*0.2);
        textNX+=tickX;

       
        
    }

    while(textNY<=mmaxY){
        pos = inicioY-(textNY-mminY)*incrY;
        
        console.log(pos+"<=>"+textNY);

        t.moveTo(padding*0.8,pos);
        t.lineTo(padding    ,pos);
        
        t.fillText(redondear(textNY),padding*0.4, pos+4);
        textNY+=tickY;
    }

    t.stroke();
    t.beginPath();
    let n=data.length;
    let posX, posY;
    t.strokeStyle="#FF0000";

    if(void 0 == data.e){
        while(n--){
        

            posX = inicioX+(data.x[n]-mminX)*incrX;
            posY = inicioY-(data.y[n]-mminY)*incrY;
            
            // Representar punto
            t.moveTo(posX-2,posY-2);
            t.lineTo(posX+2,posY+2);
            t.moveTo(posX-2,posY+2);
            t.lineTo(posX+2,posY-2);
    
        }
    }else{
        while(n--){
        

            posX = inicioX+(data.x[n]-mminX)*incrX;
            posY = inicioY-(data.y[n]-mminY)*incrY;
            
            // Representar punto
            t.moveTo(posX-2,posY-2);
            t.lineTo(posX+2,posY+2);
            t.moveTo(posX-2,posY+2);
            t.lineTo(posX+2,posY-2);
    
            // Representar errores:
    
            t.moveTo(posX,posY-2);
            t.moveTo(posX,posY+data.e[n]*incrY);
            t.lineTo(posX,posY-data.e[n]*incrY);
    
            t.moveTo(posX-2,posY-data.e[n]*incrY);
            t.lineTo(posX+2,posY-data.e[n]*incrY);
    
            t.moveTo(posX-2,posY+data.e[n]*incrY);
            t.lineTo(posX+2,posY+data.e[n]*incrY);
    
        }

    }
    
    //medio

    t.stroke();

/**
    i=numOfPoints;
    let xStep=(mmaxX-mminX)/numOfPoints;
    let yPoint=0;
    t.beginPath();
    posY = inicioY-(resultData.a*Math.pow((mminX+xStep*i),mValue)-mminY)*incrY;
    let maxYpos=inicioY-(mmaxY-mminY)*incrY;



    posX = inicioX+(mminX+xStep*i-mminX)*incrX;
    posY = inicioY-(resultData.a*Math.pow((mminX+xStep*i),mValue)-mminY)*incrY;

    t.moveTo(posX, posY);
    while(i--){

        posX = inicioX+(mminX+xStep*i-mminX)*incrX;
        posY = inicioY-(resultData.a*Math.pow((mminX+xStep*i),mValue)-mminY)*incrY;
        if(posY<inicioY){
            t.lineTo(posX, posY);
        }

        

    }
    t.stroke();*/

    return e;

}