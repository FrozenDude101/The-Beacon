var game;

class Game {

    tabs = {
        order: [],
        data: {},
    };
    themes = {
        order: [],
        data: {},
    };
    loops = {};

    unlocked = [];

    updateHeader = true;
    updateFooter = true;

    loaded = false;
    paused = false;

    footerContent = [
        {
            name: "save",
            type: "button",
            text: "Export",
            func: "Save.save",
        },
        {
            name: "load",
            type: "button",
            text: "Import",
            func: "Save.load",
        },
        {
            name: "reset",
            type: "button",
            text: "Reset",
            func: "Save.reset",
        },
        {
            name: "tickInterval",
            type: "expand",
            text() {
                return "Target: " + Math.ceil(1000/player.tickInterval) + " TPS";
            },
            components: [
                {
                    name: "",
                    type: "slider",
                    range: [5, 30],
                    func: "game.setTickInterval",
                    value() {
                        return Math.ceil(1000/player.tickInterval);
                    },
                },
            ],
        },
        {
            name: "saveInterval",
            type: "expand",
            text() {
                return (player.saveInterval == 0 ? "Autosave (Off)" : "Autosave every " + Math.ceil(player.saveInterval/1000) + "s");
            },
            components: [
                {
                    name: "",
                    type: "slider",
                    range: [0, 10],
                    func: "game.setSaveInterval",
                    value() {
                        return Math.ceil(player.saveInterval/1000);
                    },
                },
            ],
        },
        {
            name: "theme",
            type: "button",
            text: "Change Theme",
            func: "game.nextTheme",
        },
        {
            name: "discordLink",
            type: "link",
            text: "IGJ 2021 Discord",
            link: "https://discord.gg/4JdncDzr",
        },
        {
            name: "discordLink2",
            type: "link",
            text: "The Beacon Discord",
            link: "https://discord.gg/4JdncDzr",
        },
    ];

    // When a save is loaded.
    load() {

        let tab;

        this.loaded = false;

        this.createLoops();
        this.changeTheme();

        document.getElementById("body").innerHTML = `
            <header
                class = "row"
                id = "tabHeader"
            ></header>
            <main
                id = "content"
            ></main>
            <footer
                class = "row"
                id = "settingsFooter">
            </footer>
        `;

        for (tab of this.tabs.order) {
            document.getElementById("content").innerHTML += this.tabs.data[tab].generateHTML();
        }

        Display.update(true);

        this.setActiveTab();

        for (tab of this.tabs.order) {
            this.tabs.data[tab].onLoad();
        }

        this.loaded = true;
    }

    // Resets/Creates the save and main loops.
    createLoops() {

        clearInterval(this.loops.tick);
        clearInterval(this.loops.save);

        this.loops.tick = setInterval(Game.loop, player.tickInterval);
        this.loops.save = (player.saveInterval ? setInterval(Save.save, player.saveInterval) : null);

    }

    // The main loop, called every tick.
    static loop() {

        let diff;
        let tab;

        diff = (Date.now() - player.lastTick)/1000;

        if (game.paused) return;

        for (tab of game.tabs.order) {
            if (player[tab].highlight && tab != player.activeTab) {
                document.getElementById(tab + "TabButton").style.textShadow = "0em 0em 1em var(--text-color)";
            } else {
                player[tab].highlight = false;
                document.getElementById(tab + "TabButton").style.textShadow = "";
            }
            game.tabs.data[tab].update(diff);
        }

        Display.update();
        
        player.lastTick = Date.now();

    }

    setTickInterval(value) {

        player.tickInterval = 1000/value;
        document.getElementById("tickInterval").innerHTML = "Target: " + Math.floor(value) + " TPS";
        this.createLoops();

    }

    setSaveInterval(value) {

        player.saveInterval = value*1000;
        document.getElementById("saveInterval").innerHTML = (player.saveInterval == 0 ? "Autosave (Off)" : "Autosave every " + Math.ceil(player.saveInterval/1000) + "s");
        this.createLoops();

    }

    // Adds a theme.
    addTheme(data) {

        this.themes.order.push(data.name);
        this.themes.data[data.name] = data;

    }

    // Updates values to the current theme.
    changeTheme() {

        let root;
        let theme;

        root = document.documentElement;
        theme = this.themes.data[this.themes.order[player.theme]];

        for (let value in theme) {
            root.style.setProperty(value, theme[value]);
        }

    }

    // Changes the theme to the next theme.
    nextTheme() {
        
        player.theme += 1;
        player.theme %= game.themes.order.length;
        this.changeTheme();
        this.updateFooter = true;

    }

    // Adds a tab.
    addTab(id, data) {

        this.tabs.order.push(id);
        this.tabs.data[id] = new Tab(data);
        player = Utils.mergeObjects(Save.getStartPlayer(), player);
        if (this.loaded) {
            document.getElementById("body").innerHTML += this.tabs.data[id].generateHTML();
        }

    }

    // Sets the active tab.
    setActiveTab(tab = player.activeTab) {

        let activeTab;
        let element;
        
        activeTab = document.getElementsByClassName("activeTabButton")[0];
        if (activeTab) activeTab.classList.remove("activeTabButton");
        activeTab = document.getElementById(tab + "TabButton");
        if (activeTab) activeTab.classList.add("activeTabButton");

        element = document.getElementById(player.activeTab + "Tab");
        if (element) {
            element.style.zIndex = 0;
            element.style.opacity = 0;
            element.style.transition = "1000ms ease-in-out";
            element.style.left = "-100vw";
        }
        element = document.getElementById(tab + "Tab");
        if (element) {
            element.style.zIndex = 1;
            element.style.opacity = 1;
            element.style.transition = "1000ms ease-in-out";
            element.style.left = "0px";
        }

        player.activeTab = tab;

        this.updateMain = true;

    }

}

game = new Game();