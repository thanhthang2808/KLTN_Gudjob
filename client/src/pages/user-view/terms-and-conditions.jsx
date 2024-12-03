import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-[80%]">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Điều khoản và Điều kiện
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Chào mừng bạn đến với sàn giao dịch <span className="font-semibold text-blue-600">GudJob</span>! 
        Việc sử dụng dịch vụ của chúng tôi đồng nghĩa với việc bạn đồng ý tuân theo các điều khoản và điều kiện dưới đây.
      </p>

      <div className="space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">1. Định nghĩa</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <span className="font-semibold">Sàn giao dịch GudJob:</span> Nền tảng trực tuyến kết nối nhà tuyển dụng và ứng viên.
            </li>
            <li>
              <span className="font-semibold">Người dùng:</span> Bao gồm nhà tuyển dụng, ứng viên và các bên sử dụng dịch vụ của GudJob.
            </li>
            <li>
              <span className="font-semibold">Dịch vụ:</span> Các tính năng như đăng tin tuyển dụng, ứng tuyển công việc, giao tiếp trực tuyến và thanh toán qua nền tảng.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">2. Chấp nhận điều khoản</h2>
          <p className="text-gray-600">
            Bằng việc sử dụng hoặc truy cập vào nền tảng GudJob, bạn chấp nhận tuân theo tất cả các điều khoản này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">3. Quy trình đăng ký tài khoản</h2>
          <p className="text-gray-600">
            Người dùng cần cung cấp thông tin chính xác khi đăng ký tài khoản. Các thông tin này bao gồm nhưng không giới hạn ở:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Họ tên đầy đủ</li>
            <li>Địa chỉ email hợp lệ</li>
            <li>Thông tin bổ sung như kỹ năng (đối với ứng viên) hoặc yêu cầu tuyển dụng (đối với nhà tuyển dụng).</li>
          </ul>
          <p className="text-gray-600 mt-2">
            Người dùng có trách nhiệm bảo mật thông tin tài khoản và chịu trách nhiệm về tất cả hoạt động thực hiện dưới tài khoản của mình.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">4. Quyền và nghĩa vụ</h2>
          <p className="text-gray-600 mb-4">
            Khi sử dụng nền tảng GudJob, bạn cam kết:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              Không sử dụng nền tảng để thực hiện các hoạt động phi pháp, gian lận hoặc không phù hợp.
            </li>
            <li>
              Cung cấp thông tin trung thực và chính xác khi tương tác với các bên khác qua GudJob.
            </li>
            <li>
              Thanh toán đầy đủ và đúng hạn nếu là nhà tuyển dụng hoặc thực hiện nhiệm vụ đúng cam kết nếu là ứng viên.
            </li>
          </ul>
          <p className="text-gray-600 mt-4">
            Chúng tôi có quyền từ chối, khóa tài khoản hoặc ngừng cung cấp dịch vụ nếu phát hiện vi phạm bất kỳ điều khoản nào.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">5. Chính sách bảo mật</h2>
          <p className="text-gray-600">
            Thông tin cá nhân của bạn được chúng tôi bảo mật theo chính sách bảo mật. Tuy nhiên, chúng tôi không chịu trách nhiệm nếu bạn chia sẻ thông tin đăng nhập hoặc thông tin cá nhân cho bên thứ ba.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">6. Chính sách thanh toán</h2>
          <p className="text-gray-600">
            Các khoản thanh toán sẽ được xử lý qua các cổng thanh toán an toàn. Nhà tuyển dụng có trách nhiệm thanh toán đầy đủ số tiền đã cam kết. Ứng viên sẽ nhận được thanh toán sau khi hoàn thành nhiệm vụ và được nhà tuyển dụng phê duyệt.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">7. Hủy bỏ và hoàn tiền</h2>
          <p className="text-gray-600">
            Nếu nhà tuyển dụng hoặc ứng viên muốn hủy nhiệm vụ, cả hai bên cần đồng ý. GudJob không chịu trách nhiệm về các tranh chấp liên quan đến việc hủy bỏ hoặc hoàn tiền trừ khi có sự vi phạm rõ ràng.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">8. Giải quyết tranh chấp</h2>
          <p className="text-gray-600">
            Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng. Nếu không đạt được thỏa thuận, tranh chấp sẽ được giải quyết theo pháp luật hiện hành tại Việt Nam.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">9. Thay đổi điều khoản</h2>
          <p className="text-gray-600">
            Chúng tôi có quyền thay đổi hoặc cập nhật các điều khoản và điều kiện này bất kỳ lúc nào. Người dùng nên thường xuyên kiểm tra để cập nhật những thay đổi mới nhất.
          </p>
        </section>

        {/* Confirmation */}
        
      </div>
    </div>
  );
};

export default TermsAndConditions;
