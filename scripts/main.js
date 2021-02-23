game.addTheme({
    name: "Dark",

    "--background-color": "#222",
    "--accent-1": "#111",
    "--accent-2": "#444",

    "--text-color": "#FFF",
    "--action-highlight": "#FFF1",
});

game.addTheme({
    name: "Light",

    "--background-color": "#FFF",
    "--accent-1": "#BBB",
    "--accent-2": "#666",

    "--text-color": "#000",
    "--action-highlight": "#0003",
});

game.addTab("light", {

    id: "light",
    inventoryOrder: ["wood", "matches"],

    name() {

        let name;

        if (player.light.state >= 80) {
            name = "A Small Campfire";
        } else {
            name = "A Snow Filled Clearing"
        }

        return name;
    },

    startData: {
        unlocked: true,

        inventory: {
            wood: {
                unlocked: false,
                amount: 0,
            },
            matches: {
                unlocked: false,
                amount: 0,
            }
        },

        story: [],

        state: 0,
        actions: ["", "", ""],
        timers: [
            {
                type: "state",
                time: 0,
                id: 0,
            },
        ],
    },

    onLoad() {

        let timer;
        let clone;

        clone = Utils.cloneArray(player.light.timers);
        for (timer of clone) {
            if (timer.type == "action") {
                player.light.timers.splice(clone.indexOf(timer), 1);
            }
        }

    },

    update(diff) {

        let timer;
        let clone;

        clone = Utils.cloneArray(player.light.timers);
        for (timer of clone) {
            if (player.lastTick > timer.time) {
                switch (timer.type) {
                    case "state":
                        this.setState(timer.id);
                        break;
                    case "action":
                        this.doAction(timer.id);
                        break;
                    case "function":
                        timer.id();
                        break;
                }
                player.light.timers.splice(clone.indexOf(timer), 1);
            }
        }

    },

    generateHTML() {

        let story, line;
        let inventory, item;
        let actions, HTML;

        story = "";
        for (line of player.light.story) {
            story  += `
                <span
                    class = 'storyLine'
                >` + line + `
                </span>
            `;
        }

        inventory = "";
        for (item of this.inventoryOrder) {
            inventory += `
                <div
                    class = 'item'
                    id = '` + item + `Div'
                    style = 'display: ` + (player.light.inventory[item].unlocked ? "" : "none") + `'
                >` + Utils.toTitleCase(item) + `:
                    <span
                        id = '` + item + `Amount'
                    >` + Utils.format(player.light.inventory[item].amount) + `
                    </span>
                </div>
            `;
        }

        actions = "";
        for (action = 0; action < player.light.actions.length; action ++) {
            HTML = this.createAction(player.light.actions[action]).HTML;
            if (!HTML) HTML = "";
            actions += `
                <div
                    class = "actionContainer"
                    id = "action` + action + `"
                >` + HTML + `
                </div>
            `;
        }

        return `
            <div class = "row content" id = "lightTab">
                <div class = "column" id = "story">` + story + `</div>
                <div id = "lightCanvas"></div>
                <div class = "column" id = "invAct">
                    <div class = "column" id = "inventory">` + inventory + `</div>
                    <div class = "column" id = "actions">` + actions + `</div>
                </div>
            </div>
        `;

    },

    updateHTML() {

        for (item of this.inventoryOrder) {
            if (player.light.inventory[item].amount > 0) player.light.inventory[item].unlocked = true;
            document.getElementById(item  + "Div").style.display = (player.light.inventory[item].unlocked ? "" : "none");
            document.getElementById(item  + "Amount").innerHTML = Utils.format(player.light.inventory[item].amount);
        }

    },

    addStory(line) {

        player.light.story.push(line);
        document.getElementById("story").innerHTML += `
            <span
                class = 'storyLine'
            >` + line + `
            </span>
        `;

    },

    setState(state = player.light.state) {

        let action;

        switch (state) {
            case 0:
                this.setTimer("state", 2000, 10);
                break;
            case 10:
                this.addStory("I don't know how much longer I can go on for.");
                this.setTimer("state", 2000, 20);
                break;
            case 20:
                this.addStory("I need to stop and rest.");
                this.setTimer("state", 2000, 30);
                break;
            case 30:
                this.addStory("Should make a fire before night comes.");
                this.setTimer("state", 2000, 31);
                break;
            case 31:
                this.addStory("I'll freeze to death otherwise.");
                this.setTimer("state", 2000, 40);
                break;
            
            case 50:
                this.addStory("I hope this isn't too damp.");
                this.setTimer("state", 2000, 60);
                break;
            case 60:
                this.addStory("Only have a few matches left.");
                player.light.inventory.matches.amount = 4;
                this.setTimer("state", 2000, 70);
                break;

            case 80:
                game.updateHeader = true;
                this.addStory("The wood bursts into flames.");
                this.deleteAction(1);
                this.setTimer("state", 2000, 90);
                break;
            case 90:
                this.addStory("Light floods the clearing, but barely illuminates the forest.");
                this.setTimer("state", 5000, 100);
                break;
            case 100:
                this.addStory("Several pairs of eyes peeks out of the darkness. Thank God I made the fire in time.");
                this.setTimer("state", 5000, 110);
                break;
            case 110:
                this.addStory("I must ensure the fire lasts all night.");
                break;
        }

        player.light.state = state;
        action = this.createAction(state);
        if (action) {
            document.getElementById("action" + action.slot).innerHTML = action.HTML;
        }

    },

    createAction(action) {

        let text;
        let slot;

        switch (action.toString()) {
            case "40":
                text = "Forage for wood.";
                slot = 0;
                break;
            case "70":
                text = "Light the fire.";
                slot = 1;
                break;
            case "110":
                text = "Stoke the fire.";
                slot = 1;
        }

        if (text) {
            if (player.light.actions[slot] != action) {
                player.light.actions[slot] = action;
            }
            return {
                slot: slot,
                HTML:`
                    <button
                        class = "action"
                        id = "` + action + `B"
                        onclick = "game.tabs.data.light.doAction('` + action + `A')"
                    >` + text + `
                        <div
                            class = "fill"
                            id = "` + action + `F"
                        >
                        </div>
                    </button>
                `,
            }
        }

        return false;

    },

    deleteAction(slot) {

        player.light.actions[slot] = "";
        document.getElementById("action" + slot).firstElementChild.disabled = true;
        document.getElementById("action" + slot).firstElementChild.style.opacity = 0;
        this.setTimer("function", 500, function() { document.getElementById("action" + slot).innerHTML = ""; });

    },

    doAction(action) {

        let event;

        switch (action) {
            case "40A":
                if (document.getElementById("40B").disabled) break;
                document.getElementById("40B").disabled = true;
                document.getElementById("40F").style.transition = "5000ms linear";
                document.getElementById("40F").style.width = "calc(100% + 4px)";
                this.setTimer("action", 5000, "40B");
                break;
            case "40B":
                document.getElementById("40F").style.transition = "500ms ease-in-out";
                document.getElementById("40F").style.width = "0px";
                player.light.inventory.wood.amount += 1;
                this.setTimer("action", 500, "40C");
                if (player.light.state == 40) this.setTimer("state", 2000, 50);
                break;
            case "40C":
                document.getElementById("40B").disabled = false;
                break;

            case "70A":
                if (document.getElementById("70B").disabled) break;
                document.getElementById("70B").disabled = true;
                document.getElementById("70F").style.transition = "2000ms linear";
                document.getElementById("70F").style.width = "calc(100% + 4px)";
                switch (player.light.inventory.matches.amount) {
                    case 4:
                        event = "70B";
                        break;
                    case 3:
                        event = (Math.random() > 0.5 ? "70C" : "70F");
                        break;
                    case 2:
                        event = (Math.random() > 0.5 ? "70D" : "70F");
                        break;
                    case 1:
                        event = "70F";
                        break;
                }
                player.light.inventory.matches.amount -= 1;
                this.setTimer("action", 2000, event);
                break;
            case "70B":
                document.getElementById("70F").style.transition = "500ms ease-in-out";
                document.getElementById("70F").style.width = "0px";
                this.addStory("Damn! It snapped!");
                this.setTimer("action", 500, "70E");
                break;
            case "70C":
                document.getElementById("70F").style.transition = "500ms ease-in-out";
                document.getElementById("70F").style.width = "0px";
                this.addStory("It won't catch!");
                this.setTimer("action", 500, "70E");
                break;
            case "70D":
                document.getElementById("70F").style.transition = "500ms ease-in-out";
                document.getElementById("70F").style.width = "0px";
                this.addStory("My last match.");
                this.setTimer("action", 500, "70E");
                break;
            case "70E":
                document.getElementById("70B").disabled = false;
                break;
            case "70F":
                document.getElementById("70F").style.transition = "500ms ease-in-out";
                document.getElementById("70F").style.width = "0px";
                player.light.inventory.wood.amount -= 1;
                this.setTimer("state", 0, 80);
                break;

            case "110A":
                if (document.getElementById("110B").disabled) break;
                document.getElementById("110B").disabled = true;
                document.getElementById("110F").style.transition = "10000ms linear";
                document.getElementById("110F").style.width = "calc(100% + 4px)";
                player.light.inventory.wood.amount -= 1;
                this.setTimer("action", 10000, "110B");
                break;
            case "110B":
                document.getElementById("110F").style.transition = "500ms ease-in-out";
                document.getElementById("110F").style.width = "0px";
                this.setTimer("action", 500, "110C");
                break;
            case "110C":
                document.getElementById("110B").disabled = false;
                break;

        }

    },

});