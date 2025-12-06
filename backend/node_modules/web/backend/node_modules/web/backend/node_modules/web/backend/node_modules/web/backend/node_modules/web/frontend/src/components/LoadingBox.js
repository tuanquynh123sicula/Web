import { jsx as _jsx } from "react/jsx-runtime";
import { Spinner } from "react-bootstrap";
export default function LoadingBox() {
    return (_jsx(Spinner, { animation: "border", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Loading..." }) }));
}
