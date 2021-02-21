var game;

class Game {

    tabs = {};
    themes = [];
    loops = {};

    unlocked = [];

    updateHeader = false;
    updateFooter = false;
    paused = false;

    footerContent = [
        {
            name: "tickInterval",
            type: "slider",
            text() {
                return "Target: " + Math.ceil(1000/player.tickInterval) + " TPS";
            },
            range: [1, 30],
            func: "game.setTickInterval",
        },
        {
            name: "saveInterval",
            type: "slider",
            text() {
                return "Autosave every " + Math.ceil(player.saveInterval/1000) + "s";
            },
            range: [1, 10],
            func: "game.setSaveInterval",
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
            text: "IGJ2021",
            link: "https://discord.gg/4JdncDzr",
        },
    ];

    // When a save is loaded.
    load() {

        this.createLoops();
        this.changeTheme();

        Display.updateHeader();
        Display.updateFooter();

        this.setActiveTab();

    }

    // Resets/Creates the save and main loops.
    createLoops() {

        clearInterval(this.loops.tick);
        clearInterval(this.loops.save);

        this.loops.tick = setInterval(Game.loop, player.tickInterval);
        this.loops.save = setInterval(Save.save, player.saveInterval);

    }

    // The main loop, called every tick.
    static loop() {

        if (game.paused) return;

        Display.update();

    }

    setTickInterval(value) {

        player.tickInterval = 1000/value;
        document.getElementById("tickInterval").innerHTML = "Target: " + Math.floor(value) + " TPS";
        this.createLoops();

    }

    setSaveInterval(value) {

        player.saveInterval = value*1000;
        document.getElementById("saveInterval").innerHTML = "Autosave every " + Math.ceil(player.saveInterval/1000) + "s";
        this.createLoops();

    }

    // Adds a theme.
    addTheme(data) {

        this.themes.push(data);

    }

    // Updates values to the current theme.
    changeTheme() {

        let root;
        let theme;

        root = document.documentElement;
        theme = this.themes[player.theme];

        for (let value in theme) {
            root.style.setProperty(value, theme[value]);
        }

    }

    // Changes the theme to the next theme.
    nextTheme() {
        
        player.theme += 1;
        player.theme %= game.themes.length;
        this.changeTheme();
        this.updateFooter = true;

    }

    // Adds a tab.
    addTab(id, data) {

        this.tabs[id] = new Tab(data);
        player = Utils.mergeObjects(Save.getStartPlayer(), player);

    }

    // Sets the active tab.
    setActiveTab(tab = player.activeTab) {

        let activeTab;

        player.activeTab = tab;
        activeTab = document.getElementsByClassName("activeTab")[0];
        if (activeTab) activeTab.classList.remove("activeTab");
        document.getElementById(tab + "Tab").classList.add("activeTab");

    }

}

game = new Game();