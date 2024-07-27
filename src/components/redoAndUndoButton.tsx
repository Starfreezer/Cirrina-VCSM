//import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import "../css/redoUndoButton.css"
import {useCallback, useContext} from "react";
import {ReactFlowContext} from "./flow.tsx";
import {ReactFlowContextProps} from "../types.ts";
import {differenceWith} from "lodash"
import {nodeIsEqual} from "../utils.tsx"


export default function RedoAndUndoButton() {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const { setNodes,
        nodeHistory,
        stateOrStateMachineService} = context;
    let {currentIndex} = context



    const onUndoClick = useCallback(() => {

        console.log(`Entering undo, index ${currentIndex}`);

        if (currentIndex < 0) {
            console.log("Hi")
            currentIndex = nodeHistory.length - 1;
        }

        if (currentIndex <= 0) {
            console.log("Beginning of history")
            return;
        }

        currentIndex = currentIndex - 1;

        setNodes((prev) => {
                const diff = differenceWith(prev, nodeHistory[currentIndex], nodeIsEqual);
                diff.forEach((node) => {
                    stateOrStateMachineService.unregisterName(stateOrStateMachineService.getName(node.data));
                });
                return nodeHistory[currentIndex];
        });

    }, [nodeHistory, setNodes, stateOrStateMachineService]);


    const onRedoClick = useCallback(() => {

        if (currentIndex < 0) {
            currentIndex = nodeHistory.length - 1;
        }

        if (currentIndex >= nodeHistory.length - 1) {
            console.log("End of History");
            return;
        }

        currentIndex = currentIndex + 1;

        setNodes((prev) => {
            if (currentIndex !== undefined) {
                const diff = differenceWith(nodeHistory[currentIndex], prev, nodeIsEqual);
                diff.forEach((node) => {
                    stateOrStateMachineService.registerName(stateOrStateMachineService.getName(node.data));
                });
                return nodeHistory[currentIndex];
            }
            return prev;
        });


    },[nodeHistory, setNodes, stateOrStateMachineService])



    return (
        <div>
            <button className="redo-undo-button" onClick={onUndoClick}>
                <i className="fas fa-undo"></i> {/* Font Awesome undo icon */}
            </button>
            <button className="redo-undo-button" onClick={onRedoClick}>
                <i className="fas fa-redo"></i> {/* Font Awesome undo icon */}
            </button>
        </div>
    );
}