import {Edge, Node} from "@xyflow/react";
import {CsmEdgeProps, CsmNodeProps, isState, isStateMachine, OptionEnums, ReactFlowContextProps} from "./types.ts";
import {createContext} from "react";
import StateInfoForm from "./components/visualEditor/stateInfoForm.tsx";
import StateMachineInfoForm from "./components/visualEditor/stateMachineInfoForm.tsx";
import ContextVariable from "./classes/contextVariable.tsx";
import StateOrStateMachineService from "./services/stateOrStateMachineService.tsx";

export const ReactFlowContext = createContext<ReactFlowContextProps | null>(null);

function nodeIsEqual(node1: Node<CsmNodeProps>, node2: Node<CsmNodeProps>): boolean {
    console.log(`NODE1: ${node1} , NODE2: ${node2}`);
    return node1.id === node2.id;
}

export const renderEnumAsOptions = (enumObject: OptionEnums) => {
    return (
        Object.values(enumObject).map((value) => {
            return <option key={value} value={value}>{value.toUpperCase()}</option>
        })
    );
    
}



export const setInitialState = (initialState: Node<CsmNodeProps>, nodes: Node<CsmNodeProps>[], edges: Edge<CsmEdgeProps>[]) =>  {

    edges.forEach(edge => {
        if(edge.source === initialState.id && edge.target === initialState.id) {
            console.error("Initial state cannot have internal transition");
            return
        }
    })


    if(isState(initialState.data)){
        const siblings = nodes.filter((n) => n.parentId === initialState.parentId);
        siblings.forEach(sibling => {
            if(isState(sibling.data)){
                sibling.data.state.initial = false
            }
        })
        initialState.data.state.initial = true
        console.log(`Set ${initialState.id} as initial state!`)
    }
    else {
        console.error("Statemachine can not be initial state")
    }
}

export const setStateAsTerminal = (terminalNode: Node<CsmNodeProps>, edges: Edge<CsmEdgeProps>[]) =>  {
    edges.forEach((edge) => {
        if(edge.source === terminalNode.id){
            console.error("Terminal state cannot have outgoing transitions")
            return
        }
    })

    if(isState(terminalNode.data)){
        terminalNode.data.state.terminal = true
        console.log(`Set ${terminalNode.id} as a terminal state`)
    }
    else{
        console.error("Statemachine cannot be terminal states")
    }

}



export const renderContextVariablesAsOptions = (vars: ContextVariable[]) => {
    return vars.map((variable) => {
        return(
            <option key={variable.name} value={variable.name}>{variable.name}</option>
        )
    })
}

export const renderStringsAsOptions = (strings: string[]) => {
    return strings.map((string) => {
        return (
            <option key={string} value={string}>{string}</option>
        )
    })
}

export function getNodeInfoForm(node: Node) {
    switch (node.type) {
        case "state-node":
            return StateInfoForm;
        case "state-machine-node":
            return StateMachineInfoForm;
    }
}


export const getParentNode = (node: Node<CsmNodeProps>, nodes: Node<CsmNodeProps>[]): Node<CsmNodeProps> | undefined => {
    return nodes.find((n) => n.id === node.parentId);
};

const getNodeDepth = (node: Node<CsmNodeProps>, nodes: Node<CsmNodeProps>[]): number => {
    if(isStateMachine(node.data)){
        const parentNode = getParentNode(node, nodes)
        if(parentNode){
            return 1 + getNodeDepth(parentNode, nodes)
        }
        return 0
    }
    return 0
}

// TODO: Maybe different background colors depending on depth.
export const colorMap = (nodeDepth: number) => {
    switch (nodeDepth) {
        default: {
            return "rgba(244, 2, 127, 0.11)"
        }
    }

}

export const recolorNode = (node: Node<CsmNodeProps>, nodes: Node<CsmNodeProps>[]) => {
    if(isStateMachine(node.data)){
        node.style = {
            ...node.style,
            backgroundColor: colorMap(getNodeDepth(node, nodes))
        }

    }
    return
}

export const getMostDistantAncestorNode = (
    node: Node<CsmNodeProps>,
    nodes: Node<CsmNodeProps>[],
    visited: Set<string> = new Set() // Track visited nodes
): Node<CsmNodeProps> => {
    // Check if the current node has already been visited (cycle detection)
    if (visited.has(node.id)) {
        throw new Error(`Cycle detected at node with ID: ${node.id}`);
    }

    visited.add(node.id);

    const ancestor = getParentNode(node, nodes);

    if (!ancestor) {
        return node;
    }

    return getMostDistantAncestorNode(ancestor, nodes, visited);
};

export const getAllStatemachineDescendants = (root: Node<CsmNodeProps>,
                                              nodes: Node<CsmNodeProps>[],
                                              visited: Set<string> = new Set()
): Node<CsmNodeProps>[] => {
    let statemachineNodes: Node<CsmNodeProps>[] = [];

    // Check if the current node has already been visited (cycle detection)
    if (visited.has(root.id)) {
        throw new Error(`Cycle detected at node with ID: ${root.id}`);
    }

    visited.add(root.id);

    nodes.forEach((node: Node<CsmNodeProps>) => {
        if (node.parentId === root.id && node.type === "state-machine-node") {
            statemachineNodes.push(node);
        }
    });

    statemachineNodes.forEach((node: Node<CsmNodeProps>) => {
        statemachineNodes = statemachineNodes.concat(getAllStatemachineDescendants(node, nodes, visited));
    });

    return statemachineNodes;
};



export const getAllStateNamesInExtent = (node: Node<CsmNodeProps>, nodes: Node<CsmNodeProps>[], service: StateOrStateMachineService): Set<string> => {
    const root = getMostDistantAncestorNode(node,nodes)
    const rootName = service.getName(root.data)
    const stateMachineChildren = getAllStatemachineDescendants(root, nodes)
    const stateNames = (service.getStateNames(root.id) || new Set()).add(rootName)

    stateMachineChildren.forEach(node => {
        const names = service.getStateNames(node.id)
        if(names){
            names.forEach((name) => stateNames.add(name));
        }
    })


    return stateNames

};


export {nodeIsEqual}

