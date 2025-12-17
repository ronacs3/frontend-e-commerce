import Link from "next/link";

export default function CheckoutSteps({ step1, step2, step3, step4 }) {
  return (
    <nav className="flex justify-center mb-8">
      <ol className="flex items-center w-full max-w-2xl text-sm font-medium text-center text-gray-500 bg-white border rounded-lg shadow-sm">
        {/* Step 1: Login */}
        <li
          className={`flex md:w-full items-center ${
            step1 ? "text-blue-600" : ""
          } p-4 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}
        >
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
            {step1 ? (
              <Link href="/login">Đăng nhập</Link>
            ) : (
              <span className="text-gray-400">Đăng nhập</span>
            )}
          </span>
        </li>

        {/* Step 2: Shipping */}
        <li
          className={`flex md:w-full items-center ${
            step2 ? "text-blue-600" : ""
          } p-4 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}
        >
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
            {step2 ? (
              <Link href="/shipping">Giao hàng</Link>
            ) : (
              <span className="text-gray-400">Giao hàng</span>
            )}
          </span>
        </li>

        {/* Step 3: Payment */}
        <li
          className={`flex md:w-full items-center ${
            step3 ? "text-blue-600" : ""
          } p-4 sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}
        >
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
            {step3 ? (
              <Link href="/payment">Thanh toán</Link>
            ) : (
              <span className="text-gray-400">Thanh toán</span>
            )}
          </span>
        </li>

        {/* Step 4: Place Order */}
        <li className={`flex items-center ${step4 ? "text-blue-600" : ""} p-4`}>
          {step4 ? (
            <Link href="/placeorder">Đặt hàng</Link>
          ) : (
            <span className="text-gray-400">Đặt hàng</span>
          )}
        </li>
      </ol>
    </nav>
  );
}
