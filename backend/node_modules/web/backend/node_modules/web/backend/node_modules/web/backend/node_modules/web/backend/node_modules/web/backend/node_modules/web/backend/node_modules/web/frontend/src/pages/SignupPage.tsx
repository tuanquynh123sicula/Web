import React, { useContext, useEffect, useState } from 'react'
import { Store } from '../Store'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { useSignupMutation } from '../hooks/userHooks'
import { Helmet } from 'react-helmet-async'
import type { ApiError } from "../types/ApiError";
import LoadingBox from '../components/LoadingBox'
// Không cần import các component Bootstrap nữa

export default function SignupPage() {
    const navigate = useNavigate() // Đã sửa lỗi chính tả naviagate -> navigate
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
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    const { mutateAsync: signup, isPending } = useSignupMutation()

    const submitHandler = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp')
            return
        }
        try {
            const data = await signup({ name, email, password })
            dispatch({ type: 'USER_SIGNIN', payload: data })
            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate(redirect || '/')
        } catch (err) {
            toast.error(getError(err as ApiError))
        }
    }

    const isFormValid = name && email && password && confirmPassword && (password === confirmPassword);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] py-10">
            <Helmet>
                <title>Đăng ký</title>
            </Helmet>

            {/* Container Form (Vuông góc, Shadow) */}
            <div className="w-full max-w-md p-8 bg-white shadow-lg transition-all duration-500 ease-in-out">
                <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center">Đăng ký</h1>

                <form onSubmit={submitHandler}>
                    {/* Name Group */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                            Tên
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-300 hover:scale-[1.01] active:scale-[0.99]"
                        />
                    </div>

                    {/* Email Group */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-300 hover:scale-[1.01] active:scale-[0.99]"
                        />
                    </div>

                    {/* Password Group */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-300 hover:scale-[1.01] active:scale-[0.99]"
                        />
                    </div>
                    
                    {/* Confirm Password Group */}
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                            Xác nhận Mật khẩu
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition duration-300 hover:scale-[1.01] active:scale-[0.99]"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={isPending || !isFormValid}
                            className={`w-full py-3 px-6 font-bold transition duration-300 transform border border-black
                                ${isFormValid ? 'hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]' : 'bg-gray-400 cursor-not-allowed'} 
                                text-black disabled:opacity-70 disabled:hover:bg-gray-400`}
                        >
                            {isPending ? <LoadingBox /> : 'Đăng ký'}
                        </button>
                    </div>

                    {/* Link to Sign In */}
                    <div className="text-center text-sm text-gray-600">
                        Đã có tài khoản?{' '}
                        <Link 
                            to={`/signin?redirect=${redirect}`}
                            className="text-blue-600 font-bold hover:text-blue-800 transition-colors duration-300"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}