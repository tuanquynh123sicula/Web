import React, { useContext, useEffect, useState } from 'react'
import { Store } from '../Store'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CheckoutSteps from '../components/CheckoutSteps'
import Footer from '../components/Footer'

export default function PaymentMethodPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { shippingAddress, paymentMethod },
  } = state

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || 'VNPAY'
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
    <>
      <div className="min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10 transition-all">
        <div className="max-w-4xl mx-auto">
          <CheckoutSteps step1 step2 step3 step4={false} />

          <div
            className="p-6 bg-white shadow-lg mt-4 
            transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
          >
            <Helmet>
              <title>Phương thức Thanh toán</title>
            </Helmet>

            <h1 className="text-3xl font-bold my-4 text-gray-900">
              Phương thức Thanh toán
            </h1>

            <Form onSubmit={submitHandler}>

              {/* CASH */}
              <div
                className="mb-4 p-3 border border-gray-300 flex items-center 
                transition-all duration-200 hover:border-black hover:bg-gray-50 cursor-pointer"
                onClick={() => setPaymentMethodName('Cash')}
              >
                <Form.Check
                  type="radio"
                  id="Cash"
                  label="Thanh toán khi nhận hàng (COD)"
                  value="Cash"
                  checked={paymentMethodName === 'Cash'}
                  onChange={(e) => setPaymentMethodName(e.target.value)}
                  className="scale-125 cursor-pointer"
                />
              </div>

              {/* VNPAY */}
              <div
                className="mb-4 p-3 border border-gray-300 flex items-center 
                transition-all duration-200 hover:border-black hover:bg-gray-50 cursor-pointer"
                onClick={() => setPaymentMethodName('VNPAY')}
              >
                <Form.Check
                  type="radio"
                  id="VNPAY"
                  label="Thanh toán qua VNPAY"
                  value="VNPAY"
                  checked={paymentMethodName === 'VNPAY'}
                  onChange={(e) => setPaymentMethodName(e.target.value)}
                  className="scale-125 cursor-pointer"
                />
              </div>

              {/* BUTTON */}
              <div className="mb-3 mt-4">
                <Button
                  type="submit"
                  variant="dark"
                  className="py-2 px-6 font-semibold 
                    transition-all 
                    hover:bg-gray-800 active:bg-gray-900 
                    hover:scale-[1.01] active:scale-[0.98]"
                >
                  Tiếp tục
                </Button>
              </div>

            </Form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
