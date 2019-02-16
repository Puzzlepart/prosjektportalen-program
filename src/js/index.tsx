import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";
import { sp } from "@pnp/sp";
import * as WebParts from "./@WebParts";
import { IModalProps } from "office-ui-fabric-react/lib/Modal";

/**
 * For reasoning behind override, see https://github.com/OfficeDev/office-ui-fabric-react/issues/7874
 *
 */
declare module "office-ui-fabric-react/lib/Modal" {
    const Modal: React.StatelessComponent<IModalProps>;
}

/** If the script was loaded using SP.SOD, we'll set the SOD to loaded */
if (window["_v_dictSod"]) {
    window["_v_dictSod"]["pp.program.js"].loaded = true;
}

/** Set up pnp logging */

Logger.activeLogLevel = LogLevel.Info;
Logger.subscribe(new ConsoleListener());

/** PnP setup */

sp.setup({
    sp: { headers: { Accept: "application/json; odata=verbose" } },
    defaultCachingStore: "session",
});

ExecuteOrDelayUntilBodyLoaded(WebParts.Render);
