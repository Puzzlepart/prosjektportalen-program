import { MessageBarType } from "office-ui-fabric-react/lib/MessageBar";

export default interface IStatusMessage {
    id?: number;
    text: string;
    type: MessageBarType;
    timer?;
}
