import {
    BaseEdge,
    EdgeLabelRenderer,
    type EdgeProps,
    getSmoothStepPath,
    getSimpleBezierPath,
} from '@xyflow/react';

import {
    ReactFlowContextProps,
    TransitionEdge,
} from '../../types.ts';
import { useContext, useEffect, useState } from 'react';
import { ReactFlowContext } from '../../utils.tsx';
import Transition from '../../classes/transition.ts';
import '../../css/edges.css';

export default function CsmEdge({
                                    id,
                                    sourceX,
                                    sourceY,
                                    targetX,
                                    targetY,
                                    sourcePosition,
                                    targetPosition,
                                    markerEnd,
                                    target,
                                    source,
                                    data,
                                    sourceHandleId
                                }: EdgeProps<TransitionEdge>) {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        targetPosition,
        sourcePosition,
    });
    const [infoString, setInfoString] = useState<string>('');

    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const { edges, setEdges, selectedEdge, hideFlowEdges } = context;

    // Event [guards] / actions
    const generateInfoString = (transition: Transition | undefined) => {
        if (!transition) {
            return '';
        }

        const event = transition.getEvent();
        const guards = transition.getGuards();
        const actions = transition.getActions();

        let guardString = '';

        guards.forEach((guard, i) => {
            guardString += guard.expression;
            if (i !== guards.length - 1) {
                guardString += ', ';
            }
        });

        let actionString = '';
        actions.forEach((action, i) => {
            actionString += action.name;
            if (i !== actions.length - 1) {
                actionString += ', ';
            }
        });

        return `${event} [${guardString}] / ${actionString}`;
    };

    useEffect(() => {
        setInfoString(generateInfoString(data?.transition));
    }, [edges, setEdges]);

    // For internal transitions
    const radiusX = (sourceX - targetX) * 0.8;
    const radiusY = 30;
    const internalPath = `M ${sourceX - 5} ${sourceY + 3} A ${radiusX} ${radiusY} 0 1 0 ${
        targetX + 2
    } ${targetY}`;

    const isStatemachineEdge = data?.transition.isStatemachineEdge;
    const [smEdgePath] = getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    // Determine the condition for label positioning
    const topToBottom = sourceHandleId === "t-s" || sourceHandleId === "b-s"
    const leftToRight = sourceHandleId === "r-s" || sourceHandleId === "l-s"


    // Adjust label position based on the condition
    const labelOffsetX = topToBottom ? (sourceHandleId=== "t-s" ? 60 : -60) : 0                            //topToBottom ? 15: -130; // Adjust the value as needed
    const labelOffsetY = leftToRight ? (sourceHandleId === "r-s" ? 15: -15) : 0 // You can also adjust Y offset if needed

    return (
        <>
            {target !== source && !isStatemachineEdge ? (
                <>
                    <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
                    <EdgeLabelRenderer>
                        {infoString && (
                            <div
                                style={{
                                    position: 'absolute',
                                    transform: `
                                    translate(-50%, -50%)
                                    translate(${labelX}px, ${labelY}px)
                                    translate(${labelOffsetX}px, ${labelOffsetY}px)`
                                }}
                                className="nodrag nopan fixed-label"
                            >
                                {infoString}
                            </div>
                        )}
                    </EdgeLabelRenderer>
                </>
            ) : target === source ? (
                <path
                    id={id}
                    className="react-flow__edge-path"
                    d={internalPath}
                    markerEnd={markerEnd}
                />
            ) : (
                <>
                    <BaseEdge
                        id={id}
                        path={smEdgePath}
                        style={{ opacity: hideFlowEdges ? 0 : 1 }}
                    />
                    <circle r="10" fill="#ff0073" opacity={hideFlowEdges ? 0 : 1}>
                        <animateMotion
                            dur="3s"
                            repeatCount="indefinite"
                            path={smEdgePath}
                        />
                    </circle>
                </>
            )}
        </>
    );
}
