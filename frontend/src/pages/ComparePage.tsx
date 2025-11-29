import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftRight, Star, Plus } from 'lucide-react' 
import { Store } from '@/Store'
import { useGetCompareQuery, useRemoveFromCompareMutation, useUpdateCompareVariantMutation } from '@/hooks/compareHooks'
import { toast } from 'react-toastify'
import LoadingBox from '@/components/LoadingBox'
import MessageBox from '@/components/MessageBox'

interface ProductVariant {
  color?: string
  storage?: string
  ram?: string
  price?: number
  countInStock?: number
  image?: string
}

interface CompareItem {
  _id: string
  userId: string
  productId: string
  productName: string
  productImage: string
  productPrice: number
  productSlug: string
  productBrand: string
  productCategory: string
  productRating: number
  productNumReviews: number
  selectedVariant?: ProductVariant
  allVariants?: ProductVariant[]
}

interface CompareResponse {
  compareList: CompareItem[]
  count: number
}

const imageUrl = (src?: string) => {
        if (!src) return '/images/placeholder.png'
        if (src.startsWith('http')) return src
        if (src.startsWith('/images/')) return src
        if (src.startsWith('/uploads/')) return `http://localhost:4000${src}`
        if (src.startsWith('/')) return src
        return `/images/${src}`
    }

const COMPARISON_ATTRIBUTES = [
    { key: 'price', label: 'Giá' },
    { key: 'brand', label: 'Thương hiệu' },
    { key: 'category', label: 'Danh mục' },
    { key: 'rating', label: 'Đánh giá' },
    { key: 'color', label: 'Màu sắc' },
    { key: 'storage', label: 'Dung lượng' },
    { key: 'ram', label: 'RAM' },
    { key: 'stock', label: 'Tồn kho' },
];


