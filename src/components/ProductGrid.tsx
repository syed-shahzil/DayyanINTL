import React from 'react';
import { products } from '../data/products';
import { ThreeDCard } from './ThreeDCard';
import { motion } from 'framer-motion';

export const ProductGrid: React.FC = () => {
    const handleContact = (productName: string) => {
        const email = "DayyanINTL@gmail.com";
        const subject = encodeURIComponent(`Inquiry about ${productName}`);
        const body = encodeURIComponent(`Hello,\n\nI am interested in the ${productName}. Could you please provide more information regarding pricing and delivery?\n\nThank you.`);
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight"
                >
                    Surgical <span className="text-primary-accent italic">Instruments</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-neutral-400 max-w-2xl mx-auto text-lg"
                >
                    Precision-engineered medical instruments for modern surgical procedures.
                    Crafted with excellence, delivered with care.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <ThreeDCard
                            name={product.name}
                            image={product.image}
                            onContact={() => handleContact(product.name)}
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
