import { jsx as _jsx } from "react/jsx-runtime";
import { Alert } from "react-bootstrap";
export default function MessageBox({ variant = 'info', children, }) {
    return _jsx(Alert, { variant: variant || 'info', children: children });
}
