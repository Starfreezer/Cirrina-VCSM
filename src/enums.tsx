export enum ActionType {
    "INVOKE" = "Invoke",
    "CREATE" = "Create",
    "ASSIGN" = "Assign",
    "LOCK" = "Lock",
    "UNLOCK" = "Unlock",
    "RAISE_EVENT" ="Raise Event Action"

}

export enum ActionCategory {
    "TIMEOUT" = "Timeout Action",
    "ENTRY_ACTION" = "Entry Action",
    "EXIT_ACTION" = "Exit Action",
    "WHILE_ACTION" = "While Action"
}


/**
 * This enum is used for describing the various valid service types related to the ActionType Invoke.
 */
export enum ServiceType {
    "REMOTE" ="Remote",
    "LOCAL" ="Local"
}
