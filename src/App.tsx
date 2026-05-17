import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ShoppingCart, Search, Menu, Leaf, ArrowLeft, Star, ChevronDown, Check, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

import heroBg from './assets/images/hero_tobacco_bg_1779029674717.png';
import cigarProduct from './assets/images/cigar_product_1779029695874.png';
import pipeProduct from './assets/images/pipe_tobacco_product_1779029712183.png';
import coffeeProduct from './assets/images/coffee_tobacco_product_1779029728423.png';
import hookahProduct from './assets/images/hookah_product_1779029743557.png';
import craftsmanshipImg from './assets/images/craftsmanship_image_1779029760122.png';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  priceNumber: number;
  image: string;
};

export type CartItem = Product & {
  quantity: number;
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "سیگار برگ کوبایی",
    description: "دست‌ساز، با طعمی عمیق و گیرایی بالا برای افراد خاص پسند.",
    price: "۲,۵۰۰,۰۰۰ تومان",
    priceNumber: 2500000,
    image: cigarProduct,
  },
  {
    id: 2,
    name: "توتون پیپ کلاسیک",
    description: "ترکیبی ملایم و شیرین از بهترین مزارع ویرجینیا.",
    price: "۸۵۰,۰۰۰ تومان",
    priceNumber: 850000,
    image: pipeProduct,
  },
  {
    id: 3,
    name: "قهوه و تنباکو پریمیوم",
    description: "بسته‌بندی ویژه کادویی، عصاره‌ای از حس اصالت.",
    price: "۱,۲۰۰,۰۰۰ تومان",
    priceNumber: 1200000,
    image: coffeeProduct,
  },
  {
    id: 4,
    name: "تنباکو قلیان عربی",
    description: "با اسانس طبیعی سیب دوسیب اصل و ماندگاری دود طولانی.",
    price: "۳۵۰,۰۰۰ تومان",
    priceNumber: 350000,
    image: hookahProduct,
  }
];

