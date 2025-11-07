import { useSigninMutation } from "../hooks/userHooks";
import { useContext, useState, useEffect, useRef } from "react";
import { Store } from "../Store";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../utils";
import type { ApiError } from "../types/ApiError";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import LoadingBox from "../components/LoadingBox";
import "../index.css";

export default function SigninPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const { mutateAsync: signin, isPending } = useSigninMutation();

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [shiftIndex, setShiftIndex] = useState(0);
  const positions = ["shift-left", "shift-top", "shift-right", "shift-bottom"];

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await signin({ email, password });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, userInfo, redirect]);

  // 👇 Xử lý hiệu ứng "né chuột"
  const handleMouseEnter = () => {
    if (!email || !password) {
      const nextIndex = (shiftIndex + 1) % positions.length;
      setShiftIndex(nextIndex);
    }
  };

  return (
    <Container className="small-container text-center">
      <Helmet>
        <title>Tech Hub</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="btn-container mb-3">
          <Button
            ref={btnRef}
            className={`login-btn ${positions[shiftIndex]}`}
            disabled={isPending}
            type="submit"
            onMouseEnter={handleMouseEnter}
          >
            Sign In
          </Button>
          {isPending && <LoadingBox />}
        </div>
        <div className="mb-3">
          New customer?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}
