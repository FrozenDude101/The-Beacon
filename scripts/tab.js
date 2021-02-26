class Tab {

    startData = {};

    constructor(args = {}) {

        let attr;

        for (attr in args) {
            switch (attr) {
                default:
                    this.setValue(attr, args[attr]);
            }
        }

    }

    setValue(attr, value, func = false) {

        if (func) {
            this[attr] = function() { return value; };
        } else {
            this[attr] = value;
        }

    }

    setTimer(type, time, data) {

        player[this.id].timers.push({
            type: type,
            time: player.lastTick + time,
            data: data,
        })

    }

}   