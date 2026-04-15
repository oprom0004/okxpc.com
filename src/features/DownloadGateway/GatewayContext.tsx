'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import DownloadGateway from './components/DownloadGateway';

interface GatewayContextType {
    openGateway: () => void;
    closeGateway: () => void;
}

const GatewayContext = createContext<GatewayContextType | undefined>(undefined);

// 通用 CTA class 关键词 —— 命中任意一个即拦截弹窗
const CTA_CLASS_KEYWORDS = [
    'btn-primary',
    'bg-blue-600',
    'bg-blue-700',
    'bg-gradient-to-r',
    'shadow-lg',
    'shadow-xl',
];

function shouldOpenGateway(target: HTMLElement) {
    const clickable = target.closest('a,button') as HTMLElement | null;
    if (!clickable) return false;
    if (clickable.getAttribute('data-cta') === 'false') return false;
    if (clickable.getAttribute('data-cta') === 'true') return true;

    const className = clickable.className || '';
    const href = clickable instanceof HTMLAnchorElement ? clickable.getAttribute('href') || '' : '';

    const hasCtaClass = CTA_CLASS_KEYWORDS.some((k) => className.includes(k));
    const hasOkxHref = href.toLowerCase().includes('okx.com');

    const insideNav = !!clickable.closest('nav');
    if (insideNav && !hasCtaClass) return false;

    return hasCtaClass || hasOkxHref;
}

function CtaClickInterceptor() {
    const { openGateway } = useGateway();

    React.useEffect(() => {
        const onClickCapture = (event: MouseEvent) => {
            if (event.defaultPrevented) return;
            const target = event.target as HTMLElement | null;
            if (!target) return;
            if (!shouldOpenGateway(target)) return;
            event.preventDefault();
            event.stopPropagation();
            openGateway();
        };

        document.addEventListener('click', onClickCapture, true);
        return () => document.removeEventListener('click', onClickCapture, true);
    }, [openGateway]);

    return null;
}

export function GatewayProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openGateway = () => setIsOpen(true);
    const closeGateway = () => setIsOpen(false);

    return (
        <GatewayContext.Provider value={{ openGateway, closeGateway }}>
            <CtaClickInterceptor />
            {children}
            <DownloadGateway
                isOpen={isOpen}
                onClose={closeGateway}
            />
        </GatewayContext.Provider>
    );
}

export function useGateway() {
    const context = useContext(GatewayContext);
    if (context === undefined) {
        throw new Error('useGateway must be used within a GatewayProvider');
    }
    return context;
}

interface GatewayTriggerProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    asChild?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

export function GatewayTrigger({ children, className, style, onClick, ...props }: GatewayTriggerProps) {
    const { openGateway } = useGateway();

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) onClick(e);
        openGateway();
    };

    return (
        <button className={className} style={style} onClick={handleClick} {...props}>
            {children}
        </button>
    );
}
