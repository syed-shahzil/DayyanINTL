import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../lib/utils';

interface ThreeDCardProps {
    name: string;
    image: string;
    className?: string;
    onContact: () => void;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({ name, image, className, onContact }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setHovered(false);
    };

    return (
        <div
            className={cn("perspective-1000 w-full h-full", className)}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
            ref={ref}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={cn(
                    "relative w-full aspect-[4/5] rounded-2xl glass transition-shadow duration-300 flex flex-col p-5",
                    hovered ? "shadow-3d shadow-primary-500/20" : "shadow-xl"
                )}
            >
                <div
                    className="relative w-full flex-1 rounded-xl overflow-hidden bg-neutral-900/50 flex items-center justify-center p-4 mb-4"
                    style={{ transform: "translateZ(60px)" }}
                >
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        loading="lazy"
                    />
                </div>

                <div
                    className="space-y-3"
                    style={{ transform: "translateZ(90px)" }}
                >
                    <h3 className="text-base md:text-lg font-display font-semibold text-white leading-tight min-h-[3rem] flex items-center">
                        {name}
                    </h3>
                    <button
                        onClick={onContact}
                        className="w-full py-2.5 px-6 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors glass-hover border border-primary-400/20 text-sm"
                    >
                        Contact Now
                    </button>
                </div>

                {/* Shine effect */}
                <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                        background: "radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(0, 242, 254, 0.1) 0%, transparent 80%)",
                        transform: "translateZ(110px)",
                    }}
                />
            </motion.div>
        </div>
    );
};
