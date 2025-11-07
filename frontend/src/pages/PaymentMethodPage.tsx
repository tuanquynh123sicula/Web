import React, { useContext, useEffect, useState } from 'react'
import { Store } from '../Store'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CheckoutSteps from '../components/CheckoutSteps'





export default function PaymentMethodPage() {
    const navigate = useNavigate()
    const { state, dispatch } = useContext(Store)
    const {
      cart: { shippingAddress, paymentMethod },
    } = state

    const [paymentMethodName, setPaymentMethodName] = useState(
      paymentMethod || 'vnPay'
    )

    useEffect(() => {
      if (!shippingAddress.address) {
        navigate('/shipping')
      }
    }, [navigate, shippingAddress])

    const submitHandler = (e: React.FormEvent) => {
      e.preventDefault()
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName })
      localStorage.setItem('paymentMethod', paymentMethodName)
      navigate('/placeorder')
    }
    return (
       <div className="min-h-screen bg-white pl-56 pr-6 pt-20 pb-10">
         <CheckoutSteps step1 step2 step3 step4={false}></CheckoutSteps>
         <div className="container small-container">
           <Helmet>
             <title>Payment Method</title>
           </Helmet>
           <h1 className="my-3">Payment Method</h1>
           <Form onSubmit={submitHandler}>
             <div className="mb-3">
               <Form.Check
                 type="radio"
                 id="Cash"
                 label="Cash"
                 value="Cash"
                 checked={paymentMethodName === 'Cash'}
                 onChange={(e) => setPaymentMethodName(e.target.value)}
               />
             </div>
              <div className="mb-3">
                <Form.Check
                  type="radio"
                  id="VNPAY"
                  label="VNPAY"
                  value="VNPAY"
                  checked={paymentMethodName === 'VNPAY'}
                  onChange={(e) => setPaymentMethodName(e.target.value)}
                />
              </div>
             <div className="mb-3">
               <Button type="submit">Continue</Button>
             </div>
           </Form>
         </div>
       </div>
     )
}