/**
 *  Developed by David Iglesias Sánchez.
 *  All rights reserved.
 *  
 */
const MAX_ITER_ERROR = 1;
/**
 * Class GradientFit
 * @param {Object} data : Object containing x and y data in a array. Example:
 *      data = {x: [1,2,3], y: [1,2,3]}
 * @param {String} func : String defining the function to be fitted. Example:
 *          func = "a*x*x+b*x+c" will define a quadratic function
 * @param {Object/String} parameters : Parameters as a object or a string with initial values used in function.
 *      Example: 
 *             Object parameters: parameters={a:0, b:1, c: 0}
 *             String parameters: parameters="a=0, b=1, c=0"
 */
function GradientFit(data, func, parameters){
    this.errorInfo = false;
    
    if(void 0 === data.x || void 0 === data.y){
        
        this._throwError({
            text: "X and Y values expected!"
        });
        return;
    }
    this.X = data.x;
    this.Y = data.y;
    // Load function in variable f
    if(void 0 === func){
        this._throwError({
            text: "Function not passed as input."
        })
        return;
    }

    if(void 0 === parameters){
        this._throwError({
            text: "Parameters not passed as input."
        })
        return;
    }

    if("object" === typeof parameters){
        this.parameters=parameters;

    }else if("string" === typeof parameters){
        this.parameters = {};
        let hints = this.parameters;
        parameters.split(",").forEach(function(text){
            let split = text.trim().split("=");
            hints[split[0]] = Number(split[1]);
        });
        
                
    }else{
        this._throwError({
            text: "Parámetros mal escritos!"
        });
    }
    
    this.textfunction = func;
    this.f = this.functionParser(func, this.parameters);
}
    

/**
 * private _epsilon_. Defines the value used to obtain numerical derivatives. 
 * Be careful: both high and tiny values would return bad values.
 */
GradientFit._epsilon_ = 1e-9;


/**
 * private _MAXITERATION_. Defines the maximun number of iterations used to compute
 * the gradient fit. 0 defines not limit (be careful, it may cause infinity loops).
 */

GradientFit._MAXITERATION_ = 10000;

/**
 * private _MINERROR_. Defines the minimun value of error to be reached in order to 
 * stop the gradient descent.
 */

GradientFit._MINERROR_ = 1e-9;

/**
 * Private function: _throwError
 * @param {Object} errorInfo : object containing error information. Example:
 * errorInfo = {
 *  text : (text describing the error)
 * })
 */

GradientFit.prototype._throwError=function(errorInfo){
    if(void 0 !==this.errorCallback){
        this.errorCallback(errorInfo);
    }else{
        this.errorInfo = errorInfo;
    }
}

/**
 * Function: onError
 * @param {function} callback : pass a function to be called when a error occurs.
 * The error info would be passed as arguments to the callback with this information:
 * callback({
 *  text : (text describing the error)
 * })
 */
GradientFit.prototype.onError=function(callback){
    if("function" === typeof callback){
        this.errorCallback = callback;
        if(false !== this.errorInfo){
            this.throwError(this.errorInfo);
            this.errorInfo = false;
        }
    }else{
        throw new Error("Expected a function, "+(typeof callback)+" passed.");
    }
}

/**
 * Function: functionParser
 * @param {String} func             : function to be fitted
 * @param {Object} parameters       : variable parameters
 */
GradientFit.prototype.functionParser = function(func, parameters){
    let spl = func.split(/(\+|\-|\*|\/|\^)/g);
    let i = spl.length;
    while(i--){
        if(void 0 !== parameters[spl[i]]){
            spl[i] = "params[\""+spl[i]+"\"]";
        }
    }
    let parsed_func = spl.join("");
    console.log(parsed_func);
    return new Function("x, params", "return "+parsed_func);
};

