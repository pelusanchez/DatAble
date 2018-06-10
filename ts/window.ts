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
class WindowController {
    private windowId;
    private canvas;
    private element;
    private configuration = {
            title : "DefaultWindow"
        };
    private parent;
    private static windowNumber = 0;

    constructor(configuration, parent){
        if(void 0 !== configuration){
            if(void 0 !== configuration.title){
                this.configuration.title = configuration.title;
            }
        }

        this.parent=document.body;
        if(void 0 !== parent){
            this.parent = parent;
        }

        this.element = this.createWin();
        this.windowId = WindowController.windowNumber++;
    }

    private createWin(){
        let elm, elmC;
        elm = document.createElement("div");
        elm.className="data_window";

        elmC=document.createElement("span");
        elmC.setAttribute("class","data_window_title");
        elmC.append(document.createTextNode(this.configuration.title));
        elm.append(elmC);
        
        elmC=document.createElement("span");
        elmC.setAttribute("class","close_button");
        elmC.append(document.createTextNode("×"));    // Close button
        elmC.onclick=(function(){
            this.close();
        }).bind(this);
        elm.append(elmC);

        elm.append(document.createElement("br"));

        elmC=document.createElement("div");
        elmC.className="data_canvas";
        elm.append(elmC);
        this.canvas=elmC;


        this.parent.append(elm);
        $(elm).draggable({
            start: function() {
                $(this).css({"background" : "rgba(210,210,210,0.9)"})
            },
            stop: function() { 
                $(this).css({"background" : "rgba(200,200,200,0.9)"})
            }
        });    
        return elm;
    }

    public innerHTML(html){
        this.canvas.innerHTML = html;
    }

    public createElement(eleName){
        let elm = document.createElement(eleName);
        this.canvas.append(elm);
        return elm;
    }

    public setTitle(titleName){
        this.configuration.title = titleName;
        this.element.getElementsByClassName("data_window_title")[0].innerText=this.configuration.title;
    }

    public getElement(){
        return this.element;
    }

    public getCanvas(){
        return this.canvas;
    }

    public close(){
        document.getElementById("graphics").removeChild(this.element);
    }
}