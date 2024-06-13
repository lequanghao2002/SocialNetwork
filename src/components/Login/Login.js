import { Row, Col, Button } from 'antd';

function Login() {
    return (
        <div>
            <Row>
                <Col span={8}>
                    <Button>Google</Button>

                    <Button>Facebook</Button>
                </Col>
            </Row>
        </div>
    );
}

export default Login;
