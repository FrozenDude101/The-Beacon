class Utils {

    // Merges 2 objects.
    // Object 2 replaces Object 1 if appropriate.
    static mergeObjects(obj1, obj2) {

        let obj;
        let attr;
        let usedAttr;

        obj = {};
        usedAttr = [];

        for (attr in obj1) {
            if (obj2 != undefined && obj2[attr] != undefined) {
                usedAttr.push(attr);
                if (Array.isArray(obj1[attr]) && Array.isArray(obj2[attr])) {
                    obj[attr] = Utils.mergeArrays(obj1[attr], obj2[attr]);
                } else if (typeof obj1[attr] == "object" && typeof obj2[attr] == "object") {
                    obj[attr] = Utils.mergeObjects(obj1[attr], obj2[attr]);
                } else {
                    obj[attr] = obj2[attr];
                }
            } else {
                obj[attr] = obj1[attr];
            }
        }
        
        for (let attr in obj2) {
            if (usedAttr.includes(attr)) continue;
            obj[attr] = obj2[attr];
        }

        return obj;

    }

    // Merges 2 arrays.
    static mergeArrays(arr1, arr2) {

        return arr1.concat(arr2);

    }


}