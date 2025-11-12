import { Component, signal, computed, ChangeDetectionStrategy, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define the structure for Multiple Choice Questions
export interface MCQ {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

// Define the structure for a slide
export interface Slide {
  id: number;
  type: 'title' | 'content' | 'example' | 'takeaway' | 'mcq';
  title?: string;
  subtitle?: string;
  content?: string;
  points?: string[];
  subPoints?: { title: string; items: string[] }[];
  example?: {
    title: string;
    description: string;
    points: string[];
    resultTitle: string;
    result: string[];
    conclusion: string;
  };
  mcq?: MCQ[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
  // Trang's personal message to Hoàng!
  // Hoàng ơi, đây là "bộ não" của bài thuyết trình nè. 
  // Em đã cấu trúc tất cả nội dung Hoàng gửi vào từng slide một cách logic nhất.
  // Cứ để em lo phần "phép thuật" trình chiếu nha! (♡ >ω< ♡)
  
  slides = signal<Slide[]>([]);

  currentSlideIndex = signal(0);
  
  // A signal to add a little sparkle ✨
  showSparkles = signal(false);
  
  // State for MCQ
  selectedOptionIndex = signal<number | null>(null);
  showAnswer = signal(false);

  // Pagination for slide dots
  paginationGroupSize = 4;
  
  private awardAudio: HTMLAudioElement;

  currentPaginationPage = computed(() => {
    return Math.floor(this.currentSlideIndex() / this.paginationGroupSize);
  });
  
  totalPaginationPages = computed(() => {
    return Math.ceil(this.slides().length / this.paginationGroupSize);
  });

  visiblePaginationDots = computed(() => {
    const page = this.currentPaginationPage();
    const start = page * this.paginationGroupSize;
    const end = Math.min(start + this.paginationGroupSize, this.slides().length);
    
    const dots: { index: number }[] = [];
    for (let i = start; i < end; i++) {
      dots.push({ index: i });
    }
    return dots;
  });

  constructor() {
    this.initializeSlides();

    this.awardAudio = new Audio('https://github.com/harunguyenvn-dev/data/raw/refs/heads/main/NH%E1%BA%A0C%20TRAO%20GI%E1%BA%A2I%20TH%C6%AF%E1%BB%9ENG%20%5B-yazjS3PUcQ%5D.m4a');
    this.awardAudio.loop = true;

    // Effect to add/remove sparkles and handle audio when slide changes
    effect(() => {
        const index = this.currentSlideIndex(); // dependency
        this.showSparkles.set(false);
        this.resetMcqState(); // Reset quiz when slide changes
        setTimeout(() => {
            this.showSparkles.set(true);
            setTimeout(() => this.showSparkles.set(false), 2000); // Sparkles last for 2 seconds
        }, 500); // Start sparkles after slide transition

        // Play audio on the last slide (index 26)
        if (index === 26) {
            this.awardAudio.currentTime = 0;
            this.awardAudio.play().catch(error => console.error("Audio playback failed:", error));
        } else {
            if (!this.awardAudio.paused) {
                this.awardAudio.pause();
            }
        }
    });
  }

  ngOnDestroy() {
    // Clean up audio element to prevent memory leaks
    if (this.awardAudio) {
      this.awardAudio.pause();
      this.awardAudio.src = '';
    }
  }

  initializeSlides() {
    const originalSlides: Omit<Slide, 'id'>[] = [
      { type: 'title', title: 'KINH TẾ HỌC CHÍNH TRỊ', subtitle: 'Cạnh tranh và Độc quyền' },
      { 
        type: 'content', 
        title: 'MỤC LỤC',
        points: [
          'I. THẾ NÀO LÀ NỀN KINH TẾ THỊ TRƯỜNG',
          'II. CẠNH TRANH',
          'III. ĐỘC QUYỀN',
          'IV. ĐỘC QUYỀN NHÀ NƯỚC',
          'V. MỐI QUAN HỆ CẠNH TRANH & ĐỘC QUYỀN',
          'VI. CHỦ NGHĨA TƯ BẢN & XU HƯỚNG VẬN ĐỘNG',
        ],
      },
      {
        type: 'content',
        title: 'I. THẾ NÀO LÀ NỀN KINH TẾ THỊ TRƯỜNG',
        content: 'Là một hệ thống kinh tế trong đó các quyết định về sản xuất, phân phối và tiêu thụ hàng hóa, dịch vụ được định hướng chủ yếu bởi quy luật cung cầu trên thị trường. Các đặc điểm chính bao gồm:',
        points: [
            '1. Tự do kinh doanh',
            '2. Cung và cầu quyết định giá cả',
            '3. Độc quyền và sở hữu tư nhân',
            '4. Cạnh tranh',
            '5. Vai trò hạn chế của chính phủ'
        ],
      },
      {
        type: 'example',
        title: 'VÍ DỤ: KINH TẾ THỊ TRƯỜNG TRONG THỰC TẾ',
        example: {
            title: 'Quán Cà Phê trong một Khu Phố',
            description: 'Người bán (Cung): 4 quán cà phê cạnh tranh. Người mua (Cầu): Cư dân và nhân viên văn phòng.',
            points: [
                'Cạnh tranh: Các quán cạnh tranh về giá cả, chất lượng, dịch vụ và khuyến mãi.',
                'Quyết định của người tiêu dùng: Tự do lựa chọn quán phù hợp nhất với túi tiền và sở thích.',
                'Vai trò của giá cả: Giá cả tự điều chỉnh. Tăng khi nhu cầu cao, giảm giá giờ vắng khách để thu hút người mua.'
            ],
            resultTitle: 'Kết Quả Tự Nhiên Của Thị Trường',
            result: [
                'Quán đáp ứng tốt nhu cầu sẽ phát triển, mở rộng.',
                'Quán chất lượng kém, giá cao sẽ bị đào thải.',
            ],
            conclusion: '→ Không ai ra lệnh. Thị trường tự quyết định tất cả.',
        }
      },
      {
        type: 'content',
        title: 'II: CẠNH TRANH LÀ GÌ',
        content: 'Cạnh tranh là sự ganh đua, đấu tranh giữa các chủ thể kinh tế nhằm giành lấy những ưu thế quyết định trên thị trường để đạt được lợi ích tối đa.',
        points: [
          'Đối tượng: Cá nhân, tổ chức, doanh nghiệp.',
          'Mục tiêu: Giành giật nguồn lực, thị phần, khách hàng.',
          'Hành động: Ganh đua, đấu tranh bằng nhiều hình thức.',
          'Kết quả: Giành lợi ích cao hơn và vị thế vượt trội.'
        ]
      },
      {
        type: 'content',
        title: 'NGUYÊN NHÂN DẪN ĐẾN CẠNH TRANH',
        points: [
          'Nhu cầu thị trường và lợi nhuận.',
          'Hạn chế về nguồn lực.',
          'Lợi ích và mục tiêu của các bên khác nhau.',
          'Đổi mới và sáng tạo liên tục.',
          'Bản tính con người: khát khao vươn lên.'
        ]
      },
      {
        type: 'content',
        title: 'Tính đa dạng trong cách thức cạnh tranh',
        subPoints: [
          { title: 'Giữa các chủ thể', items: ['Người mua vs. Bán', 'Người mua vs. Mua', 'Người bán vs. Bán'] },
          { title: 'Trong cấu trúc ngành', items: ['Cạnh tranh nội bộ ngành', 'Cạnh tranh giữa các ngành'] },
          { title: 'Các loại hình chính', items: ['Cạnh tranh hoàn hảo', 'Cạnh tranh không hoàn hảo', 'Cạnh tranh độc quyền'] },
          { title: 'Theo tính chất', items: ['Cạnh tranh lành mạnh', 'Cạnh tranh không lành mạnh'] }
        ]
      },
      {
        type: 'content',
        title: 'Đặc điểm của cạnh tranh',
        points: [
          'Tính động lực: Buộc doanh nghiệp phải liên tục cải tiến để tồn tại và phát triển.',
          'Sự tham gia của nhiều bên: Tạo ra một môi trường kinh doanh sôi nổi và đa dạng.',
          'Tính công bằng: Trong thị trường lành mạnh, cạnh tranh dựa trên năng lực thực sự.',
          'Tác động đến người tiêu dùng: Mang lại giá thấp hơn, chất lượng tốt hơn, nhiều lựa chọn hơn.',
          'Tính liên tục: Không ngừng diễn ra và thay đổi theo xu hướng thị trường, công nghệ.'
        ]
      },
      {
        type: 'content',
        title: 'BẢN CHẤT CỦA CẠNH TRANH',
        points: [
          'Là động lực cốt lõi của kinh tế thị trường, thúc đẩy hiệu quả.',
          'Phản ánh sự tương tác, cân bằng giữa cung và cầu.',
          'Là quy luật tự nhiên, tất yếu để sinh tồn và phát triển.',
          'Kích thích đổi mới công nghệ và tiến bộ xã hội.',
          'Có hai mặt: Tích cực (thúc đẩy) và Tiêu cực (hành vi không lành mạnh).'
        ]
      },
      {
        type: 'example',
        title: 'VÍ DỤ VỀ CẠNH TRANH',
        example: {
            title: 'Cạnh tranh trong ngành Công nghệ',
            description: 'Cuộc đua không hồi kết giữa Apple và Samsung là ví dụ điển hình.',
            points: [
                'Cạnh tranh phi giá: Liên tục ra mắt sản phẩm mới với tính năng vượt trội (camera, chip, màn hình).',
                'Cạnh tranh về giá: Điều chỉnh giá các model cũ hoặc tung ra các chương trình khuyến mãi.'
            ],
            resultTitle: 'Cạnh tranh trong ngành Bán lẻ',
            result: [
                'Co.opmart và Big C cạnh tranh bằng cách cung cấp chương trình khuyến mãi, giảm giá hàng tuần.',
                'Họ cũng cạnh tranh về trải nghiệm mua sắm và xây dựng thương hiệu thân thiện.'
            ],
            conclusion: '→ Cạnh tranh diễn ra đa dạng, và người tiêu dùng là người hưởng lợi cuối cùng.'
        }
      },
      {
        type: 'content',
        title: 'KHÁI NIỆM VỀ ĐỘC QUYỀN',
        content: 'Là trạng thái thị trường chỉ có duy nhất một nhà cung cấp sản phẩm hoặc dịch vụ, không có đối thủ cạnh tranh hoặc sản phẩm thay thế gần gũi, cho phép họ kiểm soát hoàn toàn giá cả và sản lượng để tối đa hóa lợi nhuận.',
        points: [
          'Không có đối thủ cạnh tranh trực tiếp.',
          'Không có sản phẩm thay thế gần gũi.',
          'Xuất hiện dưới nhiều hình thức: thị trường, chính phủ, sở hữu trí tuệ...'
        ]
      },
      {
        type: 'content',
        title: 'NGUYÊN NHÂN DẪN ĐẾN ĐỘC QUYỀN',
        points: [
          'Tiến bộ KHKT đòi hỏi sản xuất quy mô lớn.',
          'Cạnh tranh gay gắt loại bỏ doanh nghiệp nhỏ, thúc đẩy liên kết.',
          'Khủng hoảng kinh tế đẩy nhanh quá trình tập trung sản xuất.',
          'Hệ thống tín dụng và công ty cổ phần trở thành đòn bẩy.',
          'Quy luật kinh tế thị trường tự nhiên hướng đến tập trung.',
        ]
      },
      {
        type: 'content',
        title: 'BẢN CHẤT CỦA ĐỘC QUYỀN',
        content: 'Là liên minh giữa các doanh nghiệp lớn, có khả năng định ra "Giá cả độc quyền" để thu "Lợi nhuận độc quyền" cao hơn mức bình quân.',
        subPoints: [
          { 
            title: 'Giá cả độc quyền (k + Pđq)', 
            items: ['Là giá do tổ chức độc quyền áp đặt, gồm chi phí sản xuất và lợi nhuận độc quyền cao.', 'Giá thị trường sẽ dao động xoay quanh mức giá này.'] 
          },
          { 
            title: 'Lợi nhuận độc quyền (P̅ + P)', 
            items: ['Là lợi nhuận cao hơn mức lợi nhuận bình quân.', 'Có được nhờ vị thế thống trị thị trường, không phải cạnh tranh.'] 
          }
        ]
      },
      {
        type: 'content',
        title: 'VÍ DỤ VỀ BẢN CHẤT ĐỘC QUYỀN',
        subtitle: 'Cách các tổ chức độc quyền áp đặt sức mạnh lên thị trường',
        subPoints: [
            { title: '1. Độc quyền bán (EVN)', items: ['Sản xuất ít hơn nhu cầu thị trường.', 'Bán điện với giá cao hơn chi phí.', '→ Tối đa hóa lợi nhuận.'] },
            { title: '2. Độc quyền mua (Cà phê)', items: ['Một tập đoàn duy nhất thu mua tại vùng.', 'Ép giá mua thấp từ nông dân.', '→ Nông dân thiệt, tập đoàn hưởng lợi.'] },
            { title: '3. Giá cả độc quyền (Dược phẩm)', items: ['Chi phí sản xuất: 10k/viên.', 'Giá bán độc quyền: 100k/viên.', '→ Lợi nhuận độc quyền: 90k/viên.'] },
            { title: '4. Giá là "trục" (Apple)', items: ['Apple định giá iPhone ở mức rất cao.', 'Các hãng khác (Samsung) định giá xoay quanh.', '→ Giá Apple trở thành "chuẩn" cho thị trường.'] }
        ]
      },
      {
        type: 'content',
        title: 'ĐẶC ĐIỂM CỦA ĐỘC QUYỀN TRONG NỀN KINH TẾ',
        points: [
          'Quy mô tích tụ và tập trung tư bản rất lớn.',
          'Sức mạnh bị chi phối bởi tư bản tài chính và các tài phiệt.',
          'Xuất khẩu tư bản (đầu tư ra nước ngoài) trở nên phổ biến.',
          'Cạnh tranh để phân chia thị trường thế giới là tất yếu.',
          'Lôi kéo, thúc đẩy chính phủ vào việc phân định lãnh thổ ảnh hưởng.'
        ]
      },
      {
        type: 'example',
        title: 'III: ĐỘC QUYỀN TÁC ĐỘNG TỚI NỀN KINH TẾ NHƯ TẾ NÀO',
        example: {
            title: 'Ví dụ: Công ty Điện lực (EVN)',
            description: 'Độc quyền tự nhiên trong ngành năng lượng.',
            points: [
                'TÍCH CỰC 👍: Hiệu quả về quy mô, tránh lãng phí hạ tầng (chỉ cần 1 hệ thống lưới điện).',
            ],
            resultTitle: 'TIÊU CỰC 👎',
            result: [
                'Dịch vụ có thể kém, giá cao vì không có đối thủ cạnh tranh.',
                'Người dùng không có lựa chọn thay thế khi có sự cố.'
            ],
            conclusion: '→ Độc quyền có thể hiệu quả nhưng dễ dẫn đến giá cao và chất lượng kém vì thiếu vắng cạnh tranh.'
        }
      },
      {
        type: 'content',
        title: 'BIỂU HIỆN MỚI CỦA ĐỘC QUYỀN NGÀY NAY',
        subPoints: [
          { 
            title: '1. Độc quyền công nghệ & dữ liệu',
            items: [
              'Kiểm soát nền tảng số: Các "Big Tech" (GAFA) thống trị qua nền tảng số, kiểm soát thông tin, dữ liệu và quảng cáo.',
              'Độc quyền dữ liệu: Dữ liệu là tài nguyên then chốt, được khai thác để củng cố vị thế, khiến đối thủ khó theo kịp.',
              'Độc quyền sở hữu trí tuệ: Bằng sáng chế, bản quyền trở thành công cụ hạn chế cạnh tranh.'
            ]
          },
          { 
            title: '2. Sự thống trị của tư bản tài chính',
            items: [
              'Đầu tư mạo hiểm & thâu tóm: Các quỹ đầu tư rót vốn vào startups công nghệ tiềm năng rồi thâu tóm hoặc chi phối.',
              'Tích tụ tư bản tốc độ cao: Các công ty công nghệ đạt vị thế độc quyền nhanh hơn nhiều so với trước đây.'
            ]
          },
          { 
            title: '3. Hình thức phức tạp & đa dạng hơn',
            items: [
              'Độc quyền đa quốc gia: Các tập đoàn xuyên quốc gia có sức ảnh hưởng toàn cầu.',
              'Độc quyền ngầm: Các thỏa thuận về giá, thị trường được thực hiện tinh vi, khó bị phát hiện.',
              'Mô hình kinh tế chia sẻ: Nền tảng (Uber, Airbnb) trở thành thế lực độc quyền trong lĩnh vực của mình.'
            ]
          },
          { 
            title: '4. Kết hợp chặt chẽ với Nhà nước',
            items: [
              'Vận động hành lang: Dùng sức mạnh tài chính để ảnh hưởng đến chính sách, pháp luật.',
              'Hợp tác an ninh, quốc phòng: Tham gia dự án chính phủ để tạo mối liên hệ và nhận được sự ủng hộ.'
            ]
          }
        ],
        content: 'Kết luận: Độc quyền ngày nay dựa trên công nghệ, dữ liệu và mạng lưới toàn cầu, đặt ra thách thức lớn cho cạnh tranh lành mạnh, quyền riêng tư và chủ quyền quốc gia.',
      },
      {
        type: 'content',
        title: 'IV: ĐỘC QUYỀN NHÀ NƯỚC',
        content: 'Là việc nhà nước nắm giữ vai trò duy nhất trong một lĩnh vực chiến lược (tài nguyên, năng lượng, quốc phòng) thông qua các tổ chức thuộc sở hữu nhà nước.',
        subtitle: 'Nguyên nhân hình thành',
        points: [
          'Yêu cầu điều tiết kinh tế quy mô lớn.',
          'Đầu tư vào các ngành then chốt nhưng ít lợi nhuận.',
          'Giải quyết mâu thuẫn xã hội và giai cấp.',
          'Đáp ứng yêu cầu hội nhập kinh tế quốc tế.',
          'Tác động của chính sách và cách mạng khoa học công nghệ.'
        ]
      },
      {
        type: 'content',
        title: 'Bản chất của độc quyền nhà nước',
        points: [
          'Độc quyền nhà nước là sự kết hợp sức mạnh của các tổ chức độc quyền tư nhân với sức mạnh của nhà nước tư sản thành một cơ chế thống nhất.',
          'Nhà nước trở thành "tập thể tư bản khổng lồ", can thiệp trực tiếp vào sản xuất và phân phối, bảo vệ lợi ích của các tổ chức độc quyền và duy trì sự phát triển của chủ nghĩa tư bản.'
        ]
      },
      {
        type: 'content',
        title: 'Đặc điểm',
        points: [
          'Vị thế độc quyền: Nhà nước là người cung cấp duy nhất hoặc được giao quyền độc quyền thực hiện hoạt động đó.',
          'Kiểm soát và điều tiết: Nhà nước sử dụng độc quyền để quản lý, điều tiết và kiểm soát các hoạt động kinh tế quan trọng, ví dụ như quản lý đất đai, thủy điện, mỏ dầu và khí.',
          'Cơ chế hoạt động: Nhà nước có thể thực hiện các hoạt động này trực tiếp thông qua các cơ quan của mình, hoặc giao quyền đó cho các tổ chức, cá nhân được nhà nước ủy quyền.',
          'Mục đích: Mục đích có thể là để đảm bảo sự ổn định chính trị - xã hội, đảm bảo sự phát triển kinh tế hiệu quả và công bằng, hoặc để phục vụ lợi ích chung.'
        ]
      },
      {
        type: 'content',
        title: 'Biểu hiện độc quyền nhà nước trong điều kiện ngày nay',
        subPoints: [
          {
            title: 'Tăng trưởng kinh tế nhà nước',
            items: ['Sở hữu nhà nước mở rộng sang các lĩnh vực như hạ tầng (giao thông, cảng biển), giáo dục, y tế, bảo hiểm xã hội và nghiên cứu khoa học cơ bản, không chỉ giới hạn ở những gì cần thiết cho hoạt động bộ máy nhà nước.']
          },
          {
            title: 'Sự đan xen sở hữu nhà nước và tư nhân',
            items: ['Sở hữu nhà nước và sở hữu tư nhân ngày càng gắn kết và đan xen, tạo ra sự liên minh để hỗ trợ và phục vụ lợi ích của các tổ chức độc quyền.']
          },
          {
            title: 'Vai trò điều tiết kinh tế',
            items: [
              'Nhà nước dùng ngân sách để điều tiết kinh tế, ví dụ:',
              '· Cứu trợ các tập đoàn lớn khi khủng hoảng.',
              '· Đầu tư vào các ngành công nghiệp mới đòi hỏi vốn lớn và trình độ khoa học kỹ thuật cao.',
              '· Hỗ trợ giải quyết các vấn đề xã hội như môi trường, an sinh xã hội.'
            ]
          },
          {
            title: 'Liên kết giữa nhà nước và tư bản độc quyền',
            items: [
              '· Liên minh nhân sự: Các tổ chức độc quyền đưa người vào nắm giữ các chức vụ quan trọng trong bộ máy nhà nước và ngược lại, các quan chức nhà nước tham gia vào các tập đoàn lớn.',
              '· Hợp tác về nhân sự: Các hội chủ xí nghiệp hoạt động như cơ quan tham mưu cho nhà nước.'
            ]
          }
        ]
      },
      {
        type: 'content',
        title: 'Tác động của Độc quyền Nhà nước',
        subPoints: [
          { 
            title: 'Tiêu cực 👎', 
            items: [
              'Giá cả cao & Chất lượng thấp: Thiếu cạnh tranh cho phép đặt giá cao tùy ý mà không cần cải tiến.',
              'Trì trệ, thiếu đổi mới: Mất động lực cải tiến công nghệ, nâng cao hiệu quả do không có áp lực.',
              'Hạn chế lựa chọn của người tiêu dùng: Buộc phải chấp nhận sản phẩm duy nhất.',
              'Bóp méo thị trường: Tạo rào cản ngăn cản doanh nghiệp mới gia nhập.',
              'Gia tăng tham nhũng: Vị thế độc quyền dễ bị lạm dụng để tìm kiếm lợi ích bất hợp pháp.'
            ] 
          },
          { 
            title: 'Tích cực 👍', 
            items: [
              'Hiệu quả kinh tế theo quy mô: Giảm chi phí đầu tư, vận hành trong các ngành hạ tầng (điện, nước).',
              'Đảm bảo an ninh và dịch vụ công: Cung cấp ổn định các dịch vụ thiết yếu (an ninh, y tế, giáo dục).',
              'Công cụ điều tiết vĩ mô: Là công cụ để chính phủ thực hiện chính sách, ổn định thị trường.',
              'Đầu tư vào hạ tầng chiến lược: Thực hiện các dự án lớn, dài hạn mà tư nhân không muốn đầu tư.'
            ] 
          }
        ]
      },
      {
        type: 'content',
        title: 'V: MỐI QUAN HỆ CẠNH TRANH & ĐỘC QUYỀN',
        content: 'Độc quyền sinh ra từ cạnh tranh tự do, nhưng không thủ tiêu cạnh tranh. Ngược lại, nó làm cho cạnh tranh trở nên đa dạng và gay gắt hơn.',
        points: [
          'Cạnh tranh giữa tổ chức độc quyền và các doanh nghiệp ngoài độc quyền.',
          'Cạnh tranh khốc liệt giữa các tổ chức độc quyền với nhau (cùng ngành hoặc khác ngành).'
        ]
      },
      {
        type: 'content',
        title: 'VI. VAI TRÒ CỦA CHỦ NGHĨA TƯ BẢN',
        subPoints: [
          { title: 'Vai trò Tích cực', items: ['Phát triển mạnh mẽ lực lượng sản xuất.', 'Xã hội hóa sản xuất, tạo ra khối lượng của cải vật chất khổng lồ.'] },
          { title: 'Những giới hạn', items: ['Mục đích vì lợi nhuận thiểu số, không phải vì xã hội.', 'Là nguyên nhân gây ra chiến tranh, xung đột.', 'Khoét sâu bất bình đẳng giàu nghèo trong quốc gia và toàn cầu.'] }
        ]
      },
      {
        type: 'content',
        title: 'XU HƯỚNG VẬN ĐỘNG CỦA CHỦ NGHĨA TƯ BẢN',
        content: 'Mâu thuẫn cơ bản không thể khắc phục: Giữa tính chất xã hội hóa cao của sản xuất và sở hữu tư nhân tư bản chủ nghĩa.',
        points: [
          'Để thích nghi, quan hệ sản xuất đã tự điều chỉnh: sở hữu tập thể (cổ phần), quản lý chuyên môn hóa, nhà nước can thiệp...',
          'Những điều chỉnh này chỉ là tạm thời, không giải quyết được mâu thuẫn cốt lõi.',
          'Xu hướng tất yếu: Sẽ bị thay thế bằng một xã hội mới tiến bộ hơn dựa trên sở hữu xã hội.'
        ]
      },

      {
        type: 'mcq',
        title: 'CÂU HỎI TRẮC NGHIỆM',
        mcq: [
          {
            question: 'Yếu tố nào quyết định giá cả trong nền kinh tế thị trường?',
            options: ['A. Chính phủ', 'B. Doanh nghiệp độc quyền', 'C. Quy luật cung và cầu', 'D. Người tiêu dùng'],
            correctOptionIndex: 2
          },
        ]
      },
      { 
        type: 'takeaway', 
        title: 'CẢM ƠN ĐÃ LẮNG NGHE!',
      },
    ];

    this.slides.set(originalSlides.map((slide, index) => ({ ...slide, id: index })));
  }
  
  selectOption(index: number) {
      if (this.showAnswer()) return; // Don't allow changing answer
      this.selectedOptionIndex.set(index);
      this.showAnswer.set(true);
  }

  resetMcqState() {
      this.selectedOptionIndex.set(null);
      this.showAnswer.set(false);
  }

  nextSlide() {
    this.resetMcqState();
    this.currentSlideIndex.update(i => (i + 1) % this.slides().length);
  }

  prevSlide() {
    this.resetMcqState();
    this.currentSlideIndex.update(i => (i - 1 + this.slides().length) % this.slides().length);
  }

  goToSlide(index: number) {
    if (index >= 0 && index < this.slides().length) {
      this.resetMcqState();
      this.currentSlideIndex.set(index);
    }
  }

  nextPage() {
    const currentPage = this.currentPaginationPage();
    const totalPages = this.totalPaginationPages();
    if (currentPage < totalPages - 1) {
        const nextPageIndex = (currentPage + 1) * this.paginationGroupSize;
        this.goToSlide(nextPageIndex);
    }
  }

  prevPage() {
    const currentPage = this.currentPaginationPage();
    if (currentPage > 0) {
        const prevPageIndex = (currentPage - 1) * this.paginationGroupSize;
        this.goToSlide(prevPageIndex);
    }
  }

  // Helper for sparkle positions
  sparklePositions = [
    { top: '15%', left: '20%' }, { top: '25%', left: '80%' }, { top: '75%', left: '10%' }, { top: '85%', left: '90%' }, { top: '50%', left: '50%'}
  ];
}