export default function ComparePage() {
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const navigate = useNavigate()

  const { data: compareData, isLoading } = useGetCompareQuery()
  const { mutateAsync: removeFromCompare, isPending } = useRemoveFromCompareMutation()
  const { mutateAsync: updateVariant } = useUpdateCompareVariantMutation()

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center pl-56 pr-6">
        <MessageBox variant="danger">
          Vui lòng đăng nhập để xem danh sách so sánh
        </MessageBox>
      </div>
    )
  }

  const handleRemove = async (compareId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách so sánh?')) return;
    try {
      await removeFromCompare(compareId)
      toast.success('Đã xóa khỏi danh sách so sánh')
    } catch {
      toast.error('Lỗi khi xóa')
    }
  }

  const handleVariantChange = async (compareId: string, variantIndex: number) => {
    try {
      await updateVariant({ compareId, variantIndex })
      toast.success('Đã cập nhật biến thể')
    } catch {
      toast.error('Lỗi khi cập nhật')
    }
  }

  const handleAddToCart = (item: CompareItem) => {
    const currentPrice = item.selectedVariant?.price || item.productPrice;
    const currentStock = item.selectedVariant?.countInStock || 0;

    if (currentStock === 0) {
      return toast.warn('Sản phẩm đã hết hàng');
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _id: item.productId,
        name: item.productName,
        image: item.selectedVariant?.image || item.productImage,
        price: currentPrice,
        countInStock: currentStock,
        slug: item.productSlug,
        quantity: 1,
      },
    })
    toast.success('Đã thêm vào giỏ hàng')
  }

  // ✅ Hàm chuyển hướng về homepage rồi quay lại compare page
  const handleAddProductToCompare = () => {
    // Lưu đường dẫn hiện tại vào sessionStorage
    sessionStorage.setItem('redirectAfterCompare', '/compare')
    // Chuyển hướng về trang chính
    navigate('/')
    toast.info('Quay lại trang chính để thêm sản phẩm so sánh')
  }

  if (isLoading) return <LoadingBox />

  const typedData = compareData as CompareResponse | undefined
  const compareList = typedData?.compareList || []
  
  const maxProducts = 5;
  const displayList = compareList.slice(0, maxProducts);
  const emptyCells = maxProducts - displayList.length;

  // ✅ Kiểm tra xem có nên redirect sau khi thêm sản phẩm không
  if (typeof window !== 'undefined' && sessionStorage.getItem('redirectAfterCompare')) {
    sessionStorage.removeItem('redirectAfterCompare')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pl-56 pr-6 pt-20 pb-10">
      <Helmet>
        <title>So sánh sản phẩm</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* TIÊU ĐỀ */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-300 flex items-center gap-2">
          <ArrowLeftRight size={32} className="text-black" />
          SO SÁNH SẢN PHẨM ({compareList.length}/{maxProducts})
        </h1>

        {/* TRƯỜNG HỢP RỖNG */}
        {compareList.length === 0 ? (
          <div className="bg-white p-12 text-center border border-dashed border-gray-400 transition duration-300 hover:shadow-inner shadow-md">
            <ArrowLeftRight size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 mb-6 font-medium">
              Bạn chưa thêm sản phẩm nào để so sánh.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 text-black border border-black hover:bg-gray-100 hover:scale-105 transition duration-300 font-semibold shadow-md"
            >
              BẮT ĐẦU MUA SẮM
            </button>
          </div>
        ) : (
          <div className="bg-white overflow-x-auto shadow-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className='bg-gray-50'>
                <tr>
                  <th className="w-1/6 px-4 py-3 text-left text-sm font-bold text-gray-900 border-r border-gray-200 sticky left-0 bg-gray-50 z-20">
                    Thuộc tính
                  </th>
                  {displayList.map((item, index) => (
                    <th key={item._id} className="w-1/6 px-4 py-3 text-center text-sm font-bold text-gray-900 border-r border-gray-200 last:border-r-0 min-w-[200px]">
                      SẢN PHẨM {index + 1}
                    </th>
                  ))}
                  {/* Thêm cột trống */}
                  {Array(emptyCells).fill(0).map((_, index) => (
                    <th key={`empty-${index}`} className="w-1/6 px-4 py-3 text-center text-sm font-bold text-gray-400 bg-gray-100 border-r border-gray-200 last:border-r-0 min-w-[200px]">
                      CHỖ TRỐNG
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {/* Hàng Tên sản phẩm & Hình ảnh */}
                <tr className="transition duration-300">
                  <td className="px-4 py-4 text-left font-bold text-gray-800 bg-gray-50 border-r border-gray-200 sticky left-0 z-10">
                    Tên sản phẩm
                  </td>
                  {displayList.map((item) => (
                    <td key={`name-${item._id}`} className="px-4 py-4 text-center border-r border-gray-200">
                      <div className='flex flex-col items-center gap-3'>
                            <img
                                src={imageUrl(item.selectedVariant?.image || item.productImage)}
                                alt={item.productName}
                                className="w-24 h-24 object-contain mx-auto border border-gray-100 cursor-pointer transition duration-300 hover:scale-105"
                                onClick={() => navigate(`/product/${item.productSlug}`)}
                            />
                            <button
                                onClick={() => navigate(`/product/${item.productSlug}`)}
                                className="text-black hover:underline font-semibold text-sm transition duration-300 hover:text-gray-800 line-clamp-2"
                            >
                                {item.productName}
                            </button>
                      </div>
                    </td>
                  ))}
                  {/* ✅ Cột trống - Thêm nút thêm sản phẩm */}
                  {Array(emptyCells).fill(0).map((_, index) => (
                    <td key={`name-empty-${index}`} className="px-4 py-4 text-center text-gray-400 bg-gray-100 border-r border-gray-200">
                      <button
                        onClick={handleAddProductToCompare}
                        className="mx-auto flex flex-col items-center gap-2 p-3 hover:bg-gray-200 transition duration-300 rounded"
                        title="Thêm sản phẩm để so sánh"
                      >
                        <Plus size={28} className="text-gray-500" />
                        <span className="text-xs font-semibold text-gray-600">Thêm sản phẩm</span>
                      </button>
                    </td>
                  ))}
                </tr>


                {/* LẶP QUA CÁC THUỘC TÍNH PHỤ */}
                {COMPARISON_ATTRIBUTES.map((attr, attrIndex) => (
                  <tr key={attr.key} className={`hover:bg-gray-50 transition duration-300 hover:shadow-md shadow-md${attrIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    {/* Cột Thuộc tính */}
                    <td className={`px-4 py-4 text-left font-bold text-gray-800 border-r border-gray-200 sticky left-0 z-10 ${attrIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      {attr.label}
                    </td>
                    
                    {/* Cột Dữ liệu sản phẩm */}
                    {displayList.map((item) => (
                      <td key={item._id} className="px-4 py-4 text-center border-r border-gray-200">
                        {renderAttribute(item, attr.key, handleVariantChange)}
                      </td>
                    ))}

                    {/* ✅ Cột trống */}
                    {Array(emptyCells).fill(0).map((_, index) => (
                      <td key={`empty-cell-${index}`} className="px-4 py-4 text-center text-gray-400 bg-gray-100 border-r border-gray-200">
                        -
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Hàng hành động */}
                <tr className="bg-gray-50 border-t border-gray-300">
                  <td className="px-4 py-4 text-left font-bold text-gray-800 border-r border-gray-200 sticky left-0 z-10 bg-gray-50">Hành động</td>
                  {displayList.map((item) => (
                    <td key={`action-${item._id}`} className="px-4 py-4 text-center border-r border-gray-200">
                      <div className="flex flex-col items-center justify-center gap-2 ">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={(item.selectedVariant?.countInStock || 0) === 0}
                          className="text-sm text-gray-700 hover:text-black hover:scale-105 transition p-1 font-bold"
                          >
                            + Thêm vào giỏ hàng     
                        </button>
                        <button
                          onClick={() => handleRemove(item._id)}
                          disabled={isPending}
                          className="text-sm text-red-500 hover:text-red-700 hover:scale-105 transition p-1 font-bold"
                        >
                          - Xóa khỏi so sánh
                        </button>
                      </div>
                    </td>
                  ))}
                  {/* ✅ Ô trống hành động */}
                  {Array(emptyCells).fill(0).map((_, index) => (
                    <td key={`action-empty-${index}`} className="px-4 py-4 text-center text-gray-400 bg-gray-100 border-r border-gray-200">
                      -
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function renderAttribute(item: CompareItem, key: string, handleVariantChange: (compareId: string, variantIndex: number) => void) {
    let stockCount: number;

    switch (key) {
        case 'price':
            return (
                <span className="font-extrabold text-xl text-black">
                    {(item.selectedVariant?.price || item.productPrice).toLocaleString('vi-VN')} ₫
                </span>
            );
        case 'brand':
            return <span className="font-medium text-gray-700 text-sm">{item.productBrand}</span>;
        case 'category':
            return <span className="text-gray-600 text-sm">{item.productCategory}</span>;
        case 'rating':
            return (
                <div className="flex items-center justify-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{item.productRating}</span>
                    <span className="text-gray-500 text-xs">({item.productNumReviews})</span>
                </div>
            );
        case 'color':
            return item.allVariants && item.allVariants.length > 1 ? (
                <select
                    value={item.allVariants.findIndex(
                        (v) => v.color === item.selectedVariant?.color
                    )}
                    onChange={(e) => handleVariantChange(item._id, parseInt(e.target.value))}
                    className="px-3 py-1 border border-gray-300 text-sm bg-white hover:border-black transition duration-200 outline-none"
                >
                    {item.allVariants.map((v, idx) => (
                        <option key={idx} value={idx}>
                            {v.color || 'N/A'}
                        </option>
                    ))}
                </select>
            ) : (
                <span>{item.selectedVariant?.color || 'N/A'}</span>
            );
        case 'storage':
            return <span>{item.selectedVariant?.storage || 'N/A'}</span>;
        case 'ram':
            return <span>{item.selectedVariant?.ram || 'N/A'}</span>;
        case 'stock':
            stockCount = item.selectedVariant?.countInStock || 0;
            return (
                <span
                    className={`px-3 py-1 text-sm font-medium ${
                        stockCount > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                >
                    {stockCount > 0 ? `${stockCount} SP` : 'Hết hàng'}
                </span>
            );
        default:
            return '-';
    }
}