/**
 *  Function: quadraticError
 *  This function returns the cuadratic error of the function func with
 *  the parameters passed as arguments.
 *  @param {String} func describing the function 
 *  @param {Object} parameters with the parameters used to compute the gradient
 */
 GradientFit.prototype.quadraticError=function(){
    let i = this.X.length;
    let sum = 0;
    while(i--){
        sum+=Math.pow(this.f(this.X[i], this.parameters)-this.Y[i],2);
    }
    return sum;
};

/** 
 * Function: gradient
 * @param {Float} alpha         : gradient descent rate value 
 *      Good values goes from 0.001-0.01.
 */
 GradientFit.prototype.minGradient=function(alpha){
    
    let grad = {};
    var that = this;

    // Redefining local variables increase the loop time.
    var thatpar=this.parameters;
    var eps=GradientFit._epsilon_;

    Object.entries(thatpar).forEach(function(obj){

        thatpar[obj[0]]+=eps;
        let a = that.quadraticError(thatpar);
        thatpar[obj[0]]-=2*eps;
        a-=that.quadraticError(thatpar);
        grad[obj[0]]= a/2/eps;

        thatpar[obj[0]]+=eps;
        thatpar[obj[0]]-=alpha*grad[obj[0]];
    });
    return this.quadraticError();
}

/**
 *  atanNorm: Tan as squash function (normalized [-1 1])
 */
const atanNorm = x=>{
    return 0.636619*Math.atan(x);
}

/**
 *  Function: iterate
 *  Gradient descent main iteration function. Arguments:
 *  @param {int/float} argum : if argum > 1, treated as maximun iteration number (Default maxIter = 10000)
 *                              if argum<1, trated as minimun error
 */
GradientFit.prototype.iterate=function(argum){
    let min = GradientFit._MINERROR_;
    let maxIter = GradientFit._MAXITERATION_;
    if(void 0 !== argum){
        
        if(argum>1){
            maxIter = argum;
        }else{
            min = Math.abs(argum);

        }
    }

    let err=this.quadraticError();
    let lastErr=err;
    let lastErrDif=1;
    let alpha = 0.001;                      // Arbitrary value, good on most cases

    let startTime=+new Date();
    let errF=0;
    while(maxIter-- && err>min){

        err=this.minGradient(alpha);        // Compute gradient optimization (returns the quadratic error)

        if(lastErr<err && alpha > 1e-5){
            alpha/=2;
        }
        if(lastErr>err && alpha < 0.01){
            alpha*=2;
            if(err>1e9){
                alerta("Ajuste de datos: Valores iniciales lejos de los reales. El ajuste diverge.");
                break;
            }
        }

        if(lastErr==err){
            break;
        }
        
        lastErr = err;
        
    }

    if(maxIter==0){
        return MAX_ITER_ERROR;
    }

    console.log("Time = "+(+new Date()-startTime)/(10000-maxIter));
    console.log("Error="+err+", N = "+(10000-maxIter));
    return this.parameters;
}

/**
 * Function: getFunction
 * Returns the function fitted as a JavaScript function. To parse it, pass the x value.
 */
GradientFit.prototype.getFunction=function(){
    let spl = this.textfunction.split(/(\+|\-|\*|\/|\^)/g);
    let i = spl.length;
    while(i--){
        if(void 0 !== this.parameters[spl[i]]){
            spl[i] = this.parameters[spl[i]];
        }
    }
    let parsed_func = spl.join("");
    console.log(parsed_func);
    return new Function("x", "return "+parsed_func);

}

/**
 * Function: getTextFunction
 * Returns the function fitted as a JavaScript function. To parse it, pass the x value.
 */
GradientFit.prototype.getTextFunction=function(){
    let spl = this.textfunction.split(/(\+|\-|\*|\/|\^)/g);
    let i = spl.length;
    while(i--){
        if(void 0 !== this.parameters[spl[i]]){
            spl[i] = this.parameters[spl[i]];
        }
    }
    return spl.join("");

}