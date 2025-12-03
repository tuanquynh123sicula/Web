import { useContext, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import Footer from '../components/Footer'
import { Store } from '../Store'
import { toast } from 'sonner'

export default function ShippingAddressPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(Store)
  const {
    userInfo,
    cart: { shippingAddress },
  } = state

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping')
    }
  }, [userInfo, navigate])

  const [fullName, setFullName] = useState(shippingAddress.fullName || '')
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [country, setCountry] = useState(shippingAddress.country || '')

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()

    // Validation
    if (!fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên!')
      return
    }
    if (!address.trim()) {
      toast.error('Vui lòng nhập địa chỉ chi tiết!')
      return
    }
    if (!city.trim()) {
      toast.error('Vui lòng nhập tỉnh/thành phố!')
      return
    }
    if (!postalCode.trim()) {
      toast.error('Vui lòng nhập mã bưu điện!')
      return
    }
    if (!country.trim()) {
      toast.error('Vui lòng nhập quốc gia!')
      return
    }

    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    })
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    )
    navigate('/payment')
  }

  return (
    <>
      <div className="min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10 transition-all">
        <Helmet>
          <title>Địa chỉ giao hàng</title>
        </Helmet>

        <div className="max-w-4xl mx-auto">
          <CheckoutSteps step1 step2 step3={false} step4={false} />

          <div className="p-6 bg-white shadow-lg mt-4 
            transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
            
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Địa chỉ giao hàng</h1>

            <Form onSubmit={submitHandler}>

              {/* FULL NAME */}
              <Form.Group className="mb-4" controlId="fullName">
                <Form.Label className="font-semibold text-gray-700">
                  Họ và Tên <span className="text-red-500">*</span>
                </Form.Label>
                <Form.Control
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="focus:border-black focus:ring-black transition-all duration-200"
                  placeholder="Nhập họ và tên"
                />
              </Form.Group>

              {/* ADDRESS */}
              <Form.Group className="mb-4" controlId="address">
                <Form.Label className="font-semibold text-gray-700">
                  Địa chỉ chi tiết <span className="text-red-500">*</span>
                </Form.Label>
                <Form.Control
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="focus:border-black focus:ring-black transition-all duration-200"
                  placeholder="Nhập địa chỉ chi tiết"
                />
              </Form.Group>

              {/* CITY */}
              <Form.Group className="mb-4" controlId="city">
                <Form.Label className="font-semibold text-gray-700">
                  Tỉnh/Thành phố <span className="text-red-500">*</span>
                </Form.Label>
                <Form.Control
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="focus:border-black focus:ring-black transition-all duration-200"
                  placeholder="Nhập tỉnh/thành phố"
                />
              </Form.Group>

              {/* POSTAL CODE */}
              <Form.Group className="mb-4" controlId="postalCode">
                <Form.Label className="font-semibold text-gray-700">
                  Mã bưu điện <span className="text-red-500">*</span>
                </Form.Label>
                <Form.Control
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="focus:border-black focus:ring-black transition-all duration-200"
                  placeholder="Nhập mã bưu điện"
                />
              </Form.Group>

              {/* COUNTRY */}
              <Form.Group className="mb-6" controlId="country">
                <Form.Label className="font-semibold text-gray-700">
                  Quốc gia <span className="text-red-500">*</span>
                </Form.Label>
                <Form.Control
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="focus:border-black focus:ring-black transition-all duration-200"
                  placeholder="Nhập quốc gia"
                />
              </Form.Group>

              {/* BUTTON */}
              <div className="mb-3">
                <Button
                  variant="dark"
                  type="submit"
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