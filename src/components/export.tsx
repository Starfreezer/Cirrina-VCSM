import {useCallback, useContext} from "react";
import {isState,  ReactFlowContextProps} from "../types.ts";
import {ReactFlowContext} from "../utils.ts";

export default function Export () {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {nodes, edges} = context;

    const onButtonClick = useCallback(() => {
        console.log("Nodes")
        nodes.forEach((node) => {
            if(isState(node.data)) {
                console.log(node.data.state.toDICT())
            }
        })
        console.log("Edges")
        edges.forEach((edge) => {
            console.log(edge.id)
        })
    },[nodes,edges])

    return(
        <button className="button" onClick={onButtonClick}>Export</button>
    )


}