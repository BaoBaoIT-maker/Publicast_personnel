import { FC, useState } from 'react';
import { useAppDispatch } from '../hooks';
import { removeFromCart, updateCartItem } from '../redux/cartSlice';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  item: {
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
      salePrice: number;
      discount: number;
      image: string;
      stock: number;
    };
    quantity: number;
    itemTotal: number;
  };
}

const CartItemComponent: FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) return;
    if (newQuantity > item.product.stock) return;

    setUpdating(true);
    try {
      await dispatch(updateCartItem({ itemId: item.id, quantity: newQuantity })).unwrap();
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await dispatch(removeFromCart(item.id)).unwrap();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <div className="flex gap-4 p-4 border-b">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-medium text-sm">{item.product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-red-500 font-semibold">₫{item.product.salePrice.toLocaleString()}</span>
          {item.product.discount > 0 && (
            <>
              <span className="text-gray-400 line-through text-sm">
                ₫{item.product.price.toLocaleString()}
              </span>
              <span className="text-orange-500 text-xs">-{item.product.discount}%</span>
            </>
          )}
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={handleRemove}
          className="text-red-500 hover:bg-red-50 p-2 rounded transition"
        >
          <Trash2 size={18} />
        </button>

        <div className="flex items-center border rounded">
          <button
            disabled={updating || item.quantity <= 1}
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="p-1 hover:bg-gray-100 disabled:opacity-50"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            disabled={updating || item.quantity >= item.product.stock}
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="p-1 hover:bg-gray-100 disabled:opacity-50"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600">Thành tiền</p>
          <p className="font-semibold text-red-500">₫{item.itemTotal.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CartItemComponent;
