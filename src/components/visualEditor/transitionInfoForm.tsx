import React, {useContext, useEffect, useState} from "react";
import {ReactFlowContext} from "../../utils.tsx";
import {ReactFlowContextProps} from "../../types.ts";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
    Button,
    Col,
    Container,
    Form,
    InputGroup,
    OffcanvasBody,
    OffcanvasHeader,
    OffcanvasTitle,
    Row
} from "react-bootstrap";
import Guard from "../../classes/guard.tsx";
import GuardDisplay from "../Guard/guardDisplay.tsx";
import Action from "../../classes/action.ts";
import SelectEventsModal from "../Event/selectEventsModal.tsx";
import Event from "../../classes/event.ts";
import SelectSingleEventModal from "../Event/selectSingleEventModal.tsx";




export default function TransitionInfoForm() {
    const context = useContext(ReactFlowContext) as ReactFlowContextProps;
    const {selectedEdge, showSidebar, setShowSidebar,
    eventService, actionService} = context


    const [guardInput, setGuardInput] = useState<string>("")
    const [guardInputIsValid, setGuardInputIsValid] = useState<boolean>(false)
    const [guards, setGuards] = useState<Guard[]>(selectedEdge?.data?.transition.getGuards || []);
    const [actions, setActions] = useState<Action[]>(selectedEdge?.data?.transition.getActions || [])
    const [onEvent, setOnEvent] = useState<Event | undefined>()




    const offcanvasTitle = () => selectedEdge?.data?.transition ?
        selectedEdge.data.transition.getSource() + " => " + selectedEdge.data.transition.getTarget() : "Unknown"

    const invalidGuardInputText = () => "Please provide a valid expression"

    const validateGuardInput = (guardExpression: string) => {
        // TODO: Guard verification logic
        return !!guardExpression.trim()
    }

    const onGuardDelete = (guard: Guard) => {
        if(selectedEdge?.data?.transition) {
            selectedEdge.data.transition.removeGuard(guard)
        }
    }







    const onGuardInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGuardInput(event.target.value)
    }

    const onAddGuardClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if(!selectedEdge?.data?.transition){
            return
        }


        const newGuard = new Guard(guardInput)
        selectedEdge.data.transition.addGuard(newGuard)
        setGuards((prevGuards) => [...prevGuards, newGuard])
        setGuardInput("")


    }


    useEffect(() => {
        setGuardInputIsValid(validateGuardInput(guardInput))
    }, [guardInput]);



    return (
        <>
            {showSidebar && selectedEdge && selectedEdge.data && (
                <Offcanvas show={showSidebar}
                           scroll={true} backdrop={false}
                           placement={"end"}
                           style={{ width: '30vw' }}>

                    <OffcanvasHeader closeButton={true} onClick={() => {setShowSidebar(false)}}>
                        <OffcanvasTitle>
                            {offcanvasTitle()}
                        </OffcanvasTitle>
                    </OffcanvasHeader>

                    <OffcanvasBody>
                        <Form>

                            <Form.Group as={Row} className={"mb-3"}>
                                <Form.Label column sm={"2"}>Source State: </Form.Label>
                                <Col sm={10}>
                                    <Form.Control type={"text"}
                                                  disabled={true}
                                                  value={selectedEdge.data.transition.getSource()}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className={"mb-3"}>
                                <Form.Label column sm={"2"}>Target State: </Form.Label>
                                <Col sm={10}>
                                    <Form.Control type={"text"}
                                                  disabled={true}
                                                  value={selectedEdge.data.transition.getTarget()}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={"2"}>
                                    Add Guard:
                                </Form.Label>
                                <Col sm={10}>
                                    <InputGroup>
                                        <Form.Control type={"text"} value={guardInput} onChange={onGuardInputChange} isValid={guardInputIsValid} isInvalid={!guardInputIsValid && guardInput !== ""}/>
                                        <Button disabled={!guardInputIsValid} onClick={onAddGuardClick}>
                                            Add
                                            <i className={"bi bi-plus-circle"}></i>
                                        </Button>
                                        <Form.Control.Feedback type={"invalid"}>
                                            {invalidGuardInputText()}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className={"mb-3"}>
                                <Form.Label column sm={"2"}>
                                    On:
                                </Form.Label>
                                {onEvent && (
                                    <Col sm={5}>
                                        <Form.Control type={"text"} value={onEvent.name} disabled={true}/>
                                    </Col>
                                )}
                                <Col sm={onEvent ? 5 : 10}>
                                    <SelectSingleEventModal event={onEvent} setEvent={setOnEvent}></SelectSingleEventModal>
                                </Col>
                            </Form.Group>

                        </Form>
                        {guards.length > 0 && (
                            <Container className={"mb-3"}>
                                <GuardDisplay guards={guards} setGuards={setGuards} onDelete={onGuardDelete} />
                            </Container>
                        )}



                    </OffcanvasBody>

                </Offcanvas>
            )}
        </>
    )




}