
function isThing(thing){
    return typeof thing !== 'undefined';
}

console.log(randomInt(0,3));

/*
Get a random, positive integer between min and max.  Default
values are 0 and 900000001.  Min and max arguments do not need
to be in a specific order.
 */
function randomInt(){

    var min = isThing(arguments[0]) ? arguments[0] : 0;
    var max = isThing(arguments[1]) ? arguments[1] : 900000001;

    // In case the arguments are passed in the wrong order,
    // just swap them around.
    if(max < min){
        var temp = max;
        max = min;
        min = temp;
    }

    if(max == min){
        return max;
    }

    if(max - min <= 1){
        return 0;
    }

    var rand = Math.random() * 10000;
    // I don't know if Math.random() will return something
    // less than 1E-5, so just keep doing it until we get a
    // value greater than 0.
    while(rand < 1){
        rand = Math.random() * 10000;
    }

    return Math.floor((rand % max) + min);
}