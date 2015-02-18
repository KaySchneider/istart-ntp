/**
 * support for the animations
 * i dont use jquery for better 
 * loading performance 
 */
var livetile = function (element) {
    this.element = element;
    this.step = 125; //the scrollspeed. How fast should this element scroll to the next page. Maybe i will implement css3 no steps!
    this.timerid = null;//the id for the timer. This is an system call. No need to touch this
    this.maxMove = this.element.childElementCount; //intern counter how much elements are inside here.
    this.actMove = 0;//what is the actual element wich is current moved
    this.direction = '-';//the current direction. At start down, after the start we turn it to up automatically
    this.startTimer();//let`s go and start the timer
};

/**
 * starts the timeout and the delay
 */
livetile.prototype.startTimer = function () {
    var that = this;
    this.timerid = setTimeout(that.start, 4500,that);
};


/**
 * make the animation
 */
livetile.prototype.start = function (that) {
 //console.log("DF");
    switch(that.direction) {
        case '-':
            if(that.actMove < that.maxMove-2) {
                that.element.style['top'] =  that.element.style['top'].replace('px','') - that.step  + 'px';
                that.actMove++;
            } else {
                that.direction = '+';
                that.startTimer();
            }
            break;
        case '+':
              if(that.actMove != 0) {
                 that.element.style['top'] =  parseInt(that.element.style['top'].replace('px','')) + that.step  + 'px';
                 that.actMove--;
            } else {
                that.direction = '-';
                that.startTimer();
            }
            break;
    }
};