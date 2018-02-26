import pnp, { LogLevel, ConsoleListener } from "sp-pnp-js";
import * as WebParts from "./@WebParts";

/** If the script was loaded using SP.SOD, we'll set the SOD to loaded */
if (window["_v_dictSod"]) {
    window["_v_dictSod"]["pp.program.js"].loaded = true;
}

/** Set up pnp logging */
pnp.log.activeLogLevel = LogLevel.Info;
pnp.log.subscribe(new ConsoleListener());

/** PnP setup */
pnp.setup({
    sp: { headers: { Accept: "application/json; odata=verbose" } },
    defaultCachingStore: "session",
    defaultCachingTimeoutSeconds: 60,
});

ExecuteOrDelayUntilBodyLoaded(WebParts.Render);
