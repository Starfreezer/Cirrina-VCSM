import React, {useCallback, useContext, useEffect, useState} from "react";
import { ReactFlowContext } from "./flow.tsx";
import {CsmNodeProps, isState, isStateMachine, ReactFlowContextProps} from "../types.ts";
import {ActionCategory, ActionType} from "../enums.tsx";
import Action from "../classes/action.tsx";

/**
 * NodeInfoForm Component
 *
 * This component renders a form that displays the properties of a selected node
 * and allows the user to update them. The form includes an input field for the
 * node name, which is pre-filled with the current name of the selected node.
 * Changes to the input field are reflected in the component state, and submitting
 * the form updates the node's name in the context.
 *
 * @component
 * @example
 * return (
 *   <NodeInfoForm />
 * )
 */
export default function NodeInfoForm() {
    const context: ReactFlowContextProps = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {
        nodes,
        setNodes,
        selectedNode,
        stateOrStateMachineService,
        showSidebar,
        nameInput,
        setNameInput,
        setEdges,
        actionService,
        eventService,
    } = context;

    const [selectedActionType, setSelectedActionType] = useState<string>("no-new-action")
    const [selectedActionCategory, setSelectedActionCategory] = useState<string>(ActionCategory.WHILE_ACTION)
    const [raiseEventSelectedType, setRaiseEventSelectedType] = useState<string>("new-raise-event")
    const [newEventName, setNewEventName] = useState<string>("New Event Name")
    const [newActionName, setNewActionName] = useState<string>("New Action Name")

    /**
     * useEffect hook to update the name input field when the selected node changes.
     */
    useEffect(() => {
        if (selectedNode) {
            setNameInput(stateOrStateMachineService.getName(selectedNode.data));
        }
    }, [selectedNode, setNameInput, stateOrStateMachineService]);

    // For logging
    useEffect(() => {
        if(selectedActionType){
            console.log(`Selected Action type changed to ${selectedActionType}`);
        }
    }, [selectedActionType]);

    /**
     * Updates the transitions when a node is renamed.
     *
     * This function updates the source and target names of transitions in the edges
     * whenever a node is renamed. It ensures that any transition involving the renamed
     * node reflects the new name.
     *
     * @param {string} oldName - The old name of the node before renaming.
     * @param {string} newName - The new name of the node after renaming.
     */
    const updateTransitionsOnRename = useCallback((oldName: string, newName: string) => {
        setEdges(edges => edges.map(edge => {
            if (edge.data?.transition) {
                const transition = edge.data.transition;
                let updated = false;
                if (transition.getSource() === oldName) {
                    transition.setSource(newName);
                    updated = true;
                }
                if (transition.getTarget() === oldName) {
                    transition.setTarget(newName);
                    updated = true;
                }
                if (updated) {
                    return { ...edge, data: { ...edge.data, transition } };
                }
            }
            return edge;
        }));
    }, [setEdges]);


    // TODO: REFACTOR
    /**
     * Handles form submission for updating node properties and adding actions.
     *
     * This function is triggered when the form is submitted. It prevents the default form submission behavior,
     * retrieves form element values, validates the new name, creates and validates a new action if specified,
     * updates the node's name, and adds the new action to the node if applicable.
     *
     * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
     */
    const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedNode) return;

        const formElements = event.currentTarget.elements as typeof event.currentTarget.elements & {
            name: HTMLInputElement,
            "select-action-type": HTMLSelectElement,
            "select-action-category": HTMLSelectElement,
            "new-raise-event-input": HTMLInputElement,
            "new-action-name": HTMLInputElement
        };

        console.log(formElements);


        const newActionType = formElements["select-action-type"]?.value;
        const newActionCategory = formElements["select-action-category"]?.value;
        const newRaiseEventName = formElements["new-raise-event-input"]?.value;
        const newActionName = formElements["new-action-name"]?.value;

        const newName = formElements.name.value;
        const oldName = stateOrStateMachineService.getName(selectedNode.data);

        console.log({ newName, newActionType, newActionCategory, newRaiseEventName, newActionName });

        if (!stateOrStateMachineService.isNameUnique(newName) && newName !== oldName) {
            console.error(`StateOrStateMachine name ${newName} already exists!`);
            return;
        }

        let newAction = undefined;

        if(newActionType !== "no-new-action") {
            if(newActionName && (!actionService.isNameUnique(newActionName))) {
                console.error("Action name already exists!");
                return;
            }
            if(newEventName && (!eventService.isNameUnique(newRaiseEventName))) {
                console.error("Event name already exists!")
                return;
            }

            newAction = new Action(newActionName, newActionType as ActionType);

            // TODO: Extend to other types
            switch (newActionType) {
                case ActionType.RAISE_EVENT: {
                    newAction.properties = {"event": newRaiseEventName};
                    break;
                }
                default: break;
            }



        }

        if (newName !== oldName) {
            const newNodes = nodes.map(node => {
                if (node.id === selectedNode.id) {
                    const newData = stateOrStateMachineService.setName(newName, node.data);
                    return { ...node, data: newData };
                }
                return node;
            });

            stateOrStateMachineService.unregisterName(oldName);
            stateOrStateMachineService.registerName(newName);
            setNodes(newNodes);
            updateTransitionsOnRename(oldName, newName);
        }

        if(newAction) {
            const newNodes = nodes.map(node => {
                if (node.id === selectedNode.id) {
                    const newData = stateOrStateMachineService.addActionToState(node.data, newAction, newActionCategory as ActionCategory);
                    return { ...node, data: newData };
                }
                return node;
            });

            actionService.registerName(newAction.name);
            if(newRaiseEventName){
                eventService.registerName(newRaiseEventName);
            }
            setNodes(newNodes)
        }


    }, [nodes, setNodes, selectedNode, stateOrStateMachineService, updateTransitionsOnRename]);

    const onNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameInput(event.target.value);
    };

    // TODO: Style to make it more readable
    const showActions = (data: CsmNodeProps) => {

        if(isState(data)){
            return(
                data.state.getAllActions().map((action) => {
                   return <p key={action.name}>{action.name}</p>
                })
            )
        }
        if(isStateMachine(data)){
            return(
                data.stateMachine.actions.map((action) => {
                    return <p key={action.name}>{action.name}</p>
                })
            )
        }

        return (<p>Unknown type</p>)
    }

    const onActionTypeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionType(event.target.value);
    }

    const onCategorySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedActionCategory(event.target.value);
    }

    const onRaiseEventSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(`RAISE EVENT SELECTION ${event.target.value}`);
        setRaiseEventSelectedType(event.target.value);
    }

    const onNewEventNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEventName(event.target.value);
    }

    const onNewActionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewActionName(event.target.value)
    }

    const renderActionTypeOptions = () => {
        return (Object.values(ActionType).map((actionType) => {
           return <option key={actionType} value={actionType}>{actionType}</option>
        }))
    }

    const renderActionCategoryOptions = () => {
        return (
            Object.values(ActionCategory).map((category) => {
                return <option key={category} value={category}>{category}</option>
            })
        )
    }

    const renderEventsAsOptions = () => {
        return (
            eventService.getAllEvents().map((event: string) => {
                return(
                    <option key={event} value={event}>{event}</option>
                )
            })
        )
    }


    // TODO: Implement a drop down menu with all existing events so that you can choose one of those.
    const renderActionProperties = () => {
        switch (selectedActionType){
            case ActionType.RAISE_EVENT: {
                return(
                    <div className="raise-event-select">
                        <p>I want to raise an event</p>
                        <select id="raise-event-props" name="raise-event-props" onChange={onRaiseEventSelectChange} defaultValue={"new-raise-event"}>
                            {renderEventsAsOptions()}
                            <option key="new-raise-event" value="new-raise-event">New Event</option>
                        </select>
                        {raiseEventSelectedType === "new-raise-event" && (
                            <input type="text" id="new-raise-event-input" name ="new-raise-event-input" value={newEventName} onChange={onNewEventNameChange}/>
                        )}
                    </div>
                )
            }
            // TODO: Other Types.
            default : {
                return <></>
            }
        }
    }
    //TODO: Make this look good
    return (
        showSidebar && selectedNode && (
            <div className="node-form">
                <form onSubmit={onFormSubmit}>
                    <h3>Hi mom! It's me {stateOrStateMachineService.getName(selectedNode.data)}!</h3>
                    <label htmlFor="name">Name: </label>
                    <input type="text" id="name" name="name" value={nameInput} onChange={onNameInputChange} />

                    <div className="from-action-section">
                        <label htmlFor="select-action-type">Add action: </label>
                        <select id="select-action-type" name="select-action-type" onChange={onActionTypeSelect}
                                defaultValue={selectedActionType || "no-new-action"}>
                            <option key={"no-new-action"} value={"no-new-action"}>No</option>
                            {renderActionTypeOptions()}
                        </select>


                        {selectedActionType && selectedActionType !=="no-new-action" && (
                            <select id="select-action-category" name="select-action-category"
                                    onChange={onCategorySelect} defaultValue={selectedActionCategory}>
                                {renderActionCategoryOptions()}
                            </select>
                        )}
                        {selectedActionType && selectedActionType !== "no-new-action" && renderActionProperties()}
                        {selectedActionType && selectedActionType !== "no-new-action" && (
                            <div>
                            <label htmlFor="new-action-name">Action name: </label>
                            <input type="text" id="new-action-name" name="new-action-name" value={newActionName}
                                   onChange={onNewActionNameChange}/>
                            </div>
                        )}
                    </div>
                    <h3>Actions: </h3>
                    {showActions(selectedNode.data)}
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        )
    );
}
