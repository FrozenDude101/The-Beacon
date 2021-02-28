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
    skipLineTimers: 0,

    inventoryOrder: ["wood", "cloth", "metal", "matches"],

    startData() {

        let inv, item;

        inv = {};
        for (item of game.tabs.data.light.inventoryOrder) {
            inv[item] = {
                unlocked: false,
                amount: 0,
            }
        }

        return {
            unlocked: true,
            highlight: true,

            inventory: inv,

            flameTime: 0,

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
        };
    },

    name() {

        if (player.light.state >= 440) return "A Ruined Campsite";
        else if (player.light.state >= 70) return "The Campfire";
        else return "A Snow Filled Clearing";

    },

    onLoad() {

        let i;
        let timer;
        let action;

        for (i = 0; i < player.light.timers.length; i ++) {
            timer = player.light.timers[i];
            switch (timer.type) {
                case "doAction":
                case "function":
                    player.light.timers.splice(player.light.timers.indexOf(timer), 1);
                    i --;
                    break;
            }
        }

        this.addStory("");

        this.updateHTML();

        for (action of player.light.actions) {
            this.setAction(action);
        }

        if (player.clearing.workers.gatherer.amount) this.setTimer("doAction", 0, 50);
        if (player.clearing.workers.firekeeper.amount) this.setTimer("doAction", 0, 80);

    },

    update(diff) {

        let i;
        let timer;
        let flameLeft;

        if(this.skipLineTimers) this.skipLineTimers += 1;
        this.skipLineTimers %= 3;

        for (i = 0; i < player.light.timers.length; i ++) {
            timer = player.light.timers[i];
            if (player.lastTick > timer.time) {
                switch (timer.type) {
                    case "story":
                        if (this.skipLineTimers) continue;
                        this.skipLineTimers = 1;
                        player.light.state = timer.data;
                        this.setState(timer.data);
                        break;
                    case "line":
                        if (this.skipLineTimers) continue;
                        this.skipLineTimers = 1;
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
                        if (typeof timer.data == "function") {
                            timer.data();
                        }
                        break;
                }
                player.light.timers.splice(player.light.timers.indexOf(timer), 1);
                i--;
            }
        }

        if (player.light.state >= 430) return;

        flameLeft = player.light.flameTime - player.lastTick;
        if (player.light.light != 0 && 0 >= flameLeft) {
            this.addStory("The fire sputters out.");
            this.setAction(70);
            player.light.light = 0;
        } else if (player.light.light != 1 && 0 < flameLeft && flameLeft <= 30000) {
            if (player.light.state == 70) game.updateHeader = true;
            switch (player.light.light) {
                case 0:
                    this.addStory("The wood bursts into flames.");
                    this.setAction(80);
                    break;
                case 2:
                    this.addStory("The flames die down to a simmer.");
                    break;
            }
            player.light.light = 1;
        } else if (player.light.light != 2 && 60000 <= flameLeft && flameLeft <= 90000) {
            if (player.light.state == 80) {
                this.addStory("Snow begins to melt around the fire.");
                player.light.state += 1;
            } else {
                switch (player.light.light) {
                    case 1:
                        this.addStory("The flames roar loudly.");
                        break;
                    case 3:
                        this.addStory("The fire reduces to a slow burn.");
                        break;
                }
            }
            player.light.light = 2;
        } else if (player.light.light != 3 && 120000 <= flameLeft) {
            if (player.light.state == 81) {
                this.setTimer("story", 500, 90);
                player.light.state += 1;
            }
            else this.addStory("The flames tower high.")
            player.light.light = 3;
        }

        if (player.light.state == 261 && (player.light.inventory.wood.amount == 5 || player.light.inventory.metal.amount == 2 || player.light.inventory.cloth.amount == 5)) {
            player.light.state += 1;
            this.setTimer("story", 2500, 270);
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
                    >
                    </span>
                </div>
            `;
        }

        actions = "";
        for (action = 0; action < 4; action ++) {
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
                <div class = "column" id = "invAct">
                    <div class = "column" id = "inventory">` + inventory + `</div>
                    <div class = "column" id = "actions">` + actions + `</div>
                </div>
            </div>
        `;

    },

    updateHTML() {

        let max;
        let bold;

        for (item of this.inventoryOrder) {
            if (player.light.inventory[item].amount > 0) player.light.inventory[item].unlocked = true;
            document.getElementById(item  + "Div").style.display = (player.light.inventory[item].unlocked ? "" : "none");
            max = game.tabs.data.clearing.calcMax(item);
            bold = player.light.inventory[item].amount >= max && max;
            document.getElementById(item  + "Amount").innerHTML = (bold ? "<b>": "") +  Utils.format(player.light.inventory[item].amount) + (max ? "/" + max : "") + (bold ? "</b>": "");
        }

    },

    addStory(line, end = false) {

        let story;
        let element;
        let removed;

        if (player.light.state >= 430 && !end) return;

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
            player.light.highlight = true;

        }
        
        for (element of story.children) {

            element.style.opacity = Math.min(1, -2.25*(element.offsetTop/story.clientHeight)+2);
            if (!removed && element.style.opacity <= 0) {
                player.light.story.shift();
                removed = true;
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
                this.addItem("matches", 4);
                this.setAction(70);
                break;

            case 80:
                this.addStory("I need to keep the fire going all night.");
                break;
            
            case 90:
                this.addStory("I'd best get some rest.");
                this.setAction(90);
                break;
        
            case 100:
                this.addStory("The fire is almost out.");
                break;

            case 110:
                this.addStory("A rustle sounds from the bushes.");
                this.setTimer("story", 2500, 120);
                break;
            case 120:
                this.addStory("I brace for another encounter.");
                this.setTimer("story", 2500, 130);
                break;
            case 130:
                this.addStory("3 bedraggled people stumble out. The first I've seen in days.");
                this.setTimer("story", 2500, 140);
                break;
            case 140:
                this.addStory("They say they saw the light from the fire. Had nowhere else to go.");
                this.setTimer("story", 2500, 150);
                break;
            case 150:
                this.addStory("They ask to stay, and offer their supplies.");
                this.setTimer("story", 2500, 160);
                break;
            case 160:
                this.addStory("More hands are always useful.");
                this.addItem("wood", Math.floor(Math.random()*3) + 1);
                this.addItem("cloth", Math.floor(Math.random()*3) + 5);
                this.addItem("matches", Math.floor(Math.random()*3) + 1);
                player.clearing.unlocked = true;
                player.clearing.workers.free += 3;
                game.updateHeader = true;
                break;

            case 170:
                this.addStory("One survivor mentions an old highway nearby, littered with cars.");
                this.setTimer("story", 2500, 180);
                break;
            case 180:
                this.addStory("A good oppourtunity to get supplies.");
                this.setTimer("story", 2500, 190);
                break;
            case 190:
                this.addStory("I have to be the one to go. The others wouldn't stand a chance.");
                this.setAction(190);
                break;

            case 200:
                this.addStory("I found a lot of useful stuff at the highway.");
                this.setTimer("story", 2500, 210);
                break;
            case 210:
                this.addStory("I could make some tents for the other survivors with the cloth.");
                this.setTimer("story", 2500, 220);
                break;
            case 220:
                this.addStory("It's a miracle they survived this long without one.");
                player.clearing.highlight = true;
                player.clearing.buildings.houses.unlocked = true;
                break;

            case 230:
                this.addStory("At least now they have somewhere to sleep.");
                this.setTimer("story", 2500, 240);
                break;
            case 240:
                this.addStory("They've done a good job keeping the fire going.");
                this.setTimer("story", 2500, 250);
                break;
            case 250:
                this.addStory("I could see it even from the highway.");
                this.setTimer("story", 2500, 260);
                break;
            case 260:
                this.addStory("Maybe I should make another tent. In case more follow the light.");
                break;

            case 270:
                this.addStory("Things are getting a bit cramped.");
                this.setTimer("story", 2500, 280);
                break;
            case 280:
                this.addStory("I should make a couple storage boxes.");
                player.clearing.highlight = true;
                player.clearing.buildings.storage.unlocked = true;
                break;
        
            case 290:
                this.addStory("As if on cue, another survivor stumbles in.");
                this.setTimer("story", 2500, 300);
                player.clearing.workers.free += 1;
                break;
            case 300:
                this.addStory("They look much more prepared.");
                this.setTimer("story", 2500, 310);
                break;
            case 310:
                this.addStory("Perhaps they could join in on scavenging supplies.");
                player.clearing.workers.explorer.unlocked = true;
                player.clearing.highlight = true;
                break;
        
            case 320:
                this.addItem("wood", -Math.ceil(player.light.inventory.wood.amount/2));
                this.addItem("metal", -Math.ceil(player.light.inventory.metal.amount/2));
                this.addItem("cloth", -Math.ceil(player.light.inventory.cloth.amount/2));
                this.addItem("matches", -Math.ceil(player.light.inventory.matches.amount/2));
                player.light.light = 0;
                player.light.flameTime = 0;
                this.addStory("The camp is in ruins.");
                this.setTimer("story", 2500, 330);
                break;
            case 330:
                this.addStory("It must have been attacked while I was gone.");
                this.setTimer("story", 2500, 340);
                break;
            case 340:
                this.addStory("The fire must not have been bright enough.");
                this.setTimer("story", 5000, 350);
                break;
            case 350:
                this.addStory("I should build some defenses.");
                this.setTimer("story", 2500, 360);
                break;
            case 360:
                this.addStory("All this scrap metal could made a crude wall.");
                this.setTimer("story", 2500, 370);
                break;
            case 370:
                this.addStory("Hopefully it will be enough in an emergency.");
                player.clearing.buildings.wall.unlocked = true;
                player.clearing.highlight = true;
                break;
        
            case 380:
                this.addStory("Scratch marks cover the wall.");
                this.setTimer("story", 2500, 390);
                break;
            case 390:
                this.addStory("It barely survived.");
                this.setTimer("story", 2500, 400);
                break;
            case 400:
                this.addStory("I doubt it will survive the night.");
                break;

            case 410:
                this.addStory("Much stronger now.");
                this.setTimer("story", 2500, 420);
                break;
            case 420:
                this.addStory("If the fire is maintained, the night should be safe.");
                this.setAction(420);
                break;
            
            case 430:
                this.deleteAction(0);
                this.deleteAction(1);
                this.deleteAction(2);
                this.deleteAction(3);
                player.clearing.unlocked = false;
                game.updateHeader = true;
                document.getElementById("inventory").style.opacity = 0;
                this.setTimer("story", 2500, 440);
                break;
            case 440:
                document.getElementById("lightTab").style.opacity = 1;
                game.updateHeader = true;
                this.setTimer("story", 2500, 450);
                break;
            case 450:
                this.addStory("A loud thud sounds from outside.", true);
                this.setTimer("story", 2500, 460);
                break;
            case 460:
                this.addStory("I must stay quiet.", true);
                this.setTimer("story", 2500, 470);
                break;
            case 470:
                this.addStory(" ", true);
                this.setTimer("story", 2500, 471);
                break;
            case 471:
                this.addStory(" ", true);
                this.setTimer("story", 2500, 472);
                break;
            case 472:
                this.addStory(" ", true);
                this.setTimer("story", 2500, 473);
                break;
            case 473:
                this.addStory(" ", true);
                this.setTimer("story", 2500, 480);
                break;
            case 480:
                this.addStory("Screams sound from the other tents.", true);
                this.setTimer("story", 2500, 490);
                break;
            case 490:
                this.addStory("A large shadow passes the tent wall.", true);
                this.setTimer("story", 2500, 500);
                break;
            case 500:
                this.addStory(" ", true);
                this.setTimer("story", 2500, 501);
                break;
            case 501:
                this.addStory(" ", true);
                this.setTimer("story", 2500, 510);
                break;
            case 510:
                this.addStory("Silence.", true);
                this.setTimer("story", 5000, 520);
                break;
            case 520:
                this.addStory("Hours pass.", true);
                this.setTimer("story", 5000, 530);
                break;
            case 530:
                this.addStory("Nothing is left.", true);
                this.setTimer("story", 7500, 531);
                break;
            case 531:
                this.addStory(" ", true);
                this.setTimer("story", 7500, 540);
                break;
            case 540:
                this.addStory("The fire is out.", true);
                this.setTimer("story", 7500, 550);
                break;
            case 550:
                document.getElementById("tabHeader").style.opacity = 0;
                document.getElementById("tabHeader").style.transition = "10000ms linear";
                document.getElementById("settingsFooter").style.opacity = 0;
                document.getElementById("settingsFooter").style.transition = "10000ms linear";
                document.getElementById("lightTab").style.opacity = 0;
                document.getElementById("lightTab").style.transition = "10000ms linear";
                this.setTimer("story", 10000, 560);
                break;
            case 560:
                Save.save();

                clearInterval(game.loops.tick);
                clearInterval(game.loops.save);

                document.getElementById("body").innerHTML = `
                    <div
                        class = "column"
                        id = "endgame"
                    >
                        <span
                            id = "thanks"
                        >Thank you for playing!
                        </span>

                        <span
                            id = "time"
                        >You beat the game in ` + Utils.formatTime(player.lastTick - player.firstTick) + `!
                        </span>

                        <br>

                        <span
                            id = "IGJ2021Text"
                        >This game was made as part of the 2021 Incremental Game Jam.
                        </span>
                        <span class = "row">
                            <a
                                id = "IGJ2021Itch"
                                href = "https://itch.io/jam/incremental-game-jam-2"
                                target = "_blank"
                            >Itch.io
                            </a>
                            <span style = "white-space: pre">    </span>
                            <a
                                id = "IGJ2021Discord"
                                href = "https://discord.gg/NbKVeY4v5S"
                                target = "_blank"
                            >Discord
                            </a>
                        </span>

                        <br>

                        <span
                            id = "IGJ2021Text"
                        >Join my server to be notified of updates or to play my other games.
                        </span>
                        <span class = "row">
                            <a
                                id = "IGJ2021Discord"
                                href = "https://discord.gg/YWUqwBSb9M"
                                target = "_blank"
                            >The Beacon Discord
                            </a>
                        </span>

                        <br>

                        <button
                            id = "playAgain"
                            onclick = "Save.reset()"
                        >Play Again?
                        </button>
                    </div>
                `;
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
            case 80:
                data = {slot: 1, text: "Stoke the fire.", time: 10000};
                break;
            case 90:
                data = {slot: 2, text: "Sleep.", time: 5000};
                break;
            case 190:
                data = {slot: 2, text: "Scavenge supplies.", time: 30000};
                break;
            case 420:
                data = {slot: 3, text: "Sleep.", time: 10000};
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
        player.light.actions.splice(player.light.actions.indexOf(parseInt(element.id.slice(0, -1))), 1);

    },

    doAction(action) {

        let button, fill;

        button = document.getElementById(action + "A");
        fill = document.getElementById(action + "F");

        if (!button || !fill) return;

        switch (button.state) {

            default:
                button.state = 0;
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
                        if (player.light.inventory.wood.amount == 0) {
                            this.addStory("Out of wood.");
                            button.flag = 1;
                        } else if (player.light.inventory.matches.amount) {
                            this.addItem("matches", -1);
                            if (player.light.inventory.matches.amount == 0) {
                                this.addStory("My last match.");
                            }
                        } else {
                            this.addStory("Think I've got some matches round here somewhere.");
                            button.flag = 2;
                        }
                        break;
                    case 80:
                        let wood;
                        let keepers;

                        wood = player.light.inventory.wood.amount;
                        if (wood) {
                            keepers = player.clearing.workers.firekeeper.amount;
                            this.addItem("wood", -Math.min(wood, Math.max(1, keepers)));
                            player.light.flameTime += 30000 * Math.min(wood, Math.max(1, keepers));
                            if (player.light.state == 100) this.setTimer("story", 2500, 110);
                        } else {
                            this.addStory("Out of wood.");
                        }
                        break;
                    case 90:
                        if (player.light.light == 3) {
                            document.getElementById("lightTab").style.opacity = 0;
                        } else {
                            this.addStory("I should put some more wood on the fire.");
                            button.flag = true;
                        }
                        break;
                    case 190:
                        if (player.light.state == 310) {
                            this.setTimer("function", 20000, function() {
                                game.tabs.data.light.addStory("A loud roar echos from the campsite.");
                                game.tabs.data.light.setTimer("line", 5000, "I'd best head back quick.");
                            });
                        } else {
                            this.setTimer("function", Math.floor(Math.random()*20000) + 10000, function() {
                                game.tabs.data.light.addStory([
                                    "The fire shines brightly in the distance.",
                                    "Signs of a recent encounter.",
                                    "Scrap metal strewn about.",
                                    "I'd best keep my guard up.",
                                    "Could use the seats as cloth.",
                                    "Surely more survivors can see the fire.",
                                    "The snow crunches underfoot.",
                                    "Some nuts and bolts.",
                                    "Are those bite marks?",
                                    "A good find.",
                                    "The light of the fire is visible even here.",
                                    "The fire towers over the tree tops.",
                                ][Math.floor(Math.random()*12)]);
                            });
                        }
                        break;
                    case 420:
                        if (player.light.light != 0) {
                            document.getElementById("lightTab").style.opacity = 0;
                            this.setTimer("story", 5000, 430);
                        } else {
                            this.addStory("I should put some more wood on the fire.");
                            button.flag = true;
                        }
                        break;
                }
                break;

            case 3:
                switch (action) {
                    case 50:
                        let gatherers;
                        gatherers = player.clearing.workers.gatherer.amount;
                        this.addItem("wood", Math.max(1, gatherers));
                        if (gatherers) { button.state = -1; }
                        if (player.light.state == 50) this.setTimer("story", 500, 60);
                        break;
                    case 70:
                        switch (button.flag) {
                            case 1:
                                break;
                            case 2:
                                this.addItem("matches", Math.floor(Math.random()*3) + 1);
                                this.addStory("Found a few.");
                                break;
                            default:
                                if (player.light.inventory.matches.amount == 0 || Math.random() > 0.5) {
                                    this.addItem("wood", -1);
                                    player.light.flameTime = player.lastTick + 30000;
                                    if (player.light.state == 70) this.setTimer("story", 1000, 80);
                                } else {
                                    this.addStory(["Damn! It snapped!", "It won't catch!", "The wind blew it out!"][Math.floor(Math.random()*3)]);
                                }
                                break;
                        }
                        button.flag = 0;
                        break;
                    case 80:
                        if (player.clearing.workers.firekeeper.amount) button.state = -1;
                        break;
                    case 90:
                        if (!button.flag) {
                            document.getElementById("lightTab").style.opacity = 1;
                            player.light.flameTime = player.lastTick + 30000;
                            this.setTimer("story", 3000, 100);
                            this.deleteAction(2);
                        }
                        button.flag = false;
                        break;
                    case 190:
                        this.addItem("metal", Math.floor(Math.random()*2*Math.max(1, player.clearing.workers.explorer.amount))+1);
                        this.addItem("cloth", Math.floor(Math.random()*4*Math.max(1, player.clearing.workers.explorer.amount))+1);
                        if (player.light.state == 190) this.setTimer("story", 1000, 200);
                        if (player.light.state == 310 && player.clearing.workers.explorer.amount) this.setTimer("story", 1000, 320);
                        if (player.light.state == 370 & player.clearing.buildings.wall.amount) this.setTimer("story", 1000, 380);
                        break;
                    case 420:
                        if (!button.flag) {
                            document.getElementById("lightTab").style.opacity = 1;
                            player.light.flameTime = 0;
                        }
                        button.flag = false;
                        break;
                }
                break;

        }

        button.state += 1;
        button.state %= 5;

    },

    addItem(item, amount, force = false) {

        let max;

        player.light.inventory[item].amount += amount;
        
        max = game.tabs.data.clearing.calcMax(item);
        if (max && !force) {
            player.light.inventory[item].amount = Math.min(Math.max(player.light.inventory[item].amount, 0), max);
        }

    },

});