const STAGGER_TEXT = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const PARENT_VARIANT = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const heroRef = useRef(null);
  
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.priceNumber * item.quantity), 0);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (selectedProduct || cartOpen || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--removed-body-scrollbar-width, 0px)'; // prevent layout shift if scrollbar hides
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [selectedProduct, cartOpen, mobileMenuOpen]);

  return (
    <div className="min-h-screen text-gray-100 bg-[var(--bg-void)] selection:bg-[var(--gold-primary)] selection:text-black">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-4' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer z-50">
            <Leaf className="w-8 h-8 text-[var(--gold-primary)]" />
            <span className="font-display text-2xl tracking-wide mt-1">توباکو <span className="text-[var(--gold-primary)]">پریمیوم</span></span>
          </div>

          <div className="hidden md:flex gap-10 text-sm font-medium">
            {['محصولات', 'درباره ما', 'تضمین کیفیت', 'تماس'].map((item, i) => (
              <a 
                key={i}
                href={`#${item}`} 
                className="relative text-white/70 hover:text-white transition-colors duration-300 group overflow-hidden"
              >
                <span>{item}</span>
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[var(--gold-primary)] translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6 z-50">
            <button className="hidden md:block group">
              <Search className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </button>
            <button className="relative group" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--gold-primary)] rounded-full text-black text-[10px] font-bold flex items-center justify-center"
                  >
                    {new Intl.NumberFormat('fa-IR').format(cartItemCount)}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[var(--bg-void)]/95 backdrop-blur-xl pt-32 px-6 flex flex-col gap-8 md:hidden"
          >
            {['محصولات', 'درباره ما', 'تضمین کیفیت', 'تماس'].map((item, i) => (
              <motion.a 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                href={`#${item}`} 
                className="text-3xl font-display text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[100svh] flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-void)]/60 to-[var(--bg-void)] z-10" />
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src={heroBg} 
            className="w-full h-full object-cover opacity-60"
            alt="Hero Background"
          />
        </motion.div>

        <motion.div 
          style={{ y: textY, opacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-20"
        >
          <motion.div 
            variants={PARENT_VARIANT}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={STAGGER_TEXT} className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[1px] bg-[var(--gold-primary)]"></span>
              <span className="text-[var(--gold-primary)] text-sm uppercase tracking-[0.3em] font-medium">کالکشن اکسکلوسیو ۲۰۲۴</span>
            </motion.div>
            
            <motion.h1 variants={STAGGER_TEXT} className="font-display text-6xl md:text-8xl leading-[1.1] md:leading-[1] mb-8">
              هنر، اصالت و <br />
              <span className="text-gold-gradient">طعم کلاسیک</span>
            </motion.h1>
            
            <motion.p variants={STAGGER_TEXT} className="text-lg md:text-xl text-white/60 mb-12 leading-relaxed font-light max-w-xl">
              مجموعه‌ای بی‌نظیر از بهترین مزارع تنباکوی جهان. 
              تجربه‌ای لوکس و دست‌چین شده برای افرادی که به دنبال کمال هستند.
            </motion.p>
            
            <motion.div variants={STAGGER_TEXT} className="flex flex-col sm:flex-row items-center gap-6">
              <button className="btn-gold w-full sm:w-auto px-8 py-4 rounded-full text-sm">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  خرید محصولات
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="group w-full sm:w-auto px-8 py-4 rounded-full font-medium text-sm text-white/80 hover:text-white transition-colors relative">
                <span className="absolute inset-0 border border-white/20 rounded-full group-hover:border-white/50 transition-colors" />
                کاتالوگ محصولات
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 block rotate-90 mb-4">اسکرول</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-32 bg-[var(--bg-void)] relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="w-8 h-[1px] bg-[var(--gold-primary)]"></span>
                <span className="text-[var(--gold-primary)] text-sm uppercase tracking-[0.2em]">بهترین‌ها</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-white">انتخاب‌های ویژه</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-sm text-white/60 hover:text-[var(--gold-primary)] transition-colors group pb-2 border-b border-white/10 hover:border-[var(--gold-primary)]">
              مشاهده کامل فروشگاه
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map((product, index) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group liquid-card cursor-pointer flex flex-col p-4 rounded-2xl"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-[4/5] product-img-wrap rounded-xl mb-6 bg-[var(--bg-surface)]">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute top-4 left-4">
                    <button 
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[var(--gold-primary)] hover:text-black transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                        setCartOpen(true);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col flex-grow">
                  <h3 className="text-xl font-medium mb-2 group-hover:text-[var(--gold-primary)] transition-colors">{product.name}</h3>
                  <p className="text-sm text-white/50 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                  <p className="text-[var(--gold-primary)] font-semibold mt-auto">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <a href="#" className="inline-flex items-center gap-2 text-sm text-[var(--gold-primary)] border border-[var(--gold-primary)]/30 px-6 py-3 rounded-full">
              مشاهده همه محصولات
              <ArrowLeft className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section Parallax */}
      <section className="py-32 relative overflow-hidden bg-[var(--bg-dark)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 overflow-hidden rounded-xl"
            >
              <img 
                src={craftsmanshipImg} 
                alt="Craftsmanship"
                className="w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 border border-white/10 rounded-xl m-4 z-10 pointer-events-none" />
            </motion.div>
            
            <motion.div 
              variants={PARENT_VARIANT}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:pr-12"
            >
              <motion.div variants={STAGGER_TEXT} className="flex items-center gap-4 mb-8">
                <span className="text-[var(--gold-primary)] text-sm uppercase tracking-[0.2em]">میراث ما</span>
                <span className="w-12 h-[1px] bg-[var(--gold-primary)]"></span>
              </motion.div>
              
              <motion.h3 variants={STAGGER_TEXT} className="font-display text-4xl md:text-5xl mb-8 leading-[1.2]">
                هنر خلق <br/><span className="text-gold-gradient">طعم‌های ماندگار</span>
              </motion.h3>
              
              <motion.p variants={STAGGER_TEXT} className="text-white/60 leading-relaxed mb-10 text-lg font-light">
                هر برگ از محصولات ما داستانی از دل بهترین مزارع جهان را روایت می‌کند. 
                ما با دقت و وسواس، محصولاتی را انتخاب می‌کنیم که فرآیند تخمیر و 
                نگهداری آنها تحت سخت‌گیرانه‌ترین استانداردهای جهانی انجام شده است.
              </motion.p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  "تضمین ۱۰۰٪ اصالت کالا",
                  "بسته‌بندی ویژه حفظ رطوبت",
                  "ارسال سریع و مطمئن",
                  "مشاوره تخصصی خرید"
                ].map((item, i) => (
                  <motion.div variants={STAGGER_TEXT} key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--gold-primary)]/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-[var(--gold-primary)]" />
                    </div>
                    <span className="text-sm font-medium text-white/80">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--bg-void)] pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-primary)]/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 text-sm">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-8">
                <Leaf className="w-8 h-8 text-[var(--gold-primary)]" />
                <span className="font-display text-2xl text-white">توباکو پریمیوم</span>
              </div>
              <p className="leading-relaxed text-white/50 mb-8 font-light">
                بالاترین سطح کیفیت و اصالت در ارائه محصولات دخانیاتی. 
                تجربه‌ای متفاوت برای آنان که قدر لحظات را می‌دانند.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-6 uppercase tracking-widest text-xs opacity-70">مسیرهای سریع</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="text-white/50 hover:text-[var(--gold-primary)] transition-colors">درباره مجموعه</a></li>
                <li><a href="#" className="text-white/50 hover:text-[var(--gold-primary)] transition-colors">تماس با پشتیبانی</a></li>
                <li><a href="#" className="text-white/50 hover:text-[var(--gold-primary)] transition-colors">شرایط و قوانین</a></li>
                <li><a href="#" className="text-white/50 hover:text-[var(--gold-primary)] transition-colors">پیگیری سفارشات</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6 uppercase tracking-widest text-xs opacity-70">دسته‌بندی‌ها</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="text-white/50 hover:text-[var(--gold-primary)] transition-colors">سیگار برگ پریمیوم</a></li>
                <li><a href="#" className="text-white/50 hover:text-[var(--gold-primary)] transition-colors">توتون پیپ کلاسیک</a></li>
                <li><a href="#" className="text-white/50 hover:text-[var(--gold-primary)] transition-colors">تنباکو قلیان ویژه</a></li>
                <li><a href="#" className="text-white/50 hover:text-[var(--gold-primary)] transition-colors">اکسسوری لوکس</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6 uppercase tracking-widest text-xs opacity-70">عضویت در کلوپ</h4>
              <p className="mb-6 text-white/50 font-light leading-relaxed">با عضویت در خبرنامه از محصولات جدید و پیشنهادات ویژه مطلع شوید.</p>
              <form className="relative flex">
                <input 
                  type="email" 
                  placeholder="آدرس ایمیل" 
                  className="w-full bg-[var(--bg-surface)] border border-white/10 rounded-full py-4 px-6 outline-none focus:border-[var(--gold-primary)]/50 transition-colors text-white placeholder:text-white/30 text-sm"
                />
                <button type="button" className="btn-gold absolute left-2 top-2 bottom-2 px-6 rounded-full text-xs">
                  عضویت
                </button>
              </form>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6 text-white/40 text-xs">
            <p>تمامی حقوق برای توباکو پریمیوم محفوظ است © ۲۰۲۴</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors tracking-wider uppercase">Instagram</a>
              <a href="#" className="hover:text-white transition-colors tracking-wider uppercase">Telegram</a>
              <a href="#" className="hover:text-white transition-colors tracking-wider uppercase">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[var(--bg-void)]/80 backdrop-blur-md z-50"
              onClick={() => setCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-full max-w-md bg-[var(--bg-dark)]/95 backdrop-blur-xl z-50 border-r border-white/10 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center pb-6 border-b border-white/10">
                <h2 className="text-xl font-display text-white">سبد خرید</h2>
                <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6">
                {cartItems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex flex-col items-center justify-center h-full text-white/50 gap-4"
                  >
                    <ShoppingCart className="w-12 h-12 opacity-20" />
                    <p>سبد خرید شما خالی است</p>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex gap-4 group"
                      >
                        <div className="w-20 h-24 rounded-lg bg-[var(--bg-surface)] overflow-hidden flex-shrink-0 relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <h4 className="text-white text-sm font-medium mb-1 line-clamp-1">{item.name}</h4>
                            <p className="text-[var(--gold-primary)] text-sm font-semibold">{formatPrice(item.priceNumber)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{new Intl.NumberFormat('fa-IR').format(item.quantity)}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[var(--gold-primary)] hover:bg-[var(--gold-primary)]/20 transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-white/40 hover:text-red-400 transition-colors self-start p-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
              
              <div className="pt-6 border-t border-white/10 mt-auto">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white/70">جمع کل:</span>
                  <span className="text-2xl font-bold text-[var(--gold-primary)]">{formatPrice(cartTotal)}</span>
                </div>
                <button 
                  className={`btn-gold w-full py-4 rounded-full text-sm flex justify-center items-center gap-2 ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={cartItems.length === 0}
                >
                  ثبت سفارش و پرداخت
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 glass-modal z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[var(--bg-surface)] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative shadow-2xl"
              >
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="absolute top-4 left-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="w-full md:w-1/2 bg-[var(--bg-void)] p-6 md:p-12 flex items-center justify-center relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--gold-primary)]/10 to-transparent opacity-50" />
                  <motion.img 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-auto max-h-[25vh] md:max-h-[50vh] object-contain relative z-10 drop-shadow-2xl"
                  />
                </div>
                
                <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-4 h-4 text-[var(--gold-primary)] fill-[var(--gold-primary)]" />
                      <Star className="w-4 h-4 text-[var(--gold-primary)] fill-[var(--gold-primary)]" />
                      <Star className="w-4 h-4 text-[var(--gold-primary)] fill-[var(--gold-primary)]" />
                      <Star className="w-4 h-4 text-[var(--gold-primary)] fill-[var(--gold-primary)]" />
                      <Star className="w-4 h-4 text-[var(--gold-primary)] fill-[var(--gold-primary)]" />
                      <span className="text-xs text-white/50 mr-2">(۴.۹/۵ از ۱۲۸ نقد)</span>
                    </div>
                    
                    <h2 className="text-2xl md:text-4xl font-display text-white mb-4 leading-tight">{selectedProduct.name}</h2>
                    <p className="text-xl md:text-2xl text-[var(--gold-primary)] font-semibold mb-6">{selectedProduct.price}</p>
                    
                    <div className="w-12 h-[1px] bg-white/20 mb-6"></div>
                    
                    <p className="text-white/60 leading-relaxed mb-8 font-light text-sm md:text-base">
                      {selectedProduct.description}
                      <br /><br />
                      این محصول با دقت و مهارت فراوان تولید شده است تا تجربه‌ای بی‌نظیر و خالص را برای شما به ارمغان بیاورد. بهترین انتخاب برای لحظات خاص.
                    </p>
                    
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          addToCart(selectedProduct);
                          setCartOpen(true);
                          setSelectedProduct(null);
                        }}
                        className="btn-gold flex-1 py-4 rounded-full text-sm flex justify-center items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        افزودن به سبد خرید
                      </button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

