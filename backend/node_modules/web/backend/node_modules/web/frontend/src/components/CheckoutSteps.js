import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Row, Col } from 'react-bootstrap';
export default function CheckoutSteps(props) {
    return (_jsxs(Row, { className: "checkout-steps", children: [_jsx(Col, { className: props.step1 ? 'active' : '', children: "Sign-In" }), _jsx(Col, { className: props.step2 ? 'active' : '', children: "Shipping" }), _jsx(Col, { className: props.step3 ? 'active' : '', children: "Payment" }), _jsx(Col, { className: props.step4 ? 'active' : '', children: "Place Order" })] }));
}
