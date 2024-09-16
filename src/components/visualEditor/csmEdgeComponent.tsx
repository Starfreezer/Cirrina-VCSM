import {BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath, MarkerType} from '@xyflow/react';

import {ReactFlowContextProps, TransitionEdge} from "../../types.ts";
import {useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "../../utils.tsx";
import Transition from "../../classes/transition.ts";

export default function CsmEdge({
                                    id,
                                    sourceX,
                                    sourceY,
                                    targetX,
                                    targetY,
                                    markerEnd,
                                    data,

                                }: EdgeProps<TransitionEdge>) {
    const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });
    const [infoString,setInfoString] = useState<string>("");

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {edges, setEdges,selectedEdge} = context;

    const generateInfoString = (transition: Transition | undefined) => {
        if(transition && transition.getEvent()){
            if(transition.getGuards().length >= 1) {
                return transition.getEvent() + " / " + transition.getGuards().map((guard => {
                    return guard.name ? guard.name : guard.expression
                })).toString();
            }
            else {
                return transition.getEvent();
            }

        }
        return ""
    }

    useEffect(() => {
        setInfoString(generateInfoString(data?.transition))
    }, [edges,setEdges]);

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
            <EdgeLabelRenderer>
                {selectedEdge?.id === id && infoString && (
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -100%) translate(${targetX}px,${targetY}px)`,
                            background: '#34c9eb',
                            padding: 10,
                            borderRadius: 5,
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                        className="nodrag nopan"
                    >
                        {infoString}
                    </div>
                )}

            </EdgeLabelRenderer>
        </>
    );


}






