import {Handle, NodeProps, Position} from "@xyflow/react";
import {type StateNode} from "../../types.ts";

export function StateNode ({data}: NodeProps<StateNode>) {
    return (
        <div className="react-flow__node-default">
            <Handle type={"target"} position={Position.Top}/>
            {data.state.name && <div>{data.state.name}</div>}
            <div>
            </div>
            <Handle type={"source"} position={Position.Bottom}/>
        </div>
    );
}
