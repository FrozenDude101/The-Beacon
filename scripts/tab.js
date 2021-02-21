class Tab {

    constructor(args = {}) {

        let attr;

        for (attr in args) {
            switch (attr) {
                case "startData":
                    this[attr] = function() { return args[attr]; };
                    break;
                default:
                    this[attr] = args[attr];
            }
        }

    }

    startData() {

        return {};

    }

}   