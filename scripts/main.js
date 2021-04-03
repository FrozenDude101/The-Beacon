const EVENT_DATA = {

     10:    new Event({time: 2500,  story: 10,  event: 20}),
     20:    new Event({time: 2500,  story: 20,  event: 30}),
     30:    new Event({time: 2500,  story: 30,  event: 40}),
     40:    new Event({time: 2500,                          action: {id: "walk1", slot: 0}}),

     50:    new Event({time: 1000,  story: 50,              action: {id: "walk2", slot: 3}}),
     60:    new Event({time: 1000,  story: 60,              action: {id: "walk3", slot: 1}}),
     70:    new Event({time: 1000,  story: 70,              action: {id: "walk4", slot: 2}}),

     80:    new Event({time: 1000,  story: 80,  event: 90}),
     90:    new Event({time: 2500,  story: 90,  event: 100}),
    100:    new Event({time: 2500,  story: 100,             action: {id: "wood1", slot: 0}}),

    110:    new Event({time: 1000,  story: 110, event: 120}),
    120:    new Event({time: 2500,  story: 120, event: 130}),

    130:    new Event({             story: 130, event: 140, trigger: () => (player.light.inventory.wood >= 3)}),
    140:    new Event({time: 2500,  story: 140,             action: {id: "light1", slot: 1},    customComplete() {player.light.inventoryUnlocked.matches = true;}}),

    150:    new Event({time: 1000,  story: 150, event: 160}),
    160:    new Event({time: 2500,  story: 160, event: 170}),
    170:    new Event({time: 2500,  story: 170, event: 180}),
    180:    new Event({time: 2500,  story: 180,             action: [{id: "stoke1", slot: 1}, {id: "tent1", slot: 2}]}),

    190:    new Event({time: 1000,  story: 190, event: 200}),
    200:    new Event({time: 2500,  story: 200, event: 210, action: [{id: 0, slot: 0}, {id: "sleep1", slot: 3}],  trigger: () => (game.time <= 180000 || game.time[1] >= 600000)}),

    210:    new Event({                         event: 220, trigger: () => (game.time[1] >= 180000 && game.time[1] <= 600000)}),
    220:    new Event({time: 2500,  story: 220, event: 230}),
    230:    new Event({time: 2500,  story: 230,             action: [{id: "pack1", slot: 0}]}),

    240:    new Event({time: 1000,  story: 240, event: 250, customComplete() {player.light.inventory.wood = 0;}}),
    250:    new Event({time: 2500,  story: 250,             action: [{id: "walk5", slot: 0}]}),

    260:    new Event({time: 1000,  story: 260,     event: 270, action: [{id: 0, slot: 0}]}),
    270:    new Event({time: 1000,  story: 270,     event: 280}),
    280:    new Event({time: 1000,  story: 280,     event: 290, customComplete() {document.getElementById("main").style.opacity = 0}}),
    290:    new Event({time: 5000,                  event: 300, customComplete() {document.getElementById("main").style.opacity = 1; player.timeElapsed += 720000 - (player.timeElapsed) % 720000;}}),
    
    300:    new Event({time: 5000,  story: 300, event: 310}),
    310:    new Event({time: 2500,  story: 310, event: 320}),
    320:    new Event({time: 2500,  story: 320, event: 330}),
    330:    new Event({time: 2500,  story: 330, event: 340}),
    340:    new Event({time: 2500,  story: 340, event: 350}),
    350:    new Event({time: 2500,  story: 350,             action: [{id: "wood3", slot: 0}]}),

    360:    new Event({time: 1000,  story: 360, event: 370}),
    370:    new Event({time: 2500,  story: 370, event: 380}),

    380:    new Event({             story: 380, event: 390, trigger: () => (player.light.inventory.wood >= 3)}),
    390:    new Event({time: 2500,  story: 390,             action: {id: "light2", slot: 1}}),

    400:    new Event({time: 1000,  story: 400, event: 410}),
    410:    new Event({time: 2500,  story: 410, event: 420}),
    420:    new Event({time: 2500,  story: 420,             action: {id: "tent2", slot: 2}}),

    430:    new Event({time: 1000,  story: 430,             action: {id: "sleep2", slot: 3}}),

};

