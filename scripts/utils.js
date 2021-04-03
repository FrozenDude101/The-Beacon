class Utils {
    // Utility functions for use all across the code.

    static cloneObject(object) {
        // Uses recursion to deep clone an object.
        // object -> Object, the object to be cloned.

        let ret = {};
        for (let key in object) {
            if (Array.isArray(object[key])) {
                ret[key] = Utils.cloneArray(object[key]);
            } else if (typeof object[key] == "object") {
                ret[key] = Utils.cloneObject(object[key]);
            } else {
                ret[key] = object[key];
            };
        }
        return ret;

    }

    static cloneArray(array) {
        // Uses recursion to deep clone an array.
        // array -> Array, the array to be cloned.

        let ret = [];
        for (let item of array) {
            if (Array.isArray(item)) {
                ret.push(Utils.cloneArray(item));
            } else if (typeof item == "object") {
                ret.push(Utils.cloneObject(item));
            } else {
                ret.push(item);
            };
        }
        return ret;

    }

    static mergeObjects(object1, object2) {
        // Uses recursion to merge two objects.
        // Arrays are not merged.
        // object1 -> Object, the default object, takes precedence.
        // object2 -> Object, the object being merged.

        let ret = {};
        for (let key in object1) {
            if (object2[key] != undefined &&
                (!Array.isArray(object1[key]) && typeof object1[key] == "object") &&
                (!Array.isArray(object2[key]) && typeof object2[key] == "object")) {
                    // Only merge if both objects have a non-Array Object at the key.
                    ret[key] = Utils.mergeObjects(object1[key], object2[key]);
            } else {
                ret[key] = object1[key];
            }
        }
        for (let key in object2) {
            if (object1[key] != undefined) {
                // If the key exists in object1, it has been dealt with in the previous for loop.
                continue;
            } else {
                ret[key] = object2[key];
            }
        }
        return Utils.cloneObject(ret);
        // Clones the object to unlink all objects and arrays.

    }

    static formatClock(ms, precision = 6, analogue = false) {

        ms = ms % 86400000;

        let hours = Math.floor(ms / 3600000);
        ms -= hours * 3600000;

        let minutes = Math.floor(ms / 60000);
        ms -= minutes * 60000;

        let seconds = Math.floor(ms / 1000);

        let post = "";
        if (analogue) {
            post = " " + (hours >= 12 ? "PM" : "AM");
            hours %= 12;
            if (post == " PM" && hours == 0) hours = 12;
        }

        switch (precision) {

            case 0:
                hours = hours.toString();
                hours = "0".repeat(Math.max(0, 2 - hours.length)) + hours;
                return hours + ":00" + post;
            case 1:
                minutes = Math.floor(minutes / 30) * 30;
            case 2:
                minutes = Math.floor(minutes / 10) * 10;
            case 3:
                hours = hours.toString();
                hours = "0".repeat(Math.max(0, 2 - hours.length)) + hours;
                minutes = minutes.toString();
                minutes = "0".repeat(Math.max(0, 2 - minutes.length)) + minutes;
                return hours + ":" + minutes + post;
            case 4:
                seconds = Math.floor(seconds / 30) * 30;
            case 5:
                seconds = Math.floor(seconds / 10) * 10;
            default:
                hours = hours.toString();
                hours = "0".repeat(Math.max(0, 2 - hours.length)) + hours;
                minutes = minutes.toString();
                minutes = "0".repeat(Math.max(0, 2 - minutes.length)) + minutes;
                seconds = seconds.toString();
                seconds = "0".repeat(Math.max(0, 2 - seconds.length)) + seconds;
                return hours + ":" + minutes + ":" + seconds + post;



        }

    }

}