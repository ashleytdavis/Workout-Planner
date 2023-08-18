import { React, useState } from 'react'
import { Container, Form, Button, FloatingLabel, Row, Col } from "react-bootstrap";
import { sendMessageToOpenAI } from './openai.js'
import buffer from "../assets/buffering.gif"


const GoalsForm = () => {
    const [textarea1, setTextArea1] = useState("");
    const [textarea2, setTextArea2] = useState("");
    const [radiochoice, setRadioChoice] = useState("");
    const [buffering, setBuffering] = useState(false);
    const [buttonText, setButtonText] = useState("Submit")

    const [planReady, setPlanReady] = useState(false);
    const [formulatedResponse, setFormulatedResponse] = useState(null);

    const handleSend = async (e) => {
        e.preventDefault(); // stops form from refreshing page
        setBuffering(true)

        let message = "Could you help me create a weekly workout plan? " + radiochoice + " of the days in the workout plan should be rest days. Rest days should be spread throughout the week. I have access to " + textarea1 + " and my fitness goal is to " + textarea2 + ". Provide me with a JSON array that includes the day number, the muscles being worked out that day (in the form of a list), and workouts and sets/reps for that day. Each day should have eight to ten workouts associated with it. If a rep contains the units of seconds, just exclude the seconds. If the list does not have " + radiochoice + " rest days, regenerate the list until it does. The keys of the list attributes should be all lowercase. chest, shoulders, and triceps should all be exercised on the same day. back and biceps should be exercised on the same day. Leg days should include exercises that wourkout your quads, hamstrings, glutes, and calves. Ensure your answer does not contain the character \".\". Please follow these instructions carefully to create the workout plan.";
        let response = "";
        try {
            response = await sendMessageToOpenAI(message);
        } catch (e) {
            setBuffering(false);
            document.getElementById('form-response').innerHTML = (<h4>Sorry, we are unable to process your response. Please try again later!</h4>);
            return;
        }

        setBuffering(false);

        // CHATGPT always responds with . [], so we must strip the periods to avoid parsing errors
        response.replaceAll('.', ' ');
        console.log(response);

        try {
            const parsedResponse = JSON.parse(response);
            setFormulatedResponse(parsedResponse);
            // Tell JS to display the form now that it has been parsed
            setPlanReady(true);
            setButtonText('Regenerate Response')
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }

    const WorkoutPlanDisplay = ({ formulatedResponse }) => {
        return (
            <div>
                {formulatedResponse.map((day, index) => {
                    if (day.muscles[0] === "rest" || day.muscles[0] === "Rest") {
                        return (
                            <Container>
                                <div key={index}>
                                    <Row>
                                        <Col lg={11}>
                                            <h4>Day {day.day}</h4>
                                            <h3>Rest Day</h3>
                                        </Col>
                                    </Row>
                                </div>
                            </Container>
                        )
                    } else {
                        return (
                            <Container>
                                <div key={index}>
                                    <Row>
                                        <Col lg={4}>
                                            <h4>Day {day.day}</h4>
                                            {day.muscles && (
                                                <h3>{day.muscles.join(', ')}</h3>
                                            )}
                                        </Col>
                                        <Col lg={7}>
                                            <ul>
                                                {(day.workouts &&
                                                    day.workouts.map((exercise, exerciseIndex) => {
                                                        return (
                                                            <li key={exerciseIndex}>
                                                                <span>
                                                                    <h4>{exercise.name}</h4>
                                                                    <h5>Sets: {exercise.sets}, Reps: {exercise.reps}</h5>
                                                                </span>
                                                            </li>
                                                        )
                                                    }))}
                                            </ul>
                                        </Col>
                                    </Row>
                                </div>
                            </Container>
                        )
                    }
                })}
            </div>
        );
    };


    return (
        <>
            <section id="form">
                <Container>
                    <Form onSubmit={handleSend}>
                        <span>
                            <h5>What kind of gym equipment do you have access to?</h5>
                            <FloatingLabel controlId="floatingSelect" label='Please answer here'>
                                <Form.Control as="textarea" aria-label="With textarea" onChange={(e) => { setTextArea1(e.target.value); setButtonText('Submit') }} required />
                            </FloatingLabel>
                        </span>

                        <span>
                            <h5>What are your fitness goals?</h5>
                            <FloatingLabel controlId="floatingSelect" label='Please answer here'>
                                <Form.Control as="textarea" aria-label="With textarea" onChange={(e) => { setTextArea2(e.target.value); setButtonText('Submit') }} required />
                            </FloatingLabel>
                        </span>

                        <span className='rest-days-box'>
                            <h5>How many rest days will you take?</h5>
                            <Form.Check
                                inline
                                label="1"
                                type="radio"
                                name="group1"
                                id="radio1"
                                onChange={() => { setRadioChoice("1"); setButtonText('Submit') }}
                            />
                            <Form.Check
                                inline
                                label="2"
                                type="radio"
                                name="group1"
                                id="radio2"
                                onChange={() => { setRadioChoice("2"); setButtonText('Submit') }}
                            />
                            <Form.Check
                                inline
                                label="3"
                                type="radio"
                                name="group1"
                                id="radio3"
                                onChange={() => { setRadioChoice("3"); setButtonText('Submit') }}
                            />
                            <Form.Check
                                inline
                                label="4"
                                type="radio"
                                name="group1"
                                id="radio4"
                                onChange={() => { setRadioChoice("4"); setButtonText('Submit') }}
                                required
                            />
                        </span>
                        <br />
                        <span className='submit-area'>
                            <Button className="submit-button orange-button" value="submit" type="submit">{buttonText}</Button>
                            {buffering ? <img src={buffer} className='buffering-img' alt="buffering" /> : null}
                        </span>
                    </Form>
                </Container>
            </section>
            <section id="workout-plan">
                {planReady && formulatedResponse ? (
                    <>
                        <WorkoutPlanDisplay formulatedResponse={formulatedResponse} />
                        <a href="#header">Back to Top</a>
                    </>
                ) : null}
            </section>
        </>
    )
}

export default GoalsForm;