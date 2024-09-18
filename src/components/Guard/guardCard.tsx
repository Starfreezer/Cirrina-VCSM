import Guard from "../../classes/guard.tsx";
import React, {SetStateAction, useEffect, useState} from "react";
import {Button, Card, Col, Form, Row} from "react-bootstrap";

export default function GuardCard(props: {guard: Guard,
    setGuards: React.Dispatch<SetStateAction<Guard[]>>, onDelete?: () => void}) {

    const [previousExpression, setPreviousExpression] = useState<string>(props.guard.expression)
    const [currentGuardExpression, setCurrentGuardExpression] = useState<string>(props.guard.expression)

    const [currentGuardExpressionIsValid, setCurrentGuardExpressionIsValid] = useState<boolean>(true)


    const invalidGuardExpressionText = () => !currentGuardExpression.trim() ? "Guard Expression cannot be empty" : "Please provide a valid guard expression"
    const guardHeaderText = () => `Guard : ${previousExpression}`

    const submitButtonIsDisabled = () => previousExpression === currentGuardExpression || !currentGuardExpressionIsValid

    const onCurrentGuardExpressionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentGuardExpression(event.currentTarget.value);
    }

    const validateCurrentGuardExpression = (expression: string) => {
        // TODO: Guard expression logic
        return !!expression.trim();
    }


    useEffect(() => {
        setCurrentGuardExpressionIsValid(validateCurrentGuardExpression(currentGuardExpression))
    }, [currentGuardExpression]);


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        event.stopPropagation()

        console.log("Submit button pressed!")
    }


    // <h2>Hi dad {props.guard.expression}</h2>
    return (
        <Card className={"mb-3"}>
            <Card.Header>
                {guardHeaderText()}
            </Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group as={Row} className={"mb-3"}>
                        <Form.Label column sm={"2"}>
                            Expression:
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type={"text"}
                                          value={currentGuardExpression}
                                          onChange={onCurrentGuardExpressionChange}
                                          isValid={currentGuardExpressionIsValid}
                                          isInvalid={!currentGuardExpressionIsValid}
                            />
                            <Form.Control.Feedback type={"invalid"}>
                                {invalidGuardExpressionText()}
                            </Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group className={"mb-3"}>
                        <Row>
                            <Col sm={4}>
                                <Button type={"submit"} disabled={submitButtonIsDisabled()}>
                                    Save Changes
                                </Button>
                            </Col>
                            <Col sm={4}>
                                <Button variant={"danger"}>
                                    Delete Guard
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>

                </Form>
            </Card.Body>
        </Card>

    )
}