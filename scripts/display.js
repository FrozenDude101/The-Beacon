class Display {

    dHTML = [];
    dStyle = [];

    deviceState;
    
    tabMenu;
    timeTab;
    settingsMenu;

    constructor() {

        let width = document.documentElement.clientWidth;
        this.deviceState = (width >= 360 || player.skipSmallWarning) + (width >= 720);
        // Determines if the device is a mobile or not.

        document.getElementById("body").innerHTML = `
            <header id = "header"></header>
            <main id = "main"></main>
            <footer id = "footer"></footer>
        `;

        let header = "";
        let footer = "";

        switch (this.deviceState) {

            default:
            case 0:
                // < 360px wide.
                // Displays a warning that the screen is small, and might not fit the contents of the game.
                document.getElementById("body").innerHTML = `
                    <div
                        class = "column"
                        id = "smallWarningDiv"
                    >
                        <span id = "smallWarningTitle">Warning!</span>
                        <span>Your display is very small.</span>
                        <span>You can continue in mobile mode, but it might not be able to fit all the content.</span>
                        <span>Join the <a id = "smallWarningInvite" href = "https://discord.gg/qcXwBYSBr3" target = "_blank">Discord</a> for more help.</span>
                        <button
                            id = "smallWarningButton"
                            onclick = "player.skipSmallWarning = true; Save.save(); Save.load();"
                        >Continue Anyway
                        </button>
                    </div>
                `;
                break;

            case 1:
                // < 720px wide, typically mobile phones.
                // Creates the header and footer for the vertical design.
                header += `
                    <div class = "reverseColumn" id = "tabColumn">
                        <button
                            class = "row tabButton"
                            onclick = "game.display.toggleTabMenu()"
                        >
                            <span id = "activeTab"></span><span id = "tabArrow">▼</span>
                        </button>
                `;

                this.addDynamicElement(["activeTab",                () => Game[player.activeTab].name()]);
                this.addDynamicStyle(["tabArrow", "transform",      () => "rotate(" + (game.display.tabMenu ? -180 : 0) + "deg)"]);
                this.addDynamicStyle(["tabArrow", "opacity",        () => (player.clearing.unlocked ? 1 : 0)]);

                for (let tab of Game.tabs) {
                    header += `
                        <button
                            class = "tabButton"
                            onclick = "game.changeActiveTab('` + tab + `'); game.display.toggleTabMenu();"
                            id = "` + tab + `tabButton"
                        >` + tab + `</button>
                    `;
                    this.addDynamicElement([tab + "tabButton",          () => Game[tab].name()]);
                    this.addDynamicStyle([tab + "tabButton", "display", () => (!player[tab].unlocked || player.activeTab == tab ? "none" : "block")])
                }

                header += `
                    </div>
                    <img
                        id = "timeImage"
                        src = "images/Day.png"
                        onclick = "game.display.toggleTimeTab();"
                    ></img>
                    <div
                        id = "currentTime"
                        onclick = "game.display.toggleTimeTab();"
                    ></div>
                `;
                this.addDynamicElement(["currentTime",      () => "Day " + game.time[0] + " - " + Utils.formatClock(game.time[1] * 120, 2, player.analogueTime)]);
                this.addDynamicElement(["timeImage", "src", () => "images/" + (game.time[1] > 180000 && game.time[1] < 600000 ? "Day" : "Night") + ".png"]);

                document.getElementById("header").innerHTML = header;

                for (let tab of Game.tabs) {
                    document.getElementById("main").innerHTML += `
                        <div class = "tab" id = "` + tab + `Tab">
                        ` + Game[tab].createDisplay(this); + `
                        </div>
                    `;
                    this.addDynamicStyle([tab + "Tab", "opacity", () => (player.activeTab == tab ? 1 : 0)]);
                    this.addDynamicStyle([tab + "Tab", "left",    () => (player.activeTab == tab ? 0 : "-100vw")]);
                }

                footer += `
                    <div class = "column" id = "settingsColumn">
                        <button
                            class = "row"
                            id = "settingsButton"
                            onclick = "game.display.toggleSettingsMenu('settingsColumn')"
                        >
                            Settings<span id = "settingsArrow">▲</span>
                        </button>
                        <div class = "row settingsRow">
                            <button class = "settingsButton" onclick = "Save.save();">Save</button>
                            <button class = "settingsButton" onclick = "Save.load()">Load</button>
                            <button class = "settingsButton" onclick = "Save.import()">Import</button>
                            <button class = "settingsButton" onclick = "Save.export()">Export</button>
                            <button class = "settingsButton" onclick = "Save.reset()">Reset</button>
                        </div>
                        <div class = "row settingsRow">
                            <div class = "column settingsColumn">
                                <span class = "settingsText">TPS: <span id = "TPSValue"></span></span>
                                <input
                                    class = "settingsSlider"
                                    type = "range"
                                    max = "30"
                                    min = "0"
                                    value = "` + Math.ceil(1000/player.tickInterval) + `"
                                    oninput = "game.setTickInterval(this.value);"
                                >
                                </input>
                            </div>
                            <div class = "column settingsColumn">
                                <span class = "settingsText">Autosave: <span id = "saveValue"></span></span>
                                <input
                                    class = "settingsSlider"
                                    type = "range"
                                    max = "10"
                                    min = "0"
                                    value = "` + player.saveInterval/1000 + `"
                                    oninput = "game.setSaveInterval(this.value);"
                                >
                                </input>
                            </div>
                        </div>
                        <div class = "row settingsRow">
                            <div class = "column settingsColumn">
                                <label class = "settingsText" for = "highQualityCheckbox">High Quality</label>
                                <button
                                    class = "settingsButton"
                                    id = "highQualityCheckbox"
                                    onclick = "player.highQuality = !player.highQuality; game.display.update();"
                                >
                                </button>
                            </div>
                            <div class = "column settingsColumn">
                                <label class = "settingsText" for = "offlineProgressCheckbox">Offline Progress</label>
                                <button
                                    class = "settingsButton"
                                    id = "offlineProgressCheckbox"
                                    onclick = "player.offlineProgress = !player.offlineProgress; game.display.update();"
                                >
                                </button>    
                            </div>
                        </div>
                        <div class = "row settingsRow">
                            <div class = "column settingsColumn">
                                <label class = "settingsText" for = "analogueTimeCheckbox">24 Hour Time</label>
                                <button
                                    class = "settingsButton"
                                    id = "analogueTimeCheckbox"
                                    onclick = "player.analogueTime = !player.analogueTime; game.display.update();"
                                >
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                this.addDynamicStyle(["settingsArrow", "transform", () => "rotate(" + (game.display.settingsMenu ? 180 : 0) + "deg)"]);
                this.addDynamicElement(["TPSValue",                 () => (player.tickInterval == Infinity ? "Paused" : Math.ceil(1000/player.tickInterval))]);
                this.addDynamicElement(["saveValue",                () => (player.saveInterval ? player.saveInterval/1000 + "s" : "Never")]);
                this.addDynamicElement(["highQualityCheckbox",      () => (player.highQuality ? "☒" : "☐")]);
                this.addDynamicElement(["offlineProgressCheckbox",  () => (player.offlineProgress ? "☒" : "☐")]);
                this.addDynamicElement(["analogueTimeCheckbox",     () => (!player.analogueTime ? "☒" : "☐")]);
                
                document.getElementById("footer").innerHTML = footer;
            
                break;

            case 2:
                // > 720px wide, typically tablets/laptops/desktops.
                // Creates the header and footer for the horizontal design.
                
                header += `
                    <div class = "row" id = "tabRow">
                `;

                for (let tab of Game.tabs) {
                    header += `
                        <button
                            class = "tabButton"
                            onclick = "game.changeActiveTab('` + tab + `'); game.display.toggleTabMenu('tabColumn');"
                            id = "` + tab + `TabButton"
                        >` + tab + `</button>
                    `;
                    this.addDynamicElement([tab + "TabButton",               () => Game[tab].name()]);
                    this.addDynamicStyle([tab + "TabButton", "display",      () => (player[tab].unlocked ? "block" : "none")]);
                    this.addDynamicStyle([tab + "TabButton", "border-color", () => (player.activeTab == tab ? "var(--text-colour)" : "")]);
                }

                header += `
                    </div>
                    <img
                        id = "timeImage"
                        src = "images/Day.png"
                        onmouseenter = "game.display.toggleTimeTab(true);"
                        onmouseleave = "game.display.toggleTimeTab(false);"
                    ></img>
                    <div id = "currentTime"></div>
                `;
                this.addDynamicElement(["currentTime",      () => "Day " + game.time[0] + " - " + Utils.formatClock(game.time[1] * 120, 2, !player.analogueTime)]);
                this.addDynamicElement(["timeImage", "src", () => "images/" + (game.time[1] > 120000 && game.time[1] < 600000 ? "Day" : "Night") + ".png"]);

                document.getElementById("header").innerHTML = header;

                for (let tab of Game.tabs) {
                    document.getElementById("main").innerHTML += `
                        <div class = "tab" id = "` + tab + `Tab">
                        ` + Game[tab].createDisplay(this.deviceState); + `
                        </div>
                    `;
                    this.addDynamicStyle([tab + "Tab", "opacity", () => (player.activeTab == tab ? 1 : 0)]);
                    this.addDynamicStyle([tab + "Tab", "left", () => (player.activeTab == tab ? 0 : "-100vw")]);
                }

                footer += `
                    <div
                        class = "row"
                        id = "settingsRow"
                    >
                        <div
                            class = "column settingsColumn"
                            id = "settingsColumnSettings"
                            onmouseenter = "game.display.toggleSettingsMenu(this.id, true)"
                            onmouseleave = "game.display.toggleSettingsMenu(this.id, false)"
                        >
                            <span class = "settingsText">Settings</span>
                            <div class = "column settingsSubColumn">
                                <span class = "settingsText">TPS: <span id = "TPSValue"></span></span>
                                <input
                                    class = "settingsSlider"
                                    type = "range"
                                    max = "30"
                                    min = "0"
                                    value = "` + Math.ceil(1000/player.tickInterval) + `"
                                    oninput = "game.setTickInterval(this.value);"
                                >
                                </input>
                            </div>
                            <div class = "column settingsSubColumn">
                                <span class = "settingsText">Autosave: <span id = "saveValue"></span></span>
                                <input
                                    class = "settingsSlider"
                                    type = "range"
                                    max = "10"
                                    min = "0"
                                    value = "` + player.saveInterval/1000 + `"
                                    oninput = "game.setSaveInterval(this.value);"
                                >
                                </input>
                            </div>
                            <div class = "column">
                                <label class = "settingsText" for = "highQualityCheckbox">High Quality</label>
                                <button
                                    class = "settingsButton"
                                    id = "highQualityCheckbox"
                                    onclick = "player.highQuality = !player.highQuality; game.display.update();"
                                >
                                </button>
                            </div>
                            <div class = "column">
                                <label class = "settingsText" for = "offlineProgressCheckbox">Offline Progress</label>
                                <button
                                    class = "settingsButton"
                                    id = "offlineProgressCheckbox"
                                    onclick = "player.offlineProgress = !player.offlineProgress; game.display.update();"
                                >
                                </button>    
                            </div>
                            <div class = "column">
                                <label class = "settingsText" for = "analogueTimeCheckbox">24 Hour Time</label>
                                <button
                                    class = "settingsButton"
                                    id = "analogueTimeCheckbox"
                                    onclick = "player.analogueTime = !player.analogueTime; game.display.update();"
                                >
                                </button>
                            </div>
                        </div>
                        <div
                            class = "column settingsColumn"
                            id = "settingsColumnSave"
                            onmouseenter = "game.display.toggleSettingsMenu(this.id, true)"
                            onmouseleave = "game.display.toggleSettingsMenu(this.id, false)"
                        >
                            <button class = "settingsButton" onclick = "Save.save()">Save</button>
                            <button class = "settingsButton" onclick = "Save.load()">Load</button>
                            <button class = "settingsButton" onclick = "Save.import()">Import</button>
                            <button class = "settingsButton" onclick = "Save.export()">Export</button>
                            <button class = "settingsButton" onclick = "Save.reset()">Reset</button>
                        </div>
                        <div
                            class = "column settingsColumn"
                            id = "settingsColumnLinks"
                            onmouseenter = "game.display.toggleSettingsMenu(this.id, true)"
                            onmouseleave = "game.display.toggleSettingsMenu(this.id, false)"
                        >
                            <span class = "settingsText">Links</span>
                            <a
                                class = "settingsButton"
                                href = "https://discord.gg/qcXwBYSBr3"
                                target = "_blank"
                            >
                                Discord
                            </a>
                        </div>
                    <div>
                `;

                this.addDynamicElement(["TPSValue",                 () => (player.tickInterval == Infinity ? "Paused" : Math.ceil(1000/player.tickInterval))]);
                this.addDynamicElement(["saveValue",                () => (player.saveInterval ? player.saveInterval/1000 + "s" : "Never")]);
                this.addDynamicElement(["highQualityCheckbox",      () => (player.highQuality ? "☒" : "☐")]);
                this.addDynamicElement(["offlineProgressCheckbox",  () => (player.offlineProgress ? "☒" : "☐")]);
                this.addDynamicElement(["analogueTimeCheckbox",     () => (!player.analogueTime ? "☒" : "☐")]);

                document.getElementById("footer").innerHTML = footer;

                break;

        }

    }

    addDynamicElement(data) {
        // Allows an HTML element to have a dynamic attribute.
        // data -> Array, the data needed to make a dynamic attribute.
        //     -> id, attribute, function -> Sets elements attribute to the function's result.
        //                                -> If attribute is omitted, defaults to "innerText".

        if (!Array.isArray(data)) throw new TypeError("\nArgument must be a list with 2 or 3 elements.");

        switch (data.length) {
            case 2:
                this.addDynamicElement([data[0], "innerText", data[1]]);
                // Calls the function again, but with the attribute set.
                break;
            case 3:
                if (typeof data[2] != "function") throw new TypeError("\nFinal element must be a function.");
                this.dHTML.push([data[0], data[1], data[2]]);
                break;
            default:
                throw new TypeError("\nArgument must be a list with 2 or 3 elements.");
        }

    }

    addDynamicStyle(data) {
        // Allows an HTML element to have a dynamic style attribute.
        // data -> Array, the data needed to make a dynamic style attribute.
        //     -> id, attribute, function -> Sets elements style attribute to the function's result.

        if (!Array.isArray(data) || data.length != 3) throw new TypeError("\nArgument must be a list with 2 or 3 elements.");
        this.dStyle.push(data);

    }

    toggleTabMenu(value = !game.display.tabMenu) {
        // Toggles the tab drop down menu.
        // value -> Forces the toggle to be a value.

        if (!player.clearing.unlocked) return;

        game.display.tabMenu = value;
        if (game.display.tabMenu && game.display.timeTab) game.display.toggleTimeTab(false);

        let column = document.getElementById("tabColumn");
        if (column) column.style.bottom = (game.display.tabMenu ? "calc(2.5rem - " + column.clientHeight + "px)" : 0);

    }

    toggleTimeTab(value = !game.display.timeTab) {

        game.display.timeTab = value;
        if (game.display.timeTab) game.display.toggleTabMenu(false);

        let time = document.getElementById("currentTime");
        if (time) time.style.right = (game.display.timeTab ? 0 : "-" + time.clientWidth + "px");

    }

    toggleSettingsMenu(id, value = !game.display.settingsMenu) {
        // Toggles the settings drop down menu.
        // value -> Forces the toggle to be a value.

        game.display.settingsMenu = (id && value ? id : value);

        let column = document.getElementById(id);
        if (column) column.style.top = (game.display.settingsMenu ? "calc(2.5rem - " + column.clientHeight + "px)" : 0);

    }

    update() {

        for (let dHTML of this.dHTML) {
            let element = document.getElementById(dHTML[0]);
            if (element) element[dHTML[1]] = dHTML[2](element);
        }
        for (let dStyle of this.dStyle) {
            let element = document.getElementById(dStyle[0])
            if (element) element.style[dStyle[1]] = dStyle[2](element);
        }
        // Update element's attributes and styles.

    }

}