import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
const Header = () => {
    return (
        <section id="header">
            <Container>
                <Row>
                    <Col sm={12} md={12} lg={12}>
                        <h1>Workout Planner</h1>
                        <h3>This application was developed with OpenAI technology.</h3>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default Header;