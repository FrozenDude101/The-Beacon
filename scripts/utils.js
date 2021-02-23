class Utils {

    static cloneObject(obj) {

        let retObj;
        let attr;

        retObj = {};
        for (attr in obj) {
            if (Array.isArray(obj[attr])) {
                retObj[attr] = Utils.cloneArray(obj[attr]);
            } else if (typeof obj[attr] == "object") {
                retObj[attr] = Utils.cloneObject(obj[attr]);
            } else {
                retObj[attr] = obj[attr];
            }
        }

        return retObj;

    }

    static cloneArray(arr) {

        let retArr;
        let item;

        retArr = [];
        for (item of arr) {
            if (Array.isArray(item)) {
                retArr.push(Utils.cloneArray(item));
            } else if (typeof item == "object") {
                retArr.push(Utils.cloneObject(item));
            } else {
                retArr.push(item);
            }
        }

        return retArr;

    }

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
                    obj[attr] = obj2[attr];
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

    static mergeArrays(arr1, arr2) {

        return arr1.concat(arr2);

    }

    static format(number) {

        return number;

    }

    static toTitleCase(string) {

        return string.charAt(0).toUpperCase() + string.slice(1);

    }

    static getValue(attr) {

        if (typeof attr == "function") {
            return attr();
        }
        return attr;

    }

    static getTabValue(tab, value, def) {

        let attr;

        attr = game.tabs.data[tab][value];
        if (attr) {
            return this.getValue(attr);
        }
        return def;

    }

}