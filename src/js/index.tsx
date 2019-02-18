import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";
import * as WebParts from "./@WebParts";
import { GetSettings } from "prosjektportalen/lib/Settings";
/** If the script was loaded using SP.SOD, we'll set the SOD to loaded */
if (window["_v_dictSod"]) {
    window["_v_dictSod"]["pp.program.js"].loaded = true;
}

namespace PP.Program {
    /**
     * Sets up PnP logging
     *
     * @param {string} logLevelStr Log level string
     */
    async function initLogging(logLevelStr: string) {
        let logLevel = LogLevel.Off;
        switch (logLevelStr.toLowerCase()) {
            case "info": {
                logLevel = LogLevel.Info;
            }
                break;
            case "warning": {
                logLevel = LogLevel.Warning;
            }
                break;
            case "error": {
                logLevel = LogLevel.Error;
            }
                break;
        }
        Logger.activeLogLevel = logLevel;
        Logger.subscribe(new ConsoleListener());
    }

    /**
     * Sets up PnP settings
     *
     * @param {string} defaultCachingTimeoutSecondsStr Default caching timeout (seconds)
     */
    function initPnp(defaultCachingTimeoutSecondsStr: string) {
        let defaultCachingTimeoutSeconds = 30;
        if (defaultCachingTimeoutSecondsStr) {
            defaultCachingTimeoutSeconds = parseInt(defaultCachingTimeoutSecondsStr, 10);
        }
        sp.setup({
            sp: { headers: { Accept: "application/json; odata=verbose" } },
            defaultCachingStore: "session",
            defaultCachingTimeoutSeconds,
        });
    }

    export async function initialize() {
        const settings = await GetSettings();
        initLogging(settings.LOG_LEVEL);
        initPnp(settings.DEFAULT_CACHING_TIMEOUT_SECONDS);

        SP.SOD.executeOrDelayUntilScriptLoaded(() => {
            WebParts.Render();
        }, "sp.js");
    }
}

ExecuteOrDelayUntilBodyLoaded(PP.Program.initialize);
