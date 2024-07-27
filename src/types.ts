import {Edge, Node} from "@xyflow/react";
import Transition from "./classes/transition.ts";
import StateMachine from "./classes/stateMachine.ts";
import State from "./classes/state.ts";
import React from "react";
import StateOrStateMachineService from "./services/stateOrStateMachineService.tsx";

// One Type to avoid repeating ourselves. Can be expanded/unionized as needed.
export type CsmNodeProps = {state: State} | {stateMachine: StateMachine} | {name: string};

export type NodeType =
    | 'entry-node'
    | 'exit-node'
    | 'state-node'
    | 'state-machine-node'

export type EntryNode = Node<{name: string}, 'entry-node'>;


export type StateNode = Node<{
   state : State
}, 'state-node'>;

export type StateMachineNode = Node<{
   stateMachine : StateMachine
}, 'state-machine-node'>;


export type ExitNode = Node<{name: string}, 'exit-node'>;


export type CsmEdgeProps = Edge<{
    transition: Transition
}, 'csmEdge'>;


export type ReactFlowContextProps = {
    nodes: Node<CsmNodeProps>[];
    setNodes: React.Dispatch<React.SetStateAction<Node<CsmNodeProps>[]>>;
    nodeHistory: Node<CsmNodeProps>[][];
    setNodeHistory: React.Dispatch<React.SetStateAction<Node<CsmNodeProps>[][]>>;
    edges: Edge<CsmEdgeProps>[];
    setEdges:  React.Dispatch<React.SetStateAction<Edge<CsmEdgeProps>[]>>;
    selectedNode: Node<CsmNodeProps> | null;
    setSelectedNode: React.Dispatch<React.SetStateAction<Node<CsmNodeProps> | null>>;
    showSidebar: boolean;
    setShowSidebar:  React.Dispatch<React.SetStateAction<boolean>>;
    nameInput: string;
    setNameInput: React.Dispatch<React.SetStateAction<string>>;
    stateOrStateMachineService: StateOrStateMachineService;
    currentIndex: React.MutableRefObject<number | undefined>;
}





// Type guards

/**
 * Type guard function to check if the provided data is of type `{ state: State }`.
 *
 * This function takes a `CsmNodeProps` object and checks if it has a `state` property.
 * It returns `true` if the `state` property is defined, indicating that the data is of type `{ state: State }`.
 *
 * @param {CsmNodeProps} data - The data to check.
 * @returns {data is { state: State }} - Returns `true` if the data is of type `{ state: State }`.
 */
export function isState(data: CsmNodeProps): data is { state: State } {
    return (data as { state: State }).state !== undefined;
}

/**
 * Type guard function to check if the provided data is of type `{ stateMachine: StateMachine }`.
 *
 * This function takes a `CsmNodeProps` object and checks if it has a `stateMachine` property.
 * It returns `true` if the `stateMachine` property is defined, indicating that the data is of type `{ stateMachine: StateMachine }`.
 *
 * @param {CsmNodeProps} data - The data to check.
 * @returns {data is { stateMachine: StateMachine }} - Returns `true` if the data is of type `{ stateMachine: StateMachine }`.
 */
export function isStateMachine(data: CsmNodeProps): data is { stateMachine: StateMachine } {
    return (data as { stateMachine: StateMachine }).stateMachine !== undefined;
}

/**
 * Type guard function to check if the provided data is of type `{ name: string }`.
 *
 * This function takes a `CsmNodeProps` object and checks if it has a `name` property.
 * It returns `true` if the `name` property is defined, indicating that the data is of type `{ name: string }`.
 *
 * @param {CsmNodeProps} data - The data to check.
 * @returns {data is { name: string }} - Returns `true` if the data is of type `{ name: string }`.
 */
export function isExitOrEntry(data: CsmNodeProps): data is {name: string}{
    return (data as {name: string}).name !== undefined;
}