game.addTab("clearing", {

    id: "clearing",
    
    buildingsOrder: ["houses", "storage", "wall"],
    buildingsData: {
        houses: {
            names: ["Tents", "Huts", "Houses"],
            desc() {
                return "Houses survivors.<br>" + Utils.formatCost(this.cost());
            },
            time: 30000,
            cost() {
                let mult;
                mult = 1.5**player.clearing.buildings.houses.amount;
                return {cloth: Math.ceil(3*mult), wood: Math.ceil(1*mult)};
            },
        },
        storage: {
            names: ["Storage Boxes", "Storage Rooms", "Warehouses"],
            desc() {
                return "Store more resources.<br>" + Utils.formatCost(this.cost());
            },
            time: 15000,
            cost() {
                let mult;
                mult = 1.5**player.clearing.buildings.storage.amount;
                return {wood: Math.ceil(5*mult)};
            },
        },
        wall: {
            names: ["Wall"],
            desc() { return "Avoid more encounters.<br>" + Utils.formatCost(this.cost()); },
            time: 30000,
            cost() {
                mult = 1.5**player.clearing.buildings.wall.amount;
                return {wood: Math.ceil(10*mult**2), metal: Math.ceil(10*mult)};
            }
        }
    },

    workersOrder: ["firekeeper", "gatherer", "explorer"],

    name: "The Clearing",

    startData() {

        let buildings, building;
        let workers, worker;
        
        buildings = {};
        for (building of game.tabs.data.clearing.buildingsOrder) {
            buildings[building] = {
                unlocked: false,
                amount: 0,
                tier: 0,
            };
        }
        
        workers = {free: 0};
        for (worker of game.tabs.data.clearing.workersOrder) {
            workers[worker] = {
                unlocked: false,
                amount: 0,
            };
        }
        workers.gatherer.unlocked = true;
        workers.firekeeper.unlocked = true;

        return {
            unlocked: false,
            highlight: true,

            buildings: buildings,
    
            workers: workers,
    
            timers: [
            ],
        };

    },

    onLoad() {

        let i;
        let timer;
        let built;

        built = [];
        for (i = 0; i < player.clearing.timers.length; i ++) {
            timer = player.clearing.timers[i];
            switch (timer.type) {
                case "build":
                    if (!built.includes(timer.data)) {
                        this.build(timer.data, true);
                        built.push(timer.data);
                    }
                case "function":
                    player.clearing.timers.splice(player.clearing.timers.indexOf(timer), 1);
                    i --;
                    break;
            }
        }

        this.updateHTML();

    },

    update(diff) {

        let i;
        let timer;
        let peopleTimer;

        if (player.light.state >= 430) return;

        peopleTimer = false;
        for (i = 0; i < player.clearing.timers.length; i ++) {
            timer = player.clearing.timers[i];
            if (timer.type == "people") peopleTimer = true;
            if (player.lastTick > timer.time) {
                switch (timer.type) {
                    case "story":
                        player.light.state = timer.data;
                        game.tabs.data.light.setState(timer.data);
                        break;
                    case "line":
                        game.tabs.data.light.addStory(timer.data);
                        break;
                    case "build":
                        this.build(timer.data);
                        break;
                    case "people":
                    case "function":
                        if (typeof timer.data == "function") {
                            timer.data();
                        }
                        break;
                }
                player.clearing.timers.splice(player.clearing.timers.indexOf(timer), 1);
                i --;
            }
        }

        if (player.light.state == 160 && player.clearing.workers.gatherer.amount && player.clearing.workers.firekeeper.amount) {
            player.light.state = 161;
            this.setTimer("story", 1500, 170);
        }

        if (player.light.state >= 340 && 2**player.clearing.buildings.houses.tier*2*player.clearing.buildings.houses.amount > this.totalWorkers() && !peopleTimer) {
            this.setTimer("people", Math.floor(Math.random()*60000)+30000, function () {
                game.tabs.data.light.setTimer("line", 0, [
                    "More survivors have located the light.",
                    "The light has guided more survivors.",
                ][Math.floor(Math.random()*2)]);
                player.clearing.workers.free += Math.floor(Math.random()*2) + 1;
            });
        }

    },

    generateHTML() {

        let buildings, building;
        let col1, col2, col3, col4;

        buildings = "";
        for (building of this.buildingsOrder) {
            buildings += `
                <div
                    class = "row buildingRow"
                    id = "` + building + `Row"
                >
                    <button
                        class = "building"
                        id = "` + building + `B"
                        onclick = "game.tabs.data.clearing.build('` + building + `', false, true)"
                    >
                        <span
                            class = "buildingText"
                            id = "` + building + `Text"
                        >` + Utils.toTitleCase(this.buildingsData[building].names[player.clearing.buildings[building].tier]) + ` (
                            <span
                                class = "buildingAmount"
                                id = "` + building + `Amount"
                            >` + player.clearing.buildings[building].amount + `
                            </span>
                            )
                        </span>
                        <span
                            class = "buildingDesc"
                            id = "` + building + `Desc"
                        >` + Utils.toTitleCase(this.buildingsData[building].desc()) + `
                        </span>
                        <div
                            class = "fill"
                            id = "` + building + `F"
                        </div>
                    </button>
                </div>
            `;
        }

        col1 = `<span class = "workerName">Available Workers</span>`;
        col2 = `<span class = "workerAmount" id = "freeAmount">` + player.clearing.workers.free + `</span>`;
        col3 = ``;
        col4 = ``;
        for (worker of this.workersOrder) {
            col1 += `<span class = "workerName" id = "` + worker + `Name">` + Utils.toTitleCase(worker) + `</span>`;
            col2 += `<span class = "workerAmount" id = "` + worker + `Amount">` + player.clearing.workers[worker].amount + `</span>`;
            col3 += `
                <button
                    class = "workerAdd"
                    id = "` + worker + `Add"
                    onclick = "game.tabs.data.clearing.addWorker('` + worker + `')"
                >+
                </button>`;
            col4 += `
                <button
                    class = "workerSub"
                    id = "` + worker + `Sub"
                    onclick = "game.tabs.data.clearing.subWorker('` + worker + `')"
                >-
                </button>
            `;
        }

        return `
            <div class = "row content" id = "clearingTab">
                <div class = "column" id = "buildings">
                    ` + buildings + `
                </div>
                <div class = "row" id = "workers">
                    <div class = "column">` + col1 + `</div>
                    <div class = "column">` + col2 + `</div>
                    <div class = "column">` + col4 + `</div>
                    <div class = "column">` + col3 + `</div>
                </div>
            </div>
        `;

    },

    updateHTML() {

        let building, buildingData;
        let worker, workerData;

        for (building of this.buildingsOrder) {
            buildingData = player.clearing.buildings[building];
            document.getElementById(building + "Row").style.opacity = (buildingData.unlocked ? 1 : 0);
            document.getElementById(building + "Amount").innerHTML = buildingData.amount;
            document.getElementById(building + "Desc").innerHTML = this.buildingsData[building].desc();
            document.getElementById(building + "B").disabled = !this.canAfford(building);
        }

        document.getElementById("freeAmount").innerHTML = player.clearing.workers.free + "/" + this.totalWorkers();
        for (worker of this.workersOrder) {
            workerData = player.clearing.workers[worker];
            document.getElementById(worker + "Name").style.opacity = (workerData.unlocked ? 1 : 0);
            document.getElementById(worker + "Amount").innerHTML = workerData.amount;
            document.getElementById(worker + "Amount").style.opacity = (workerData.unlocked ? 1 : 0);
            document.getElementById(worker + "Sub").style.opacity = (workerData.unlocked && workerData.amount ? 1 : 0);
            document.getElementById(worker + "Add").style.opacity = (workerData.unlocked && player.clearing.workers.free ? 1 : 0);
        }

    },

    calcMax(item) {

        switch (item) {

            case "cloth":
            case "wood":
                return Math.floor(Math.max(5, 2**player.clearing.buildings.storage.tier * player.clearing.buildings.storage.amount * 10));
            case "metal":
                return Math.floor(Math.max(5, 2**player.clearing.buildings.storage.tier * player.clearing.buildings.storage.amount * 10)/2);
            default:
                return "";

        }

    },

    canAfford(building) {

        let cost;
        let item;

        cost = this.buildingsData[building].cost();
        for (item in cost) {
            if (player.light.inventory[item].amount < cost[item]) return false;
        }

        return true;

    },

    build(building, force = false, clicked = false) {

        let button, fill;
        let cost, item;

        button = document.getElementById(building + "B");
        fill = document.getElementById(building + "F");

        if (force) {
            button = {state: 3}
        }

        if (!button || !fill) return;
        if (fill.disabled && clicked) return;

        switch (button.state) {

            default:
                button.state = 0;
            case 0:
                fill.disabled = true;
                fill.style.transition = this.buildingsData[building].time + "ms linear";
                fill.style.width = "calc(100% + 4px)";
                this.setTimer("build", 0, building);
                this.setTimer("build", this.buildingsData[building].time, building);
                break;
            case 2:
                fill.style.transition = "500ms ease-in-out";
                fill.style.width = "0px";
                this.setTimer("build", 0, building);
                this.setTimer("build", 500, building);
                break;
            case 4:
                fill.disabled = false;
                break;

            case 1:
                cost = this.buildingsData[building].cost();
                for (item in cost) {
                    game.tabs.data.light.addItem(item, -cost[item]);
                }
                break;

            case 3:
                player.clearing.buildings[building].amount += 1;

                if (player.light.state == 220 && building == "houses") game.tabs.data.light.setTimer("story", 2500, 230);
                else if (player.light.state == 260 && building == "houses") player.light.state += 1;

                else if (player.light.state == 280 && building == "storage") player.light.state += 1;
                else if (player.light.state == 281 && building == "storage") game.tabs.data.light.setTimer("story", 250, 290);
                else if (player.clearing.buildings.storage.amount == 7 && building == "storage") game.tabs.data.light.setTimer("line", 250, "There's no more room even for storage boxes.");

                else if (player.light.state == 400 && building == "wall") game.tabs.data.light.setTimer("story", 250, 410);
                break;

        }

        button.state += 1;
        button.state %= 5;

    },

    totalWorkers() {

        let workers, worker;

        workers = player.clearing.workers.free;
        for (worker of this.workersOrder) {
            workers += player.clearing.workers[worker].amount;
        }

        return workers;

    },

    addWorker(worker) {

        if (player.clearing.workers.free == 0) return;
        
        player.clearing.workers.free -= 1;
        player.clearing.workers[worker].amount += 1;

    },

    subWorker(worker) {

        if (player.clearing.workers[worker].amount == 0) return;
        
        player.clearing.workers[worker].amount -= 1;
        player.clearing.workers.free += 1;

    },

});