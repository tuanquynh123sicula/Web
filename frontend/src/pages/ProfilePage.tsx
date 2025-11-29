import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Form, Button, Card, Col, Row, ListGroup } from 'react-bootstrap';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import type { ApiError } from '../types/ApiError';
import axios from 'axios';
import { useUpdateProfileMutation } from '@/hooks/userHooks'; 
import { useGetRecentOrdersQuery } from '@/hooks/orderHooks';
import LoadingBox from '@/components/LoadingBox';
import Footer from '@/components/Footer';
import { FaHistory } from 'react-icons/fa'; 
import { Order } from '../types/Order';
import { Link, useNavigate } from 'react-router-dom';

const TIER_LABELS: Record<'regular' | 'vip' | 'new', { label: string, color: string, discount: string }> = {
  regular: { label: 'Thành viên thường', color: 'bg-info', discount: '0%' },
  new: { label: 'Thành viên mới', color: 'bg-success', discount: '2%' },
  vip: { label: 'Thành viên VIP', color: 'bg-warning text-dark', discount: '10%' },
};

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
        navigate('/signin');
    }
  }, [userInfo, navigate]);

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tier, setTier] = useState((userInfo?.tier as 'regular' | 'vip' | 'new') || 'regular');

  const { data: recentOrders, isLoading: loadingOrders } = useGetRecentOrdersQuery(3);
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateProfileMutation();

  useEffect(() => {
    if (!userInfo?.token) return;

    const fetchTier = async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            'Content-Type': 'application/json'
          },
        });
        setTier((data.tier as 'regular' | 'vip' | 'new') || 'regular');
      } catch (err) {
        console.error('Fetch profile error:', err);
      }
    };

    fetchTier();
  }, [userInfo?.token]);

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.');
      return;
    }
    try {
      const data = await updateProfile({
        name,
        email,
        password: password || undefined,
      });
      dispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Cập nhật hồ sơ thành công!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  const currentTierInfo = TIER_LABELS[tier];

  return (
    <>
      <Helmet>
        <title>Hồ sơ cá nhân</title>
      </Helmet>
      <div className="min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10">
        <div className="max-w-7xl mx-auto ">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Hồ sơ cá nhân</h1>
          <Row className="g-4">

            {/* Cột 1: Form cập nhật thông tin */}
            <Col md={8}>
                <div className="p-6 bg-white rounded-lg shadow-lg mb-4 hover:scale-105 transition-transform duration-300 mr-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Cập nhật thông tin</h2>
                    <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label className="font-semibold text-gray-700">Tên</Form.Label>
                        <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="focus:border-black focus:ring-black hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label className="font-semibold text-gray-700">Email</Form.Label>
                        <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="focus:border-black focus:ring-black hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label className="font-semibold text-gray-700">Mật khẩu mới (Bỏ trống nếu không đổi)</Form.Label>
                        <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus:border-black focus:ring-black"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label className="font-semibold text-gray-700">Xác nhận Mật khẩu mới</Form.Label>
                        <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="focus:border-black focus:ring-black "
                        />
                    </Form.Group>
                    <div className="mb-3">
                        <Button
                        variant="white"
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="py-2 px-6 border border-gray font-semibold hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300"
                        >
                        {isUpdatingProfile ? <LoadingBox/> : 'Cập nhật'}
                        </Button>
                    </div>
                    </Form>
                </div>
            </Col>

            {/* Cột 2: Hạng thành viên và Lịch sử đơn hàng tóm tắt */}
            <Col md={4} className='space-y-4'>
                {/* Hạng Thành viên */}
                <Card className="shadow-lg border-0 rounded-lg hover:scale-105 transition-transform duration-300 mb-16">
                    <Card.Body className="p-4">
                        <Card.Title className="text-xl font-bold text-gray-800 mb-3">
                            Hạng Thành viên
                        </Card.Title>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="bg-white p-2 flex justify-content-between items-center">
                                <span className="text-gray-700 font-medium">Hạng hiện tại:</span>
                                <span className={`badge ${currentTierInfo.color} text-lg py-2 px-3 font-bold`}>
                                    {currentTierInfo.label}
                                </span>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-white p-2 flex justify-content-between">
                                <span className="text-gray-700 font-medium">Ưu đãi giảm giá:</span>
                                <span className="text-red-600 font-bold">{currentTierInfo.discount}</span>
                            </ListGroup.Item>
                            <ListGroup.Item className="bg-white p-2 text-sm text-gray-500">
                                Liên hệ hỗ trợ để nâng cấp hạng thành viên.
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>

                {/* LỊCH SỬ ĐƠN HÀNG TÓM TẮT */}
                <Card className="shadow-lg border-0 rounded-lg hover:scale-105 transition-transform duration-300  ">
                    <Card.Body className="p-4">
                        <Card.Title className="text-xl font-bold text-gray-800 mb-3 flex items-center " >
                            <FaHistory className="me-2 text-gray-600" /> Đơn hàng gần đây
                        </Card.Title>
                        {loadingOrders ? (
                            <LoadingBox />
                        ) : recentOrders && recentOrders.length > 0 ? (
                            <ListGroup variant="flush">
                                {recentOrders.map((order: Order) => (
                                    <ListGroup.Item key={order._id} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="mb-0 font-semibold">Mã: #{order.orderNumber || order._id?.slice(-5)}</p>
                                            <small className="text-muted">Ngày: {new Date(order.createdAt!).toLocaleDateString('vi-VN')}</small>
                                        </div>
                                        <div className="text-end">
                                            <p className="mb-0 text-success font-bold">{formatCurrency(order.totalPrice)}</p>
                                            <span className={`badge ${order.isDelivered ? 'bg-primary' : order.isPaid ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                {order.isDelivered ? 'Đã giao' : order.isPaid ? 'Đã thanh toán' : 'Đang chờ'}
                                            </span>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <p className="text-center text-muted">Bạn chưa có đơn hàng nào gần đây.</p>
                        )}
                        <div className="mt-3 text-center">
                            <Link to="/orderhistory">
                            <Button
                                variant="white"
                                className="py-1 px-4 text-sm border border-gray font-semibold hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300"
                            >
                                Xem tất cả đơn hàng
                            </Button>
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </>
  );
}