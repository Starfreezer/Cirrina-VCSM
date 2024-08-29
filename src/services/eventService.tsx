import {CsmNodeProps, isState, isStateMachine} from "../types.ts";
import Action from "../classes/action.ts";
import Event from "../classes/event.ts";
import {ActionType} from "../enums.ts";

export default class EventService {
    private nameToEventMap: Map<string,Event>;

    public constructor() {
        this.nameToEventMap = new Map<string,Event>();
    }

    /**
     * Registers an event name.
     *
     * This method checks if the provided `eventName` is unique by comparing it against
     * a collection of already registered names. If the name is not unique, it logs an
     * error message to the console and returns `false`. If the name is unique, it adds
     * the name to the collection and returns `true`.
     *
     * @param {string} eventName - The name of the event to register.
     * @returns {boolean} - Returns `true` if the name is unique and successfully registered,
     *                      otherwise returns `false`.
     */
    public registerEvent(event: Event): boolean {
        if(!this.isNameUnique(event.name)){
            console.error("Event name already exists!");
            return false;
        }

        this.nameToEventMap.set(event.name,event);
        console.log(event.name + " has been registered!");
        return true;
    }

    /**
     * Unregisters an event name.
     *
     * This method removes the provided `eventName` from the collection of registered names.
     * If the name is not of type `string`, it logs a warning message to the console.
     *
     * @param {string | unknown} eventName - The name of the event to unregister.
     */
    public unregisterEvent(eventName: string | unknown): void {
        if(typeof eventName === "string" ){
            this.nameToEventMap.delete(eventName);
            console.log(eventName + " has been unregistered!");
        }
        else {
            console.warn("Invalid name type: unable to unregister", eventName);
        }

    }

    /**
     * Checks if an event name is unique.
     *
     * This method determines whether the provided `eventName` is unique by checking its
     * presence in the collection of registered names. It returns `true` if the name is
     * not found in the collection, indicating that it is unique. Otherwise, it returns `false`.
     *
     * @param {string} eventName - The name of the event to check for uniqueness.
     * @returns {boolean} - Returns `true` if the name is unique (i.e., not found in the collection),
     *                      otherwise returns `false`.
     */
    public isNameUnique(eventName: string): boolean {
        return ! this.nameToEventMap.has(eventName);
    }

    public getAllEvents() {
        return Array.from(this.nameToEventMap.values());
    }


    /**
     * Retrieves all unique events raised by actions of type `RAISE_EVENT` within the given data.
     *
     * This function checks if the provided data represents a state or a state machine. It then filters
     * the actions to find those of type `RAISE_EVENT`, extracts their event properties, and returns
     * a list of unique event names.
     *
     * @param {CsmNodeProps} data - The data of the node, which can represent a state or a state machine.
     * @returns {string[]} A list of unique event names raised by actions of type `RAISE_EVENT`.
     */
    public getAllEventsRaised(data: CsmNodeProps): string[] {
        if(isState(data)){
            const actions = data.state.getAllActions().filter((action: Action) => action.type === ActionType.RAISE_EVENT);
            return actions.map((action: Action) => {
                const props = action.properties as { event: string } // TODO: This probably needs to be dynamic once we have the schema
                return props.event
            }).filter((value, index, array) => array.indexOf(value) === index);

        }
        if(isStateMachine(data)){
            const actions = data.stateMachine.actions.filter((action: Action) => action.type = ActionType.RAISE_EVENT);
            return actions.map((action: Action) => {
                const props = action.properties as { event: string } // TODO: This probably needs to be dynamic once we have the schema
                return props.event
            }).filter((value, index, array) => array.indexOf(value) === index);
        }
        return []

    }









}