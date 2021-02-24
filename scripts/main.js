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
        actions: [],

        state: 0,
        light: 0,
        timers: [
            {
                type: "story",
                time: 0,
                data: 0,
            },
        ],

        flameTime: 0,
    },

    name() {

        let name;

        if (player.light.state >= 80) {
            name = "A Small Campfire";
        } else {
            name = "A Snow Filled Clearing"
        }

        return name;
    },

    onLoad() {

        let timer;
        let clone;
        let action;

        clone = Utils.cloneArray(player.light.timers);
        for (timer of clone) {
            if (timer.type == "doAction" || timer.type == "function") {
                player.light.timers.splice(clone.indexOf(timer), 1);
            }
        }

        this.addStory("");

        this.updateHTML();

        for (action of player.light.actions) {
            this.setAction(action);
        }

    },

    update(diff) {

        let i;
        let timer;

        for (let i = 0; i < player.light.timers.length; i ++) {
            timer = player.light.timers[i];
            if (player.lastTick > timer.time) {
                switch (timer.type) {
                    case "story":
                        player.light.state = timer.data;
                        this.setState(timer.data);
                        break;
                    case "line":
                        this.addStory(timer.data);
                        break;
                    case "setAction":
                        this.setAction(timer.data);
                        break;
                    case "createAction":
                        this.createAction(timer.data.id, timer.data.slot, timer.data.text, timer.data.time);
                        break;
                    case "deleteAction":
                        this.deleteAction(timer.data);
                        break;
                    case "doAction":
                        this.doAction(timer.data);
                        break;
                    case "function":
                        timer.data();
                        break;
                }
                player.light.timers.splice(player.light.timers.indexOf(timer), 1);
                i --;
            }
        }

    },

    generateHTML() {

        let story, line;
        let inventory, item;
        let actions;

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
        for (action = 0; action < 3; action ++) {
            actions += `
                <div
                    class = "actionContainer"
                    id = "action` + action + `"
                >
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
            document.getElementById(item  + "Amount").textContent = Utils.format(player.light.inventory[item].amount);
        }

    },

    addStory(line) {

        let story;
        let element;

        story = document.getElementById("story");

        if (line) {
            player.light.story.push(line);
            story.innerHTML += `
                <span
                    class = 'storyLine'
                >` + line + `
                </span>
            `;

            element = story.lastElementChild.previousElementSibling;
            if (element) {
                element.style.transitionDuration = "0ms";
                element.style.marginTop = "calc(-0.5em - " + story.lastElementChild.scrollHeight + "px)";
                this.setTimer("function", 0, function() {
                    document.getElementById("story").lastElementChild.previousElementSibling.style.transitionDuration = "500ms";
                    document.getElementById("story").lastElementChild.previousElementSibling.style.marginTop = "0.5em";
                });
            }

        }
        
        for (element of story.children) {

            element.style.opacity = Math.min(1, -2*(element.offsetTop/story.clientHeight)+2);
            if (element.style.opacity <= 0) {
                player.light.story.shift();
            }

        }

    },

    setState(state) {

        switch (state) {

            case 0:
                this.setTimer("story", 2500, 10);
                break;
            case 10:
                this.addStory("I don't know how much longer I can go on for.");
                this.setTimer("story", 2500, 20);
                break;
            case 20:
                this.addStory("I need to stop and rest.");
                this.setTimer("story", 2500, 30);
                break;
            case 30:
                this.addStory("I should make a fire before nightfall.");
                this.setTimer("story", 2500, 40);
                break;
            case 40:
                this.addStory("Can't risk another encounter.");
                this.setTimer("story", 2500, 50);
                break;
            case 50:
                this.addStory("I should be able to find some wood in the forest.");
                this.setAction(50);
                break;

            case 60:
                this.addStory("I hope this wood isn't too damp.");
                this.setTimer("story", 2500, 70);
                break;
            case 70:
                this.addStory("Only have a few matches.");
                player.light.inventory.matches.amount = 4;
                this.setAction(70);
                break;

        }

    },

    setAction(action) {

        let data;

        switch (action) {
            case 50:
                data = {slot: 0, text: "Forage for wood.", time: 5000};
                break;
            case 70:
                data = {slot: 1, text: "Light the fire.", time: 2000};
                break;
            default:
                console.log("Invalid Action ID '" + action + "'");
                return;
        }
        data.id = action;

        if (game.loaded) player.light.actions.push(action);
        if (!document.getElementById("action" + data.slot).children[0]) {
            this.createAction(action, data.slot, data.text, data.time);
        } else {
            this.deleteAction(data.slot);
            this.setTimer("createAction", 500, data)
        }

    },

    createAction(id, slot, text, time) {

        document.getElementById("action" + slot).innerHTML = `
            <button
                class = "action"
                id = "` + id + `A"
                onclick = "game.tabs.data.light.doAction(` + id + `)"
            >` + text + `
                <div
                    class = "fill"
                    id = "` + id + `F"
                </div>
            </button>
        `
        document.getElementById(id + "A").state = 0;
        document.getElementById(id + "A").time = time;

    },

    deleteAction(slot) {

        let element;

        element = document.getElementById("action" + slot).children[0];
        element.disabled = true;
        element.style.transitionDuration = "500ms";
        element.style.opacity = 0;
        this.setTimer("function", 500, function() {
            document.getElementById("action" + slot).innerHTML = "";
        })

    },

    doAction(action) {

        let button, fill;

        button = document.getElementById(action + "A");
        fill = document.getElementById(action + "F");

        if (!button || !fill) return;

        switch (button.state) {

            case 0:
                button.disabled = true;
                fill.style.transition = button.time + "ms linear";
                fill.style.width = "calc(100% + 4px)";
                this.setTimer("doAction", 0, action);
                this.setTimer("doAction", button.time, action);
                break;
            case 2:
                fill.style.transition = "500ms ease-in-out";
                fill.style.width = "0px";
                this.setTimer("doAction", 0, action);
                this.setTimer("doAction", 500, action);
                break;
            case 4:
                button.disabled = false;
                break;

            case 1:
                switch (action) {
                    case 70:
                        button.flag = player.light.inventory.matches.amount == 0;
                        if (player.light.inventory.matches.amount) {
                            player.light.inventory.matches.amount -= 1;
                            if (player.light.inventory.matches.amount == 0) {
                                this.setTimer("line", 500, "My last match.");
                            }
                        } else {
                            this.setTimer("line", 500, "Think I've got some matches round here somewhere.");
                        }
                        break;
                }
                break;

            case 3:
                switch (action) {
                    case 50:
                        player.light.inventory.wood.amount += 1;
                        if (player.light.state == 50) this.setTimer("story", 500, 60);
                        break;
                    case 70:
                        if (button.flag) {
                            player.light.inventory.matches.amount += Math.floor(Math.random()*3) + 1;
                            this.setTimer("line", 500, "Found a few.");
                        } else if (player.light.inventory.matches.amount == 0 || Math.random() > 0.5) {
                            player.light.inventory.wood.amount -= 1;
                            this.deleteAction(1);
                            this.setTimer("line", 500, "The wood bursts into flames.");
                            if (player.light.state == 70) this.setTimer("story", 500, 80);
                        } else {
                            this.setTimer("line", 500, 
                                ["Damn! It snapped!", "It won't catch!", "The wind blew it out!"][Math.floor(Math.random()*3)]);
                        }
                        break;
                }
                break;

        }

        button.state += 1;
        button.state %= 5;

    }

});