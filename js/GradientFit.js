/**
 *  Developed by David Iglesias Sánchez.
 *  All rights reserved.
 *  
 */
const MAX_ITER_ERROR = 1;

function GradientFit(data, func, parameters){
    if(void 0 === data.X || void 0 === data.Y){
        return "Error";
    }
    this.X = data.X;
    this.Y = data.Y;
    // Load function in variable f
    if(void 0 === func){
        return "Function not passed as input.";
    }

    if(void 0 === parameters){
        return "Parameters not passed as input.";
    }
    this.parameters=parameters;
    this.f = this.functionParser(func, parameters);
}
    

GradientFit.epsilon = 1e-9;

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
 *  Function: g
 *  This function returns the cuadratic error of the function func with
 *  the parameters passed as arguments.
 *  @param {String} func describing the function 
 *  @param {Object} parameters with the parameters used to compute the gradient
 */
 GradientFit.prototype.g=function(){
    i = this.X.length;
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
    Object.entries(that.parameters).forEach(function(obj){

        that.parameters[obj[0]]+=GradientFit.epsilon;
        let a = that.g(that.parameters);
        that.parameters[obj[0]]-=2*GradientFit.epsilon;
        a-=that.g(that.parameters);
        grad[obj[0]]= a/2/GradientFit.epsilon;

        that.parameters[obj[0]]+=GradientFit.epsilon;
        that.parameters[obj[0]]-=alpha*grad[obj[0]];
    });
    return this.g();
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
 *  @param {int} maxIter Maximun iteration number
 */
GradientFit.prototype.iterate=function(maxIter){
    let min = 1e-9;
    if(void 0 === maxIter || maxIter<1){
        maxIter = 10000;
    }

    let err=this.g();
    let lastErr=err;
    let lastErrDif=1;
    let alpha = 0.001;                      // Arbitrary value, good on most cases

    let startTime=+new Date();
    let errF=0;
    while(maxIter-- && err>min){

        err=this.minGradient(alpha);        // Compute gradient minimization (returns the error)

        if(lastErr<err && alpha > 1e-5){
            alpha/=2;
        }
        if(lastErr>err && alpha < 0.01){
            alpha*=2;
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