const STORY_DATA = {

    matches1:     "Found some loose in my pocket.",
    matches2:     "A few hiding in my bag.",
    matches3:     "Some fell out my pocket.",

    campfireLit:  "The campfire bursts into flames.",

    fire1:        "The wood crackles and pops.",
    fire2:        "Snow melts around the fire.",
    fire3:        "Smoke rises into the sky.",

    fireNight1:   "Embers dance in the night sky.",
    fireNight2:   "The flames brightly light up the surrounding trees.",

     10:    "I've been walking for days.",
     20:    "No amount of distance feels enough.",
     30:    "I need to keep going.",

     50:    "Snow crunches underfoot.",
     60:    "A fallen tree blocks the way forward.",
     70:    "A river sounds in the distance.",

     80:    "They have been more aggressive since the last camp.",
     90:    "Light is the only deterrent.",
    100:    "I should build a fire before nightfall.",

    110:    "This wood looks dry enough.",
    120:    "A few more pieces should do.",

    130:    "That's enough wood for a healthy campfire.",
    140:    "Think I have a few matches left.",

    150:    "That should keep going for the night.",
    160:    "I'm safe now that they won't come out.",
    170:    "I'll put up my tent, it's much warmer than sleeping on snow.",
    180:    "I could also get some more wood, just to be safe.",

    190:    "That took ages.",
    200:    "I can finally get some rest.",

    220:    "The fire is almost out, but the sun is rising.",
    230:    "I'd best pack up and head out.",

    240:    "I have to leave the wood behind.",
    250:    "Hopefully I find somewhere more comfortable to camp.",

    260:    "What the..",
    270:    "..Ouch..",
    280:    "..Ack..",

    300:    "Urgh what happened?",
    310:    "Where am I?",
    320:    "I must have tripped on a root and fallen down this hill.",
    330:    "I can't continue on.",
    340:    "This will have to do as a new campsite.",
    350:    "I'll have to rest for a few days at least.",

    360:    "This is much harder now.",
    370:    "Still need to get a fire lit.",

    380:    "This will be enough for a larger fire.",
    390:    "I'll keep it going day and night.",

    400:    "I'm all out of medical supplies.",
    410:    "Hopefully a good nights sleep helps a bit.",
    420:    "I'll sent up the tent then head to bed.",

    430:    "I'm exhausted.",

};

