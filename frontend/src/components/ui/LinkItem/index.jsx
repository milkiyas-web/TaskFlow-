import mergeTW from "utils/mergeTW";
import Link from "next/link";
import { AnchorHTMLAttributes, ReactNode } from "react";
import { buttonVariants } from "components/variants";



export default ({
    children,
    href,
    className = "",
    variant = "default",
    ...props
}) => (
    <Link
        {...props}
        href={href}
        className={mergeTW(`${buttonVariants[variant]} ${className}`)}
    >
        {children}
    </Link>
);