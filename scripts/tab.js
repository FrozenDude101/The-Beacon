class Tab extends Template {

    constructor(data) {

        super();

        for (let item in data) {
            this.setValue(item, data[item]);
        }

    }

    name() {

        return this.id;

    }

    startData() {

        return {
            unlocked: false,
        };

    }

    load() {}

    createDisplay() {

        return "";

    }

    update(diff) {}

}