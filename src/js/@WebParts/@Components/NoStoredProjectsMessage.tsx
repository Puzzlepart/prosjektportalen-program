import * as React from "react";
import { MessageBar } from "office-ui-fabric-react/lib/MessageBar";

const NoStoredProjectsMessage = () => {
    return (
        <MessageBar>
            <p>Det er ikke koblet noen prosjekter til dette programmet, eller du har ikke tilgang til noen av programmets prosjekter.</p>
            <p>Du kan koble prosjekter til programmet på siden <a href={`${_spPageContextInfo.webAbsoluteUrl}/SitePages/Legg til prosjekt.aspx`}>Legg til prosjekt</a>.</p>
        </MessageBar>
    );
};

export default NoStoredProjectsMessage;
