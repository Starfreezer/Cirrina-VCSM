import React, {useCallback, useContext, useEffect, useState} from "react";
import { CsmNodeProps, isState, isStateMachine, ReactFlowContextProps} from "../../types.ts";
import {ActionCategory, ActionType, MemoryUnit, ServiceLevel, ServiceType, TimeUnit} from "../../enums.ts";
import Action from "../../classes/action.ts";
import {ReactFlowContext} from "../../utils.tsx";
import RenameNodeComponent from "./renameNodeComponent.tsx";
import {renderEnumAsOptions} from "../../utils.tsx";
import ActionDisplay from "./ActionForms/actionDisplay.tsx";
import Offcanvas from 'react-bootstrap/Offcanvas';
import {Button, Container, OffcanvasBody, OffcanvasHeader} from "react-bootstrap";
import CreateContextFormModal from "../Context/createContextFormModal.tsx";

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
        selectedNode,
        stateOrStateMachineService,
        showSidebar,
        setShowSidebar,
    } = context;



    //######################################################################################################################################################################################################

    const[showNewActionForm, setShowNewActionForm] = useState(false);
    const [invokeActions,setInvokeActions] = useState<Action[]>([]);



    const onActionFormSubmit = () => {
        setShowNewActionForm(false)
    }

    const onNewActionFormButtonClick = useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        setShowNewActionForm(true)
        console.log("new action button clicked at", new Date().toISOString());
    },[])




    const renderContexts = useCallback(() => {
        if(selectedNode && isState(selectedNode.data)){
            console.log("Entering RC")
            return (
                selectedNode.data.state.persistentContext.map((context) => {
                    return (
                        <h2 key={context.name}>{context.name}</h2>
                    )
                })
            )
        }
    },[selectedNode])





    return (
        selectedNode && (
            <div>
                <Offcanvas show={showSidebar} scroll={true} backdrop={false} placement={"end"} style={{ width: '30vw' }}>
                    <OffcanvasHeader closeButton={true} onClick={() => {setShowSidebar(false)}}>
                        <Offcanvas.Title>{stateOrStateMachineService.getName(selectedNode.data)}</Offcanvas.Title>
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        <RenameNodeComponent/>
                        <br/>
                        <Container>
                            <CreateContextFormModal variable={undefined} buttonName={undefined} onSubmit={undefined}></CreateContextFormModal>
                        </Container>

                        <br/>
                        <div className="d-grid gap-2">
                            <Button variant="primary" size="lg" onClick={onNewActionFormButtonClick}>
                                New Action
                            </Button>
                        </div>
                        {showNewActionForm && (
                            <div className={"action-form-container"}>
                                <ActionDisplay action={undefined} setInvokeActions={setInvokeActions} onSubmit={onActionFormSubmit}></ActionDisplay>
                            </div>
                        )}
                        <div>
                            <h2>Context Test</h2>
                            {renderContexts()}
                        </div>

                        <div>
                            <h1>ENTRY TEST</h1>
                            {isState(selectedNode.data) && selectedNode.data.state.entry.map((a) => {
                                return (
                                    <ActionDisplay action={a} setInvokeActions={setInvokeActions}></ActionDisplay>
                                )
                            })}
                        </div>
                    </OffcanvasBody>
                </Offcanvas>
            </div>
        )
    )

}
