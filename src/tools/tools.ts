import { deepEqual, AssertionError } from "assert";

export function areDeepEqual(o1, o2, logMessage = false) {
    let equal = true;
    try {
        deepEqual(o1, o2);
    }
    catch(e) {
        if (e instanceof AssertionError) {
            if(logMessage)
                console.log(e.message);
            equal = false;
        }
            }
    return equal;
    
    
}

export function calc_col(x) {
    return Math.floor(x/32);
}

export function calc_row(y) {
    return Math.floor(y / 32)
}