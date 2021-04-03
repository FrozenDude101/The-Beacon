class Template {

    setValue(id, data) {

        if (typeof data == "function") {
            this[id] = data;
        } else {
            this[id] = data;
        }

    }

}

class Event extends Template {
    
    story = false;
    // A storyline to be added when the event is completed.
    event = false;
    // An event to be added when the event is completed.
    action = false;
    // An action and slot to set when the event is completed.
    // {id, slot}
    
    constructor(data) {

        super();

        for (let item in data) {
            this.setValue(item, data[item]);
        }

        if (this.time) {
            this.trigger = (time) => time > this.time;
        }
        // If a time is given, the event completes once a set amount of time has passed.

    }

    trigger() {

        return true;

    }
    // Determines when the event is completed.

    onComplete() {

        if (this.story) {
            if (Array.isArray(this.story)) {
                for (let story of this.story) {
                    Game.light.addStory(story);
                }
            }
            Game.light.addStory(this.story);
        }
        if (this.event) {
            if (Array.isArray(this.event)) {
                for (let event of this.event) {
                    Game.light.addEvent(event);
                }
            }
            Game.light.addEvent(this.event);
        }
        if (this.action) {
            if (Array.isArray(this.action)) {
                for (let action of this.action) {
                    Game.light.addAction(action.id, action.slot);
                }
            }
            Game.light.addAction(this.action.id, this.action.slot);
        }
        this.customComplete();

    }
    // Called when the event is completed.
    // Sets story, events, and actions.

    customComplete() {}
    // Additional things to be executed on completion.

    update(time) {}
    // Called every tick.

    cancel() {

        return false;

    }
    // Cancels the event.

}

class Action extends Template {

    text = "";
    // The text to appear on the button.
    time = 0;
    // The time it takes to complete the action in ms.
    
    constructor(data) {

        super();

        for (let item in data) {
            this.setValue(item, data[item]);
        }

    }

    onAdd() {}
    // Called when the action is added.

    onClick() {
        return true;
    }
    // Called when the action is clicked.

    onComplete() {}
    // Called when the action is completed.

    onCancel() {}
    // Called when the action is cancelled.

    update(time, flag) {}
    // Called every tick.
    
}