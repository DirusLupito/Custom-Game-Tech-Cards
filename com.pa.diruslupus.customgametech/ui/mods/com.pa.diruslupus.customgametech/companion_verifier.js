(function() {
    var MOD_TAG = '[CustomGameTechCompanion]';

    var sceneName = function() {
        var match = /\/([^\/]+)\/\1\.html/.exec(window.location.href);
        if (match && match[1]) {
            return match[1];
        }

        return window.location.pathname || window.location.href;
    };

    var isFunction = function(value) {
        return typeof value === 'function';
    };

    var contains = function(fn, text) {
        if (!isFunction(fn)) {
            return false;
        }

        return fn.toString().indexOf(text) >= 0;
    };

    var logMountedMods = function(scene) {
        if (!window.api || !api.mods || !api.mods.getMounted) {
            console.error(MOD_TAG + '[' + scene + '] api.mods.getMounted unavailable.');
            return;
        }

        api.mods.getMounted('server', true).then(function(mods) {
            var mounted = [];
            var modList = mods || [];
            var index;

            for (index = 0; index < modList.length; index++) {
                mounted.push(modList[index].identifier || modList[index].display_name || 'unknown');
            }

            console.log(MOD_TAG + '[' + scene + '] mounted server mods=' + JSON.stringify(mounted));
        }, function(reason) {
            console.error(MOD_TAG + '[' + scene + '] failed to read mounted server mods: ' + JSON.stringify(reason || {}));
        });
    };

    var verifyNewGame = function(scene) {
        if (!window.model) {
            console.error(MOD_TAG + '[' + scene + '] model unavailable; cannot verify new_game companion UI.');
            return;
        }

        if (!isFunction(model.gwTechCardSlotCount) || !isFunction(model.cookGwTechConfig)) {
            console.error(MOD_TAG + '[' + scene + '] expected copied new_game tech-card model members are missing.');
            return;
        }

        console.log(MOD_TAG + '[' + scene + '] copied new_game tech-card UI is active.');
    };

    var verifyLiveGame = function(scene) {
        if (!window.handlers || !contains(handlers.memory_files, 'gw_tech_cards_active')) {
            console.error(MOD_TAG + '[' + scene + '] expected copied live_game memory_files handler is missing tech-card support.');
            return;
        }

        console.log(MOD_TAG + '[' + scene + '] copied live_game tech-card memory-file handler is active.');
    };

    var verifyActionBar = function(scene) {
        if (!window.model || !isFunction(model.currentGwUnitSpecTag) || !isFunction(model.gwTechCardsActive)) {
            console.error(MOD_TAG + '[' + scene + '] expected copied action-bar tech-card spec-tag members are missing.');
            return;
        }

        console.log(MOD_TAG + '[' + scene + '] copied action-bar tech-card spec-tag resolver is active.');
    };

    var verifyBuildBar = function(scene) {
        if (!window.model || !isFunction(model.gwTechCardsActive)) {
            console.error(MOD_TAG + '[' + scene + '] expected copied build-bar tech-card session observable is missing.');
            return;
        }

        console.log(MOD_TAG + '[' + scene + '] copied build-bar tech-card session support is active.');
    };

    var verifyReconnect = function(scene) {
        if (!window.handlers || !contains(handlers.memory_files, 'gw_tech_cards_active')) {
            console.error(MOD_TAG + '[' + scene + '] expected copied reconnect memory_files handler is missing tech-card support.');
            return;
        }

        console.log(MOD_TAG + '[' + scene + '] copied reconnect tech-card restore path is active.');
    };

    var verify = function() {
        var scene = sceneName();
        logMountedMods(scene);

        if (scene === 'new_game') {
            verifyNewGame(scene);
        } else if (scene === 'live_game') {
            verifyLiveGame(scene);
        } else if (scene === 'live_game_action_bar') {
            verifyActionBar(scene);
        } else if (scene === 'live_game_build_bar') {
            verifyBuildBar(scene);
        } else if (scene === 'gw_reconnect_loading') {
            verifyReconnect(scene);
        } else {
            console.log(MOD_TAG + '[' + scene + '] verifier loaded.');
        }
    };

    $(document).ready(function() {
        window.setTimeout(verify, 0);
    });
})();
