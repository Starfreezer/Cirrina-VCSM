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
        stateOrStateMachineService,
        currentIndex } = context;



    const onUndoClick = useCallback(() => {

        if (currentIndex.current === undefined) {
            currentIndex.current = nodeHistory.length - 1;
        }

        if (currentIndex.current <= 0) {
            console.log("Beginning of history")
            return;
        }

        currentIndex.current = currentIndex.current - 1;

        setNodes((prev) => {
            if (currentIndex.current !== undefined) {
                const diff = differenceWith(prev, nodeHistory[currentIndex.current], nodeIsEqual);
                diff.forEach((node) => {
                    stateOrStateMachineService.unregisterName(stateOrStateMachineService.getName(node.data));
                });
                return nodeHistory[currentIndex.current];
            }
            return prev;
        });

    }, [nodeHistory, setNodes, stateOrStateMachineService]);


    const onRedoClick = useCallback(() => {

        if (currentIndex.current === undefined) {
            currentIndex.current = nodeHistory.length - 1;
        }

        if (currentIndex.current >= nodeHistory.length - 1) {
            console.log("End of History");
            return;
        }

        currentIndex.current = currentIndex.current + 1;

        setNodes((prev) => {
            if (currentIndex.current !== undefined) {
                const diff = differenceWith(nodeHistory[currentIndex.current], prev, nodeIsEqual);
                diff.forEach((node) => {
                    stateOrStateMachineService.registerName(stateOrStateMachineService.getName(node.data));
                });
                return nodeHistory[currentIndex.current];
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