const ACTION_DATA = {

    0: new Action(),

    walk1: new Action({
        text: "Continue walking.",
        time: 5000,
        onComplete() {
            Game.light.removeAction(0);
            Game.light.addEvent(50);
        },
    }),
    walk2: new Action({
        text: "Continue walking.",
        time: 5000,
        onComplete() {
            Game.light.removeAction(3);
            Game.light.addEvent(60);
        },
    }),
    walk3: new Action({
        text: "Climb over the tree.",
        time: 10000,
        onComplete() {
            Game.light.removeAction(1);
            Game.light.addEvent(70);
        },
    }),
    walk4: new Action({
        text: "Continue walking.",
        time: 5000,
        onComplete() {
            Game.light.removeAction(2);
            Game.light.addEvent(80);
        },
    }),
    walk5: new Action({
        text: "Continue walking.",
        time: 5000,
        onComplete() {
            if (Math.random(0.25) < 0.25 || game.time[1] >= 360000) {
                Game.light.addEvent(260)
            }
        },
    }),

    wood1: new Action({
        text: "Forage for wood.",
        time: 10000,
        onComplete() {
            player.light.inventoryUnlocked.wood = true;
            player.light.inventory.wood += 1;
            Game.light.addAction("wood2", 0);
            Game.light.addEvent(110);
        },
    }),
    wood2: new Action({
        text: "Forage for wood.",
        time: 10000,
        onComplete() {
            player.light.inventory.wood += 1;
        },
    }),
    wood3: new Action({
        text: "Forage for wood.",
        time: 15000,
        onComplete() {
            player.light.inventory.wood += 1;
            Game.light.addAction("wood4", 0);
            Game.light.addEvent(360);
        },
    }),
    wood4: new Action({
        text: "Forage for wood.",
        time: 15000,
        onComplete() {
            player.light.inventory.wood += 1;
        },
    }),

    light1: new Action({
        text: "Light the fire.",
        time: 5000,
        update(time) {
            if (player.light.inventory.matches == 0 && time == -1) {
                Game.light.addAction("matches1", 1);
            }
        },
        onClick() {
            if (player.light.inventory.wood >= 3) {
                player.light.inventory.wood -= 3;
                player.light.inventory.matches -= 1;
                return true;
            }
            return false;
        },
        onComplete() {
            Game.light.addStory("campfireLit");
            Game.light.removeAction(1);
            Game.light.addEvent(150);
        },
        onCancel() {
            player.light.inventory.wood += 3;
        },
    }),
    matches1: new Action({
        text: "Find some matches.",
        time: 2500,
        update(time) {
            if (player.light.inventory.matches != 0 && time == -1) {
                Game.light.addAction("light1", 1);
            }
        },
        onComplete() {
            player.light.inventory.matches += Math.floor(Math.random() * 3) + 2;
            Game.light.addStory("matches" + (Math.floor(Math.random() * 3) + 1));
            Game.light.addAction("light1", 1);
        },
    }),

    light2: new Action({
        text: "Light the fire.",
        time: 7500,
        update(time) {
            if (player.light.inventory.matches == 0 && time == -1) {
                Game.light.addAction("matches2", 1);
            }
        },
        onClick() {
            if (player.light.inventory.wood >= 3) {
                player.light.inventory.wood -= 3;
                player.light.inventory.matches -= 1;
                return true;
            }
            return false;
        },
        onComplete() {
            Game.light.addStory("campfireLit");
            Game.light.removeAction(1);
            Game.light.addEvent(400);
        },
        onCancel() {
            player.light.inventory.wood += 3;
        },
    }),
    matches2: new Action({
        text: "Find some matches.",
        time: 3750,
        update(time) {
            if (player.light.inventory.matches != 0 && time == -1) {
                Game.light.addAction("light2", 1);
            }
        },
        onComplete() {
            player.light.inventory.matches += Math.floor(Math.random() * 3) + 2;
            Game.light.addStory("matches" + (Math.floor(Math.random() * 3) + 1));
            Game.light.addAction("light2", 1);
        },
    }),

    tent1: new Action({
        text: "Put up the tent.",
        time: 20000,
        onComplete() {
            Game.light.addEvent("190");
            Game.light.removeAction(2);
        },  
    }),
    tent2: new Action({
        text: "Put up the tent.",
        time: 30000,
        onComplete() {
            Game.light.addEvent(430);
            Game.light.removeAction(2);
        },  
    }),

    stoke1: new Action({
        text: "Stoke the fire.",
        time: 10000,
        onClick() {
            if (player.light.inventory.wood > 0) {
                player.light.inventory.wood -= 1;
                return true;
            }
            return false;
        },
        onCancel() {
            player.light.inventory.wood += 1;
        },
    }),
    stoke2: new Action({
        text: "Stoke the fire.",
        time: 15000,
        onClick() {
            if (player.light.inventory.wood > 0) {
                player.light.inventory.wood -= 1;
                return true;
            }
            return false;
        },
        onCancel() {
            player.light.inventory.wood += 1;
        },
    }),

    sleep1: new Action({
        text: "Sleep.",
        time: 7500,
        onClick() {
            document.getElementById("main").style.opacity = 0;
            Game.light.removeAction(1);
            return true;
        },
        onCancel() {
            return true;
        },
        onComplete() {
            document.getElementById("main").style.opacity = 1;
            player.timeElapsed += 720000 - (player.timeElapsed + 300000) % 720000;
            Game.light.removeAction(3);
        },
    }),
    sleep2: new Action(),

    pack1: new Action({
        text: "Pack up.",
        time: 20000,
        onComplete() {
            Game.light.addEvent(240);
            Game.light.removeAction(0);
        },
    }),

};


