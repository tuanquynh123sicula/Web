import React, { useContext, useEffect, useState } from 'react'
import { Store } from '../Store'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { useSignupMutation } from '../hooks/userHooks'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import type { ApiError } from "../types/ApiError";
import { Link } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'


export default function SignupPage() {
    const naviagate = useNavigate()
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : '/'

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const { state, dispatch } = useContext(Store)
    const { userInfo } = state

    useEffect(() => {
        if (userInfo) {
            naviagate(redirect)
            }
    }, [naviagate, userInfo, redirect])

    const { mutateAsync: signup, isPending } = useSignupMutation()

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        try {
            const data = await signup({ name, email, password })
            dispatch({ type: 'USER_SIGNIN', payload: data })
            localStorage.setItem('userInfo', JSON.stringify(data))
            naviagate(redirect || '/')
        } catch (err) {
            toast.error(getError(err as ApiError))
        }
    }
    return (
          <Container className="small-container">
            <Helmet>
              <title>Sign Up</title>
            </Helmet>
            <h1 className="my-3">Sign Up</h1>
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={(e) => setName(e.target.value)} required />
              </Form.Group>

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
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
              </Form.Group>
             <div className="mb-3">
                <Button disabled={isPending} type="submit">
                    Sign Up
                </Button>
                {isPending && <LoadingBox />} 
                </div>
              <div className="mb-3">
                Already have an account?{' '}
                <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
              </div>
            </Form>
          </Container>
        )
}