Game.addTab("light", {

    inventoryOrder: ["matches", "wood"],

    name() {

        switch (player.light.name) {
            default:
            case 0:
                return "A Snow Covered Forest";
            case 1:
                return "A Small Campfire";
        }

    },

    startData() {

        let data = {
            unlocked: true,

            events: [{id: 10, time: 0}],

            name: 0,
            story: [],

            actions: [{id: 0, time: -1, flag: 0}, {id: 0, time: -1, flag: 0}, {id: 0, time: -1, flag: 0}, {id: 0, time: -1, flag: 0}],

            inventory: {},
            inventoryUnlocked: {},
        };

        for (let item of this.inventoryOrder) {
            data.inventory[item] = 0;
            data.inventoryUnlocked[item] = false;
        }
        data.inventory.matches = Math.floor(Math.random() * 3) + 2;

        return data;

    },

    createDisplay(display) {

        let html = "";

        switch (display.deviceState) {

            case 1:

                html += `
                    <div class = "column" style = "height: 100%">
                        <div class = "column light" id = "lightStory">
                `;

                for (let i = 0; i < 20; i ++) {

                    html += `
                        <span class = "lightLine" id = "lightLine` + i + `"></span>
                    `;
                    display.addDynamicElement(["lightLine" + i, "innerHTML", () => (player.light.story[i] ? STORY_DATA[player.light.story[i]] : "")]);
                    display.addDynamicStyle(["lightLine" + i, "display",     () => (player.light.story[i] ? "" : "none")]);
                    display.addDynamicStyle(["lightLine" + i, "opacity",     () => Math.min(1, -2.5 * document.getElementById("lightLine" + i).offsetTop / document.getElementById("lightStory").clientHeight + 2)]);

                }


                html += ` 
                        </div>
                        <div class = "row light" id = "lightActions">
                `;

                for (let i = 0; i < 4; i ++) {
                    html += `
                        <div
                            class = "lightAction"
                            id = "action` + i + `"
                            onclick = "
                                if (player.light.actions[` + i + `].time >= 0) return;
                                if (ACTION_DATA[player.light.actions[` + i + `].id].onClick(player.light.actions[` + i + `].flag)) {
                                    for (let i = 0; i < 4; i ++) {
                                        if (player.light.actions[i].time != -1 && ACTION_DATA[player.light.actions[i].id].onCancel(player.light.actions[` + i + `].flag)) return;
                                        player.light.actions[i].time = -1;
                                    }
                                    player.light.actions[` + i + `].time = 0;
                                }
                            "
                        >
                            <button class = "lightActionText" id = "action` + i + `Text"></button>
                            <div class = "lightActionFill" id = "action` + i + `Fill"></div>
                        </div>
                    `;
                    display.addDynamicStyle(["action" + i, "opacity", () => (player.light.actions[i].id ? 1 : 0)]);
                    display.addDynamicElement(["action" + i + "Text", () => ACTION_DATA[player.light.actions[i].id].text]);
                    display.addDynamicStyle(["action" + i + "Fill", "width", () => Math.max(0, Math.min(1, player.light.actions[i].time / ACTION_DATA[player.light.actions[i].id].time)) * 100 + "%"]);
                }
                
                html += `
                        </div>
                        <div class = "column light" id = "lightItems">
                `;

                for (let item of this.inventoryOrder) {
                    html += `
                        <div
                            class = "lightItem"
                            id = "` + item + `Item"
                        >
                            <span id = "` + item + `Text">` + item[0].toUpperCase() + item.slice(1) + `: <span id = "` + item + `Amount"></span></span>
                        </div>
                    `;
                    display.addDynamicElement([item + "Amount",        () => player.light.inventory[item]]);
                    display.addDynamicStyle([item + "Item", "opacity", () => (player.light.inventoryUnlocked[item] ? 1 : 0)]);
                }

                html += `</div>
                    </div>
                `;

                return html;

            case 2:

        }

    },

    addEvent(id) {

        player.light.events.push({id: id, time: 0});

    },

    addStory(id) {

        player.light.story.push(id);

        for (let i = 0; i < 20; i ++) {
            if (document.getElementById("lightLine" + i).style.opacity <= 0) {
                player.light.story.shift();
            }
        }

    },

    addAction(id, slot) {
        player.light.actions[slot] = {id: id, time: -1, flag: 0};
    },
    removeAction(slot) {
        Game.light.addAction(0, slot);
    },
    setActionFlag(slot, value) {
        player.light.actions[slot].flag = value;
    },

    update(diff) {

        for (let i = 0; i < player.light.actions.length; i ++) {
            if (player.light.actions[i].time >= 0) {
                player.light.actions[i].time += diff;
                if (player.light.actions[i].time > ACTION_DATA[player.light.actions[i].id].time) {
                    ACTION_DATA[player.light.actions[i].id].onComplete(player.light.actions[i].flag);
                    player.light.actions[i].time = -1;
                }
            }
            ACTION_DATA[player.light.actions[i].id].update(player.light.actions[i].time, player.light.actions[i].flag);
        }

        for (let i = 0; i < player.light.events.length; i ++) {
            let event = player.light.events[i];
            event.time += diff
            if (EVENT_DATA[event.id].trigger(event.time)) {
                EVENT_DATA[event.id].onComplete();
                player.light.events.splice(i, 1);
                i --;
            }
            if (EVENT_DATA[event.id].cancel(event.time)) {
                player.light.events.splice(i, 1);
                i --;
            }
            EVENT_DATA[event.id].update(event.time);

        }

    },

});

Game.addTab("clearing", {});